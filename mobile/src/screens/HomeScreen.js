import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { allBooks, getBook, bookRating } from '../lib/books';
import { genres } from '../data';
import { colors, serif, GENRE_COLORS } from '../theme';
import Cover from '../components/Cover';
import { SectionHeader, Avatar } from '../components/ui';
import Fab from '../components/Fab';
import { FadeInUp, PressableScale } from '../components/anim';

export default function HomeScreen({ navigation }) {
  const app = useApp();
  const books = allBooks(app.customBooks, app.catalog);
  const hist = app.history();
  const current = hist.length ? getBook(app.customBooks, app.catalog, hist[0].id) : null;
  const trending = books.slice().sort((a, b) => bookRating(app.reviewsByBook, b) - bookRating(app.reviewsByBook, a)).slice(0, 8);
  const nouveautes = (app.customBooks || []).slice().reverse().concat(app.catalog || []).slice(0, 8);
  const open = (id) => navigation.navigate('Book', { bookId: id });

  // Les 20 premiers livres du catalogue (Gutenberg), regroupés par catégorie :
  // parcourables directement depuis l'accueil, sans avoir à lancer de recherche.
  const firstTwenty = (app.catalog || []).slice(0, 20);
  const byCategory = genres
    .map((g) => [g, firstTwenty.filter((b) => b.genre === g)])
    .filter(([, items]) => items.length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View>
            <Text style={styles.hello}>Bonjour,</Text>
            <Text style={styles.h1}>{(app.user?.name || '').split(' ')[0]}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
            <Avatar name={app.user?.name} size={42} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.search} onPress={() => navigation.navigate('Explorer')}>
          <Feather name="search" size={18} color={colors.muted} />
          <Text style={{ color: colors.muted2, fontSize: 14.5 }}>Rechercher un livre, un auteur…</Text>
        </TouchableOpacity>

        {current && (
          <FadeInUp delay={60}>
            <SectionHeader title="Reprendre la lecture" />
            <PressableScale style={styles.continue} onPress={() => open(current.id)}>
              <Cover book={current} width={58} height={82} radius={10} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.contTitle} numberOfLines={1}>{current.title}</Text>
                <Text style={styles.contAuthor}>{current.author}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.round(hist[0].value)}%` }]} />
                </View>
                <Text style={styles.contMeta}>
                  {Math.round(hist[0].value) >= 100 ? 'Terminé' : `${Math.round(hist[0].value)}% lu`}
                </Text>
              </View>
              <View style={styles.playBtn}><Feather name="play" size={16} color="#fff" /></View>
            </PressableScale>
          </FadeInUp>
        )}

        <FadeInUp delay={140}>
          <SectionHeader title="Tendances cette semaine" actionLabel="Tout voir" onAction={() => navigation.navigate('Explorer')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
            {trending.map((b) => (
              <View key={b.id} style={{ width: 120 }}>
                <Cover book={b} width={120} height={172} onPress={() => open(b.id)} />
                <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>
                <Text style={styles.cardAuthor} numberOfLines={1}>{b.author}</Text>
              </View>
            ))}
          </ScrollView>
        </FadeInUp>

        {byCategory.length ? (
          byCategory.map(([g, items], i) => (
            <FadeInUp key={g} delay={220 + i * 40}>
              <SectionHeader title={g} actionLabel="Tout voir" onAction={() => navigation.navigate('Explorer', { category: g })} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
                {items.map((b) => (
                  <View key={b.id} style={{ width: 112 }}>
                    <Cover book={b} width={112} height={162} onPress={() => open(b.id)} />
                    <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>
                    <Text style={styles.cardAuthor} numberOfLines={1}>{b.author}</Text>
                  </View>
                ))}
              </ScrollView>
            </FadeInUp>
          ))
        ) : (
          <FadeInUp delay={220}>
            <SectionHeader title="Explorer par catégorie" />
            <View style={styles.catGrid}>
              {genres.map((g) => (
                <TouchableOpacity key={g} activeOpacity={0.85} style={[styles.cat, { backgroundColor: GENRE_COLORS[g] }]} onPress={() => navigation.navigate('Explorer', { category: g })}>
                  <Text style={styles.catText}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </FadeInUp>
        )}

        <FadeInUp delay={300}>
          <SectionHeader title="Nouveautés" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
            {nouveautes.map((b, i) => (
              <View key={b.id + '-' + i} style={{ width: 110 }}>
                <Cover book={b} width={110} height={158} onPress={() => open(b.id)} />
                <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>
              </View>
            ))}
          </ScrollView>
        </FadeInUp>
      </ScrollView>

      <Fab onPress={() => navigation.navigate('Upload')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingBottom: 6 },
  hello: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  h1: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.text },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.soft, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, marginTop: 8 },
  continue: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14 },
  contTitle: { fontWeight: '800', fontSize: 15, letterSpacing: -0.2, fontFamily: serif, color: colors.text },
  contAuthor: { fontSize: 12.5, color: colors.muted, marginTop: 2, marginBottom: 10 },
  track: { height: 5, backgroundColor: colors.soft2, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.red, borderRadius: 5 },
  contMeta: { fontSize: 11, color: colors.muted, marginTop: 5 },
  playBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontWeight: '700', fontSize: 12.5, marginTop: 8, lineHeight: 16, fontFamily: serif, color: colors.text },
  cardAuthor: { fontSize: 11, color: colors.muted, marginTop: 2 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cat: { width: '48%', height: 82, borderRadius: 16, padding: 16, justifyContent: 'flex-end', marginBottom: 12 },
  catText: { color: '#fff', fontWeight: '800', fontSize: 15, fontFamily: serif },
});
