import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { allBooks, bookRating } from '../lib/books';
import { genres } from '../data';
import { colors, serif } from '../theme';
import Cover from '../components/Cover';
import { SectionHeader, Chip, Button } from '../components/ui';
import { FadeInUp } from '../components/anim';
import OnlineResultRow from '../components/OnlineResultRow';
import { searchOnline, toPreviewBook } from '../lib/bookSearch';
import { downloadOnlineBook } from '../lib/download';

export default function ExploreScreen({ navigation, route }) {
  const app = useApp();
  const [scope, setScope] = useState('local'); // 'local' | 'online'
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);

  // Recherche en ligne
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState(null);
  const [dlProgress, setDlProgress] = useState(null); // null = indéterminé, sinon 0..1
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (route.params?.category) {
      setScope('local');
      setCategory(route.params.category);
      setQuery('');
      navigation.setParams({ category: undefined });
    }
  }, [route.params?.category]);

  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  async function runOnlineSearch() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError('');
    setResults([]);
    app.addRecent(q);
    try {
      const r = await searchOnline(q);
      setResults(r);
      if (!r.length) setError('Aucun résultat pour cette recherche.');
    } catch (e) {
      setError('Recherche indisponible. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGet(result) {
    if (busyKey) return;
    setBusyKey(result.key);
    setDlProgress(0);
    try {
      await downloadOnlineBook(app, result, setDlProgress);
      showToast(`« ${short(result.title)} » ajouté à votre bibliothèque`);
    } catch (e) {
      if (e.code === 'NO_FILE' || e.code === 'EPUB_UNREADABLE') {
        if (e.previewLink) {
          showToast(e.code === 'EPUB_UNREADABLE' ? 'EPUB illisible — ouverture de l’aperçu…' : 'Pas de fichier téléchargeable — ouverture de l’aperçu…');
          Linking.openURL(e.previewLink).catch(() => {});
        } else {
          showToast(e.code === 'EPUB_UNREADABLE' ? 'Ce format EPUB n’a pas pu être ouvert.' : 'Aucune version disponible pour ce livre.');
        }
      } else {
        showToast('Échec du téléchargement. Réessayez.');
      }
    } finally {
      setBusyKey(null);
      setDlProgress(null);
    }
  }

  const q = query.trim().toLowerCase();
  const activeLocal = q.length > 0 || category;
  let localResults = allBooks(app.customBooks, app.catalog);
  if (category) localResults = localResults.filter((b) => b.genre === category);
  if (q) localResults = localResults.filter((b) => (b.title + ' ' + b.author + ' ' + b.genre + ' ' + (b.description || '')).toLowerCase().indexOf(q) !== -1);
  const open = (id) => navigation.navigate('Book', { bookId: id });
  const openPreview = (result) => navigation.navigate('Book', { bookId: result.key, previewBook: toPreviewBook(result) });
  const trending = allBooks(app.customBooks, app.catalog).slice().sort((a, b) => bookRating(app.reviewsByBook, b) - bookRating(app.reviewsByBook, a)).slice(0, 6);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Explorer</Text>

        <View style={styles.seg}>
          {[['local', 'Catalogue'], ['online', 'En ligne']].map(([k, label]) => (
            <TouchableOpacity key={k} style={[styles.segItem, scope === k && styles.segItemOn]} onPress={() => setScope(k)}>
              <Text style={[styles.segText, { color: scope === k ? colors.text : colors.muted }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.search}>
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            style={{ flex: 1, fontSize: 14.5, color: colors.text }}
            value={query}
            onChangeText={(t) => { setQuery(t); if (scope === 'local') setCategory(null); }}
            onSubmitEditing={() => (scope === 'online' ? runOnlineSearch() : app.addRecent(query))}
            placeholder={scope === 'online' ? 'Rechercher tous les livres…' : 'Titre, auteur, genre…'}
            placeholderTextColor={colors.muted2}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={18} color={colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {scope === 'online' ? (
          <OnlineSection
            query={query}
            loading={loading}
            error={error}
            results={results}
            busyKey={busyKey}
            dlProgress={dlProgress}
            onSearch={runOnlineSearch}
            onGet={handleGet}
            onOpen={openPreview}
          />
        ) : activeLocal ? (
          <>
            {category ? (
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <Chip label={category} active red onPress={() => setCategory(null)}>
                  <Feather name="x" size={13} color="#fff" />
                </Chip>
              </View>
            ) : null}
            <Text style={styles.count}>{localResults.length} résultat{localResults.length > 1 ? 's' : ''}</Text>
            {localResults.length ? (
              <View style={styles.grid}>
                {localResults.map((b) => (
                  <View key={b.id} style={styles.gridItem}>
                    <Cover book={b} width="100%" height={150} onPress={() => open(b.id)} />
                    <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.empty}>Aucun résultat dans votre catalogue. Essayez « En ligne ».</Text>
            )}
          </>
        ) : (
          <>
            {app.recent.length > 0 && (
              <>
                <SectionHeader title="Recherches récentes" actionLabel="Effacer" onAction={() => app.clearRecent()} />
                <View style={styles.chips}>
                  {app.recent.map((t) => (
                    <Chip key={t} label={t} onPress={() => setQuery(t)}>
                      <TouchableOpacity onPress={() => app.removeRecent(t)}>
                        <Feather name="x" size={13} color={colors.muted} />
                      </TouchableOpacity>
                    </Chip>
                  ))}
                </View>
              </>
            )}

            <SectionHeader title="Tendances" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
              {trending.map((b) => (
                <View key={b.id} style={{ width: 112 }}>
                  <Cover book={b} width={112} height={162} onPress={() => open(b.id)} />
                  <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>
                </View>
              ))}
            </ScrollView>

            <SectionHeader title="Catégories" />
            <View style={styles.chips}>
              {genres.map((g) => (
                <Chip key={g} label={g} onPress={() => setCategory(g)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function OnlineSection({ query, loading, error, results, busyKey, dlProgress, onSearch, onGet, onOpen }) {
  if (loading) {
    return (
      <View style={{ paddingVertical: 50, alignItems: 'center' }}>
        <ActivityIndicator color={colors.red} />
        <Text style={{ color: colors.muted, marginTop: 12, fontSize: 13 }}>Recherche en cours…</Text>
      </View>
    );
  }
  if (results.length) {
    return (
      <View style={{ gap: 12, marginTop: 16 }}>
        <Text style={styles.count}>{results.length} livre{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}</Text>
        {results.map((r, i) => (
          <FadeInUp key={r.key} delay={Math.min(i, 6) * 40}>
            <OnlineResultRow result={r} busy={busyKey === r.key} progress={busyKey === r.key ? dlProgress : null} onGet={onGet} onOpen={onOpen} />
          </FadeInUp>
        ))}
      </View>
    );
  }
  return (
    <View style={{ marginTop: 20 }}>
      {error ? <Text style={styles.empty}>{error}</Text> : (
        <View style={styles.hint}>
          <Feather name="globe" size={26} color={colors.muted2} />
          <Text style={styles.hintTitle}>Recherchez parmi des millions de livres</Text>
          <Text style={styles.hintText}>
            Project Gutenberg pour la recherche et le téléchargement de livres libres.
            Si nécessaire, l’application cherchera ensuite Open Library ou Internet Archive.
          </Text>
        </View>
      )}
      {query.trim() ? <Button title="Rechercher en ligne" onPress={onSearch} style={{ marginTop: 18 }} /> : null}
    </View>
  );
}

function short(t) {
  const s = String(t).split(' — ')[0];
  return s.length > 40 ? s.slice(0, 40) + '…' : s;
}

const styles = StyleSheet.create({
  h1: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.text, paddingTop: 14, paddingBottom: 10 },
  seg: { flexDirection: 'row', backgroundColor: colors.soft, borderRadius: 11, padding: 3, alignSelf: 'flex-start', marginBottom: 12 },
  segItem: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  segItemOn: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  segText: { fontSize: 13, fontWeight: '700' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.soft, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  count: { fontSize: 13, color: colors.muted, fontWeight: '600', marginTop: 16, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '31%', marginBottom: 16 },
  cardTitle: { fontWeight: '700', fontSize: 12, marginTop: 6, lineHeight: 15, fontFamily: serif, color: colors.text },
  empty: { paddingVertical: 40, textAlign: 'center', color: colors.muted, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 16 },
  hintTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 14, fontFamily: serif, textAlign: 'center' },
  hintText: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  toast: { position: 'absolute', left: 20, right: 20, bottom: 22, backgroundColor: colors.text, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
