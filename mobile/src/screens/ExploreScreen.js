import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { allBooks, bookRating } from '../lib/books';
import { genres } from '../data';
import { colors, serif } from '../theme';
import Cover from '../components/Cover';
import { SectionHeader, Chip } from '../components/ui';

export default function ExploreScreen({ navigation, route }) {
  const app = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
      setQuery('');
      navigation.setParams({ category: undefined });
    }
  }, [route.params?.category]);

  const q = query.trim().toLowerCase();
  const active = q.length > 0 || category;
  let results = allBooks(app.customBooks);
  if (category) results = results.filter((b) => b.genre === category);
  if (q) results = results.filter((b) => (b.title + ' ' + b.author + ' ' + b.genre).toLowerCase().indexOf(q) !== -1);

  const open = (id) => navigation.navigate('Book', { bookId: id });
  const trending = allBooks(app.customBooks).slice().sort((a, b) => bookRating(app.reviewsByBook, b) - bookRating(app.reviewsByBook, a)).slice(0, 6);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Explorer</Text>

        <View style={styles.search}>
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            style={{ flex: 1, fontSize: 14.5, color: colors.text }}
            value={query}
            onChangeText={(t) => { setQuery(t); setCategory(null); }}
            onSubmitEditing={() => app.addRecent(query)}
            placeholder="Titre, auteur, genre…"
            placeholderTextColor={colors.muted2}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {q ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={18} color={colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {active ? (
          <>
            {category ? (
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <Chip label={category} active red onPress={() => setCategory(null)}>
                  <Feather name="x" size={13} color="#fff" />
                </Chip>
              </View>
            ) : null}
            <Text style={styles.count}>{results.length} résultat{results.length > 1 ? 's' : ''}</Text>
            {results.length ? (
              <View style={styles.grid}>
                {results.map((b) => (
                  <View key={b.id} style={styles.gridItem}>
                    <Cover book={b} width="100%" height={150} onPress={() => open(b.id)} />
                    <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.empty}>Aucun résultat pour cette recherche.</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.text, paddingTop: 14, paddingBottom: 8 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.soft, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  count: { fontSize: 13, color: colors.muted, fontWeight: '600', marginTop: 16, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '31%', marginBottom: 16 },
  cardTitle: { fontWeight: '700', fontSize: 12, marginTop: 6, lineHeight: 15, fontFamily: serif, color: colors.text },
  empty: { paddingVertical: 50, textAlign: 'center', color: colors.muted, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
