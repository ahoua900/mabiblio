import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Platform, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { WebView } from 'react-native-webview';
import { useApp } from '../lib/store';
import { getBook } from '../lib/books';
import { LANG_CODES, languages } from '../data';
import { colors, serif, THEMES, FONTS, MARGINS } from '../theme';
import audio from '../lib/audio';
import { animateNext, FadeInUp } from '../components/anim';
import { translateText, translationConfigured } from '../lib/translate';
import { estimateCharsPerPage, paginateText } from '../lib/paginate';
import BookPager from '../components/BookPager';
import SkeletonBlock from '../components/Skeleton';

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function ReaderScreen({ route, navigation }) {
  const app = useApp();
  const book = getBook(app.customBooks, app.catalog, route.params.bookId);
  const [mode, setMode] = useState(route.params.mode || 'text');
  const [showSettings, setShowSettings] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [lang, setLang] = useState('Français');
  const [transLang, setTransLang] = useState('original');
  const [transText, setTransText] = useState(null);
  const [transLoading, setTransLoading] = useState(false);

  // Texte intégral extrait du livre (PDF/EPUB/HTML) pour la pagination et l'écoute.
  const [bookText, setBookText] = useState(null);
  const [textLoading, setTextLoading] = useState(true);
  const [pagerSize, setPagerSize] = useState({ width: 0, height: 0 });
  const [page, setPage] = useState(1);
  const pctRef = useRef(((app.progress[route.params.bookId] || {}).value) || 0);
  const audioPageRef = useRef(null);
  const mounted = useRef(true);

  const prefs = app.prefs;
  const theme = THEMES[prefs.theme];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    mounted.current = true;
    loadText();
    return () => { mounted.current = false; audio.stop(); };
  }, []);

  // Pulsation du bouton lecture pendant l'écoute.
  useEffect(() => {
    let loop;
    if (playing) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
    return () => { if (loop) loop.stop(); };
  }, [playing]);

  async function loadText() {
    setTextLoading(true);
    let t = null;
    try {
      t = await app.getBookText(book);
      if (mounted.current) setBookText(t);
    } finally {
      if (mounted.current) setTextLoading(false);
    }
    // Repli sur l'ancien mode « ouvrir le PDF » seulement si aucun texte n'a pu être préparé.
    if (mounted.current && mode === 'text' && !t) resolvePdfFallback();
  }

  async function resolvePdfFallback() {
    try {
      const url = await app.pdfUrl(book);
      if (mounted.current) setPdfUrl(url);
    } catch (e) {}
  }

  // Pagination façon livre : recalculée quand le texte, la taille de police,
  // les marges ou la taille de la zone de lecture changent.
  const pad = MARGINS[prefs.margin].pad;
  const font = FONTS[prefs.fontKey].family;
  const pages = useMemo(() => {
    if (!bookText || !pagerSize.width || !pagerSize.height) return [];
    const charsPerPage = estimateCharsPerPage(pagerSize.width - pad * 2, pagerSize.height, prefs.size);
    return paginateText(bookText, charsPerPage);
  }, [bookText, pagerSize.width, pagerSize.height, prefs.size, pad]);

  // Repositionne sur la page correspondant à la progression enregistrée dès que
  // la pagination est disponible (ou recalculée après un changement de réglage).
  useEffect(() => {
    if (!pages.length) return;
    const target = Math.min(pages.length, Math.max(1, Math.round((pctRef.current / 100) * pages.length) || 1));
    setPage(target);
  }, [pages.length]);

  function onPageChange(newPage) {
    setPage(newPage);
    if (!book || !pages.length) return;
    const pct = Math.round((newPage / pages.length) * 100);
    pctRef.current = pct;
    app.setBookProgress(book.id, book.title, book.color, pct);
  }

  const audioSource = (bookText && bookText.trim()) || book?.summaryFull || '';
  // En mode Texte, le bouton d'écoute lit uniquement la page affichée (pas le
  // livre entier) ; en mode Écoute dédié, c'est le livre complet.
  const currentPageText = () => pages[page - 1] || book?.summaryFull || '';

  function startReading(text, forPage) {
    audioPageRef.current = forPage != null ? forPage : null;
    setPlaying(true);
    setAudioProgress(0);
    audio.start(
      text,
      { rate: speed, langCode: LANG_CODES[lang] || 'fr-FR' },
      (p) => {
        if (!mounted.current) return;
        setAudioProgress(p);
        if (mode === 'audio') app.setBookProgress(book.id, book.title, book.color, p);
      },
      () => {
        if (!mounted.current) return;
        setPlaying(false);
        setAudioProgress(0);
        if (mode === 'audio') app.setBookProgress(book.id, book.title, book.color, 100);
      }
    );
  }

  function togglePlay() {
    if (!book) return;
    if (playing) {
      // Mode Texte : bouton d'écoute d'une seule page → un second appui arrête
      // complètement (pas de reprise partielle utile sur un texte aussi court).
      // Mode Écoute (livre entier) : pause classique, reprenable.
      if (mode === 'text') { audio.stop(); setPlaying(false); setAudioProgress(0); }
      else { audio.pause(); setPlaying(false); }
      return;
    }
    if (audio.text) { setPlaying(true); audio.resume(); return; }
    startReading(mode === 'text' ? currentPageText() : audioSource, mode === 'text' ? page : null);
  }

  // Fait avancer la lecture audio à la page suivante (proposé quand la page
  // en cours touche à sa fin) et enchaîne directement sa lecture.
  function playNextPage() {
    if (!book || page >= pages.length || transLoading) return;
    audio.stop();
    const nextPage = page + 1;
    onPageChange(nextPage);
    startReading(pages[nextPage - 1] || '', nextPage);
  }

  // Si l'utilisateur tourne la page manuellement pendant l'écoute de la page
  // en cours, on arrête l'audio plutôt que de continuer sur un texte qui ne
  // correspond plus à ce qui est affiché.
  useEffect(() => {
    if (mode === 'text' && playing && audioPageRef.current != null && audioPageRef.current !== page) {
      audio.stop();
      setPlaying(false);
      setAudioProgress(0);
    }
  }, [page]);

  function switchMode(m) {
    audio.stop();
    setPlaying(false);
    setAudioProgress(0);
    setMode(m);
  }

  function changeSpeed(v) {
    setSpeed(v);
    if (playing) audio.setOptions({ rate: v });
  }

  function changeLang(l) {
    setLang(l);
    if (playing) audio.setOptions({ langCode: LANG_CODES[l] || 'fr-FR' });
  }

  function handleTranslate(target) {
    if (target === transLang) return;
    if (target !== 'original' && !translationConfigured()) {
      Alert.alert('Traduction', 'Ajoutez votre clé Mistral (ou une URL de proxy) dans src/config.js pour activer la traduction.');
      return;
    }
    setTransText(null);
    setTransLang(target);
  }

  // Un livre entier ne tient pas dans un seul appel de traduction : on traduit
  // uniquement la page affichée, et on relance automatiquement en tournant les
  // pages (avec mise en cache par page pour éviter les appels répétés).
  useEffect(() => {
    if (transLang === 'original') { setTransText(null); return; }
    const sourceText = pages[page - 1] || book?.summaryFull;
    if (!sourceText) return;
    const cached = app.getTranslation(book.id, transLang, page);
    if (cached) { setTransText(cached); return; }
    let cancelled = false;
    setTransLoading(true);
    translateText(sourceText, transLang)
      .then((t) => {
        if (cancelled) return;
        setTransText(t);
        app.saveTranslation(book.id, transLang, page, t);
      })
      .catch((e) => {
        if (cancelled) return;
        Alert.alert('Traduction', e.message);
        setTransLang('original');
        setTransText(null);
      })
      .finally(() => { if (!cancelled) setTransLoading(false); });
    return () => { cancelled = true; };
  }, [transLang, page, pages]);

  const translated = transLang !== 'original' && transText != null;
  // La page courante est remplacée par sa traduction ; les autres pages restent
  // dans la langue d'origine jusqu'à ce que l'utilisateur les atteigne.
  const displayPages = useMemo(() => {
    if (!translated || !pages[page - 1]) return pages;
    const copy = pages.slice();
    copy[page - 1] = transText;
    return copy;
  }, [pages, translated, transText, page]);

  if (!book) return <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top', 'bottom']}>
      {/* Barre supérieure */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="x" size={24} color={theme.fg} /></TouchableOpacity>
        <View style={[styles.seg, { backgroundColor: prefs.theme === 'light' ? colors.soft : 'rgba(255,255,255,0.12)' }]}>
          {['text', 'audio'].map((m) => (
            <TouchableOpacity key={m} onPress={() => switchMode(m)} style={[styles.segItem, mode === m && { backgroundColor: theme.chip }]}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: mode === m ? theme.fg : theme.sub }}>{m === 'text' ? 'Texte' : 'Écoute'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {mode === 'text' && (
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.chip }]} onPress={() => setShowSettings(true)}>
              <Feather name="sliders" size={19} color={theme.fg} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.chip }]} onPress={() => app.toggleList(book.id)}>
            <Feather name="bookmark" size={19} color={app.inList(book.id) ? colors.red : theme.fg} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Corps */}
      {mode === 'text' && textLoading ? (
        <ReaderSkeleton theme={theme} pad={pad} />
      ) : mode === 'text' && bookText ? (
        <View style={{ flex: 1 }} onLayout={(e) => setPagerSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
          {transLang !== 'original' ? (
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
              {transLoading ? (
                <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: theme.sub }}>TRADUCTION EN COURS…</Text>
              ) : (
                <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: colors.red }}>TRADUIT · {transLang.toUpperCase()}</Text>
              )}
            </View>
          ) : null}
          {pagerSize.width > 0 && displayPages.length > 0 ? (
            <BookPager
              pages={displayPages}
              page={Math.min(page, displayPages.length)}
              onPageChange={onPageChange}
              theme={theme}
              font={font}
              fontSize={prefs.size}
              pad={pad}
              disabled={transLoading}
            />
          ) : null}

          {/* Écoute de la page affichée, sans quitter le mode Texte */}
          <View pointerEvents="box-none" style={styles.pageAudioWrap}>
            {playing && audioProgress >= 85 && page < pages.length && !transLoading ? (
              <FadeInUp distance={8} duration={220}>
                <TouchableOpacity style={styles.nextPill} onPress={playNextPage}>
                  <Text style={styles.nextPillText}>Page suivante</Text>
                  <Feather name="chevron-right" size={14} color="#fff" />
                </TouchableOpacity>
              </FadeInUp>
            ) : null}
            <TouchableOpacity style={styles.pageAudioBtn} onPress={togglePlay}>
              <Feather name={playing ? 'square' : 'play'} size={playing ? 18 : 20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : mode === 'text' && pdfUrl ? (
        <WebView source={{ uri: pdfUrl }} style={{ flex: 1, backgroundColor: theme.bg }} originWhitelist={['*']} />
      ) : mode === 'text' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
          <Feather name="alert-circle" size={26} color={theme.sub} />
          <Text style={{ color: theme.sub, marginTop: 12, fontSize: 13, textAlign: 'center' }}>
            Le texte de ce livre n'a pas pu être préparé.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 28, paddingTop: 20, paddingBottom: 40 }}>
          <View style={{ width: 190, height: 270, borderRadius: 14, backgroundColor: book.color, justifyContent: 'flex-end', padding: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, fontFamily: serif }}>{book.title}</Text>
          </View>
          <Text style={{ fontSize: 19, fontWeight: '800', marginTop: 22, textAlign: 'center', fontFamily: serif, color: theme.fg }}>{book.title}</Text>
          <Text style={{ fontSize: 13.5, color: theme.sub, marginBottom: 26 }}>{book.author}</Text>

          <View style={{ width: '100%', height: 6, backgroundColor: theme.chip, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
            <View style={{ width: `${audioProgress}%`, height: '100%', backgroundColor: colors.red }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24 }}>
            <Text style={{ fontSize: 11.5, color: theme.sub, fontWeight: '600' }}>{Math.round(audioProgress)}%</Text>
            <Text style={{ fontSize: 11.5, color: theme.sub, fontWeight: '600' }}>Synthèse vocale</Text>
          </View>

          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <TouchableOpacity onPress={togglePlay} style={styles.playBig}>
              <Feather name={playing ? 'pause' : 'play'} size={26} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.audioLabel, { color: theme.sub }]}>VITESSE</Text>
          <View style={styles.audioChips}>
            {SPEEDS.map((s) => (
              <TouchableOpacity key={s} onPress={() => changeSpeed(s)} style={[styles.aChip, { backgroundColor: theme.chip }, speed === s && { backgroundColor: colors.red }]}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: speed === s ? '#fff' : theme.fg }}>{s}×</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.audioLabel, { color: theme.sub }]}>LANGUE</Text>
          <View style={styles.audioChips}>
            {languages.map((l) => (
              <TouchableOpacity key={l} onPress={() => changeLang(l)} style={[styles.aChip, { backgroundColor: theme.chip }, lang === l && { backgroundColor: colors.red }]}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: lang === l ? '#fff' : theme.fg }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Panneau de réglages de lecture */}
      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShowSettings(false)} />
        <View style={styles.sheet}>
          <View style={styles.grip} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', fontFamily: serif, color: colors.text }}>Réglages de lecture</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}><Feather name="x" size={22} color={colors.muted} /></TouchableOpacity>
          </View>

          <Label>Tonalité</Label>
          <Row>
            {Object.keys(THEMES).map((k) => (
              <SheetChip key={k} label={THEMES[k].label} active={prefs.theme === k} onPress={() => { animateNext(); app.setReaderPref({ theme: k }); }} />
            ))}
          </Row>

          <Label style={{ marginTop: 20 }}>Taille du texte</Label>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Text style={{ fontSize: 14, color: colors.muted }}>A</Text>
            <Slider
              style={{ flex: 1, height: 34 }}
              minimumValue={14}
              maximumValue={24}
              step={1}
              value={prefs.size}
              minimumTrackTintColor={colors.red}
              maximumTrackTintColor={colors.soft2}
              thumbTintColor={colors.red}
              onValueChange={(v) => app.setReaderPref({ size: Math.round(v) })}
            />
            <Text style={{ fontSize: 22, color: colors.muted }}>A</Text>
          </View>

          <Label style={{ marginTop: 20 }}>Police</Label>
          <Row>
            {Object.keys(FONTS).map((k) => (
              <SheetChip key={k} label={FONTS[k].label} active={prefs.fontKey === k} onPress={() => { animateNext(); app.setReaderPref({ fontKey: k }); }} />
            ))}
          </Row>

          <Label style={{ marginTop: 20 }}>Marges</Label>
          <Row>
            {Object.keys(MARGINS).map((k) => (
              <SheetChip key={k} label={MARGINS[k].label} active={prefs.margin === k} onPress={() => { animateNext(); app.setReaderPref({ margin: k }); }} />
            ))}
          </Row>

          <Label style={{ marginTop: 20 }}>Traduction</Label>
          <Row>
            <SheetChip label="Original" active={transLang === 'original'} onPress={() => handleTranslate('original')} />
            {languages.map((l) => (
              <SheetChip key={l} label={l} active={transLang === l} onPress={() => handleTranslate(l)} />
            ))}
          </Row>
          <Text style={{ fontSize: 11.5, color: colors.muted2, marginTop: 8 }}>
            La traduction se fait page par page et est enregistrée : chaque page n'est traduite qu'une seule fois par langue.
          </Text>
          <View style={{ height: 12 }} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Squelette façon page de livre pendant l'extraction du texte (peut prendre
