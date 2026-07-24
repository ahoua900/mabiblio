import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Platform, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { WebView } from 'react-native-webview';
import { useApp } from '../lib/store';
import { getBook } from '../lib/books';
import { LANG_CODES, languages } from '../data';
import { colors, serif, THEMES, FONTS, MARGINS } from '../theme';
import audio from '../lib/audio';
import { animateNext } from '../components/anim';

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function ReaderScreen({ route, navigation }) {
  const app = useApp();
  const book = getBook(app.customBooks, route.params.bookId);
  const [mode, setMode] = useState(route.params.mode || 'text');
  const [page, setPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [lang, setLang] = useState('Français');
  const mounted = useRef(true);

  const prefs = app.prefs;
  const theme = THEMES[prefs.theme];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    mounted.current = true;
    if (mode === 'text') resolvePdf();
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

  async function resolvePdf() {
    try {
      const url = await app.pdfUrl(book);
      if (mounted.current) setPdfUrl(url);
    } catch (e) {}
  }

  function togglePlay() {
    if (!book) return;
    if (playing) { audio.pause(); setPlaying(false); return; }
    setPlaying(true);
    audio.progress = audioProgress;
    audio.start(
      book.summaryFull + ' ' + book.summaryFull,
      { rate: speed, langCode: LANG_CODES[lang] || 'fr-FR' },
      (p) => { if (mounted.current) { setAudioProgress(p); app.setBookProgress(book.id, book.title, book.color, p); } },
      () => { if (mounted.current) { setPlaying(false); setAudioProgress(0); app.setBookProgress(book.id, book.title, book.color, 100); } }
    );
  }

  function switchMode(m) {
    audio.stop();
    setPlaying(false);
    setAudioProgress(0);
    setMode(m);
    if (m === 'text') resolvePdf();
    else { setShowSettings(false); setPdfUrl(null); }
  }

  function changeSpeed(v) {
    setSpeed(v);
    if (playing) { audio.stop(); setTimeout(togglePlayResume, 0); }
    function togglePlayResume() {
      audio.progress = audioProgress;
      audio.start(book.summaryFull + ' ' + book.summaryFull, { rate: v, langCode: LANG_CODES[lang] || 'fr-FR' },
        (p) => { if (mounted.current) { setAudioProgress(p); app.setBookProgress(book.id, book.title, book.color, p); } },
        () => { if (mounted.current) { setPlaying(false); setAudioProgress(0); } });
    }
  }

  if (!book) return <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} />;

  const font = FONTS[prefs.fontKey].family;
  const pad = MARGINS[prefs.margin].pad;

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
      {mode === 'text' && pdfUrl ? (
        <WebView source={{ uri: pdfUrl }} style={{ flex: 1, backgroundColor: theme.bg }} originWhitelist={['*']} />
      ) : mode === 'text' ? (
        <>
          <ScrollView contentContainerStyle={{ paddingHorizontal: pad, paddingTop: 14, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginVertical: 22 }}>
              <Text style={{ fontSize: 12, letterSpacing: 2, color: theme.sub, fontWeight: '700' }}>CHAPITRE {page}</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 8, fontFamily: font, color: theme.fg }}>{book.title}</Text>
            </View>
            {[0, 1, 2].map((i) => (
              <Text key={i} style={{ fontSize: prefs.size, lineHeight: prefs.size * 1.85, marginBottom: 18, color: theme.fg, fontFamily: font, textAlign: 'justify' }}>
                {book.summaryFull}
              </Text>
            ))}
          </ScrollView>
          <View style={styles.bottom}>
            <Slider
              style={{ width: '100%', height: 34 }}
              minimumValue={1}
              maximumValue={book.pageCount}
              step={1}
              value={page}
              minimumTrackTintColor={colors.red}
              maximumTrackTintColor={theme.chip}
              thumbTintColor={colors.red}
              onValueChange={(v) => { const p = Math.round(v); setPage(p); app.setBookProgress(book.id, book.title, book.color, Math.round((p / book.pageCount) * 100)); }}
            />
            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '600', color: theme.sub }}>Page {page} sur {book.pageCount}</Text>
          </View>
        </>
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
              <TouchableOpacity key={l} onPress={() => { setLang(l); if (playing) changeSpeed(speed); }} style={[styles.aChip, { backgroundColor: theme.chip }, lang === l && { backgroundColor: colors.red }]}>
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
          <View style={{ height: 12 }} />
        </View>
      </Modal>
    </SafeAreaView>
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
  bottom: { paddingHorizontal: 22, paddingVertical: 12 },
  playBig: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginBottom: 28, shadowColor: colors.red, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  audioLabel: { fontSize: 11, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 8 },
  audioChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignSelf: 'flex-start', marginBottom: 20 },
  aChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.38)' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: Platform.OS === 'ios' ? 34 : 22 },
  grip: { width: 38, height: 5, borderRadius: 5, backgroundColor: '#E0E0E4', alignSelf: 'center', marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: colors.muted, marginBottom: 8, textTransform: 'uppercase' },
  sheetChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
});
