import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { getBook, bookRating } from '../lib/books';
import { colors, serif } from '../theme';
import Cover from '../components/Cover';
import Stars from '../components/Stars';
import Fab from '../components/Fab';

const TABS = ['Tout', 'Ma liste', 'En cours', 'Mes livres'];

export default function LibraryScreen({ navigation }) {
  const app = useApp();
  const [tab, setTab] = useState('Tout');
  const progress = app.progress;

  let items = [];
  if (tab === 'Ma liste') items = app.readingList.map((id) => getBook(app.customBooks, id)).filter(Boolean);
  else if (tab === 'En cours') items = app.history().map((h) => getBook(app.customBooks, h.id)).filter(Boolean);
  else if (tab === 'Mes livres') items = (app.customBooks || []).slice().reverse();
  else {
    const a = app.readingList.map((id) => getBook(app.customBooks, id)).filter(Boolean);
    const b = (app.customBooks || []).slice().reverse();
    items = a.concat(b).filter((x, i, arr) => arr.indexOf(x) === i);
  }

  const open = (id) => navigation.navigate('Book', { bookId: id });
  const emptyMsg = tab === 'Mes livres' ? "Vous n'avez pas encore ajouté de livre." : tab === 'En cours' ? 'Aucune lecture en cours.' : 'Aucun livre enregistré pour le moment.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Bibliothèque</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingTop: 6 }}>
          {TABS.map((t) => (
            <TouchableOpacity key={t} style={[styles.chip, { backgroundColor: t === tab ? colors.text : colors.soft }]} onPress={() => setTab(t)}>
              <Text style={{ color: t === tab ? '#fff' : '#48484E', fontSize: 13, fontWeight: '600' }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {items.length ? (
          <View style={{ gap: 12, marginTop: 16 }}>
            {items.map((b) => {
              const pr = progress[b.id];
              const v = pr ? Math.round(pr.value) : null;
              return (
                <TouchableOpacity key={b.id} activeOpacity={0.85} style={styles.row} onPress={() => open(b.id)}>
                  <Cover book={b} width={52} height={74} radius={9} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.rowTitle} numberOfLines={2}>{b.title}</Text>
                    <Text style={styles.rowAuthor}>{b.author}</Text>
                    {v != null ? (
                      <View style={styles.track}><View style={[styles.fill, { width: `${v}%` }]} /></View>
                    ) : (
                      <View style={{ marginTop: 6 }}><Stars rating={bookRating(app.reviewsByBook, b)} size={12} /></View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => app.toggleList(b.id)} style={{ padding: 4 }}>
                    <Feather name="bookmark" size={20} color={app.inList(b.id) ? colors.red : colors.muted2} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.empty}>{emptyMsg}</Text>
        )}
      </ScrollView>
      <Fab onPress={() => navigation.navigate('Upload')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.text, paddingTop: 14, paddingBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 12 },
  rowTitle: { fontWeight: '800', fontSize: 14.5, fontFamily: serif, lineHeight: 18, color: colors.text },
  rowAuthor: { fontSize: 12, color: colors.muted, marginTop: 2 },
  track: { height: 4, backgroundColor: colors.soft2, borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.red },
  empty: { paddingVertical: 60, textAlign: 'center', color: colors.muted, fontSize: 14 },
});
