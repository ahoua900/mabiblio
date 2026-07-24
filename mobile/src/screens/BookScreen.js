import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { getBook, reviewsFor, bookRating } from '../lib/books';
import { colors, serif, GENRE_COLORS } from '../theme';
import Cover from '../components/Cover';
import Stars from '../components/Stars';
import { Button } from '../components/ui';

export default function BookScreen({ route, navigation }) {
  const app = useApp();
  const book = getBook(app.customBooks, route.params.bookId);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (book) {
      const cur = (app.progress[book.id] || {}).value || 5;
      app.setBookProgress(book.id, book.title, book.color, Math.max(5, Math.round(cur)));
    }
  }, [route.params.bookId]);

  if (!book) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} />;

  const reviews = reviewsFor(app.reviewsByBook, book);
  const rate = bookRating(app.reviewsByBook, book);
  const listed = app.inList(book.id);

  async function submit() {
    if (!text.trim() || !rating || busy) return;
    setBusy(true);
    try {
      await app.addReview(book.id, rating, text.trim());
      setRating(0);
      setText('');
    } catch (e) {} finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => app.toggleList(book.id)}>
            <Feather name="bookmark" size={20} color={listed ? colors.red : colors.text} />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 8 }}>
          <Cover book={book} width={140} height={206} />
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <Stars rating={rate} size={15} />
            <Text style={styles.rateMeta}>{Math.round(rate * 10) / 10} · {reviews.length} avis</Text>
          </View>
          <View style={styles.metaChips}>
            <View style={styles.metaChip}>
              <View style={[styles.genreDot, { backgroundColor: GENRE_COLORS[book.genre] || '#999' }]} />
              <Text style={styles.metaChipText}>{book.genre}</Text>
            </View>
            <View style={styles.metaChip}><Text style={styles.metaChipText}>{book.age}</Text></View>
            <View style={styles.metaChip}><Text style={styles.metaChipText}>{book.language}</Text></View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 20 }}>
          <Button title="Lire" onPress={() => navigation.navigate('Reader', { bookId: book.id, mode: 'text' })} style={{ flex: 1 }} />
          <Button variant="soft" icon={<Feather name="headphones" size={18} color={colors.text} />} onPress={() => navigation.navigate('Reader', { bookId: book.id, mode: 'audio' })} style={{ width: 56 }} />
        </View>

        <Text style={styles.summary}>{book.summaryFull}</Text>

        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
          <Text style={styles.secTitle}>Avis ({reviews.length})</Text>

          <View style={styles.reviewBox}>
            <Text style={styles.reviewBoxLabel}>Votre note</Text>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 11 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Ionicons name="star" size={26} color={i <= rating ? '#F5A623' : '#DBDBE2'} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.textarea}
              value={text}
              onChangeText={setText}
              placeholder="Partagez votre avis ou une citation…"
              placeholderTextColor={colors.muted2}
              multiline
            />
            <Button title="Publier" onPress={submit} disabled={busy} style={{ marginTop: 11 }} />
          </View>

          {reviews.length ? reviews.map((r) => (
            <View key={r.id} style={styles.review}>
              <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarText}>{r.initial}</Text></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <Text style={{ fontWeight: '700', fontSize: 13.5, color: colors.text }}>{r.user}</Text>
                  <Text style={{ fontSize: 11.5, color: colors.muted2 }}>{r.date}</Text>
                </View>
                <View style={{ marginVertical: 4 }}><Stars rating={r.rating} size={12} /></View>
                <Text style={{ fontSize: 13.5, lineHeight: 21, color: '#3A3A44' }}>{r.comment}</Text>
              </View>
            </View>
          )) : (
            <Text style={{ color: colors.muted, fontSize: 13.5 }}>Aucun avis — soyez le premier à en écrire un.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 23, fontWeight: '800', letterSpacing: -0.4, marginTop: 18, fontFamily: serif, textAlign: 'center', color: colors.text },
  author: { fontSize: 14, color: colors.muted, marginTop: 3 },
  rateMeta: { fontSize: 12.5, color: colors.muted, fontWeight: '600' },
  metaChips: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.soft, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  metaChipText: { fontSize: 12.5, color: '#48484E', fontWeight: '600' },
  genreDot: { width: 7, height: 7, borderRadius: 4 },
  summary: { fontSize: 14.5, lineHeight: 24, color: '#3A3A44', paddingHorizontal: 20, marginTop: 22 },
  secTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14, fontFamily: serif, color: colors.text },
  reviewBox: { backgroundColor: colors.soft, borderRadius: 16, padding: 16, marginBottom: 20 },
  reviewBoxLabel: { fontSize: 12.5, fontWeight: '700', color: colors.muted, marginBottom: 9 },
  textarea: { minHeight: 70, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 12, fontSize: 14, backgroundColor: colors.surface, color: colors.text, textAlignVertical: 'top' },
  review: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontWeight: '700', fontSize: 14, color: colors.text },
});
