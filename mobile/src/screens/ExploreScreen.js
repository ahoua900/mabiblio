import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useApp } from '../lib/store';
import { allBooks, bookRating } from '../lib/books';
import { genres } from '../data';
import { colors, serif } from '../theme';
import Cover from '../components/Cover';
import { SectionHeader, Chip, Button } from '../components/ui';
import { FadeInUp } from '../components/anim';
import OnlineResultRow from '../components/OnlineResultRow';
import { searchOnline, resolveDownload } from '../lib/bookSearch';
import { uid } from '../lib/util';

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
    try {
      const found = await resolveDownload(result);
      if (found) {
        const id = uid();
        const dest = FileSystem.documentDirectory + id + '.' + found.ext;
        const dl = await FileSystem.downloadAsync(found.url, dest);
        const book = {
          id,
          title: result.title,
          author: result.authors || 'Auteur inconnu',
          genre: 'Roman',
          age: 'Adultes',
          color: result.color,
          rating: 0,
          language: result.language || 'Français',
          pageCount: 1,
          summaryFull: result.description || `Livre importé depuis ${found.source}.`,
          reviews: [],
          localUri: dl.uri,
          source: found.source,
        };
        await app.addBook(book, dl.uri);
        showToast(`« ${short(result.title)} » ajouté à votre bibliothèque`);
      } else if (result.previewLink) {
        showToast('Pas de fichier téléchargeable — ouverture de l’aperçu…');
        Linking.openURL(result.previewLink).catch(() => {});
      } else {
        showToast('Aucune version disponible pour ce livre.');
      }
    } catch (e) {
      showToast('Échec du téléchargement. Réessayez.');
    } finally {
      setBusyKey(null);
    }
  }

  const q = query.trim().toLowerCase();
  const activeLocal = q.length > 0 || category;
  let localResults = allBooks(app.customBooks);
  if (category) localResults = localResults.filter((b) => b.genre === category);
  if (q) localResults = localResults.filter((b) => (b.title + ' ' + b.author + ' ' + b.genre).toLowerCase().indexOf(q) !== -1);
  const open = (id) => navigation.navigate('Book', { bookId: id });
  const trending = allBooks(app.customBooks).slice().sort((a, b) => bookRating(app.reviewsByBook, b) - bookRating(app.reviewsByBook, a)).slice(0, 6);

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
            onSearch={runOnlineSearch}
            onGet={handleGet}
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

function OnlineSection({ query, loading, error, results, busyKey, onSearch, onGet }) {
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
            <OnlineResultRow result={r} busy={busyKey === r.key} onGet={onGet} />
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
            Google Books pour la recherche, puis téléchargement quand une version libre existe
            (Open Library, Project Gutenberg, Internet Archive).
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