// plusieurs secondes sur un gros PDF) : évite de laisser l'utilisateur face
// à un écran figé sans indication de progression.
const SKELETON_LINES = ['94%', '86%', '96%', '72%', '90%', '62%', '92%', '80%', '88%', '68%'];
function ReaderSkeleton({ theme, pad }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: pad, paddingTop: 26 }}>
      <SkeletonBlock width={130} height={12} color={theme.chip} style={{ alignSelf: 'center', marginBottom: 12 }} />
      <SkeletonBlock width={190} height={18} color={theme.chip} style={{ alignSelf: 'center', marginBottom: 34 }} />
      {SKELETON_LINES.map((w, i) => (
        <SkeletonBlock key={i} width={w} height={13} color={theme.chip} style={{ marginBottom: 16 }} />
      ))}
    </View>
  );
}

function Label({ children, style }) { return <Text style={[styles.label, style]}>{children}</Text>; }
function Row({ children }) { return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>; }
function SheetChip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.sheetChip, { backgroundColor: active ? colors.text : colors.soft }]}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : '#48484E' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  seg: { flexDirection: 'row', borderRadius: 11, padding: 3 },
  segItem: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  playBig: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginBottom: 28, shadowColor: colors.red, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  pageAudioWrap: { position: 'absolute', left: 0, right: 0, bottom: 40, alignItems: 'center', gap: 10 },
  pageAudioBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', shadowColor: colors.red, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  nextPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.text, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  nextPillText: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
  audioLabel: { fontSize: 11, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 8 },
  audioChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignSelf: 'flex-start', marginBottom: 20 },
  aChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.38)' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: Platform.OS === 'ios' ? 34 : 22 },
  grip: { width: 38, height: 5, borderRadius: 5, backgroundColor: '#E0E0E4', alignSelf: 'center', marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: colors.muted, marginBottom: 8, textTransform: 'uppercase' },
  sheetChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
});
