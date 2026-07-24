import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, serif } from '../theme';
import { PressableScale } from './anim';

export default function OnlineResultRow({ result, busy, onGet }) {
  return (
    <View style={styles.row}>
      {result.thumbnail ? (
        <Image source={{ uri: result.thumbnail }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.placeholder, { backgroundColor: result.color }]}>
          <Text style={styles.placeholderText} numberOfLines={3}>{result.title}</Text>
        </View>
      )}

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.title} numberOfLines={2}>{result.title}</Text>
        {result.authors ? <Text style={styles.author} numberOfLines={1}>{result.authors}</Text> : null}
        <View style={styles.metaRow}>
          {result.year ? <Text style={styles.meta}>{result.year}</Text> : null}
          {result.publicDomain ? <Text style={[styles.badge, styles.badgePd]}>Domaine public</Text> : null}
        </View>
        {result.description ? <Text style={styles.desc} numberOfLines={2}>{result.description}</Text> : null}

        <PressableScale style={[styles.btn, busy && { opacity: 0.6 }]} onPress={() => !busy && onGet(result)} disabled={busy}>
          {busy ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Feather name="download" size={15} color="#fff" />
              <Text style={styles.btnText}>Obtenir</Text>
            </>
          )}
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 12 },
  thumb: { width: 66, height: 96, borderRadius: 9, backgroundColor: colors.soft2 },
  placeholder: { padding: 8, justifyContent: 'flex-end' },
  placeholderText: { color: '#fff', fontSize: 10.5, fontWeight: '800', fontFamily: serif },
  title: { fontWeight: '800', fontSize: 14.5, fontFamily: serif, lineHeight: 18, color: colors.text },
  author: { fontSize: 12, color: colors.muted, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  meta: { fontSize: 11.5, color: colors.muted2, fontWeight: '600' },
  badge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, overflow: 'hidden' },
  badgePd: { backgroundColor: '#E7F6EC', color: '#1F7A4D' },
  desc: { fontSize: 12, color: '#5A5A62', lineHeight: 17, marginTop: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.red, borderRadius: 11, paddingVertical: 9, marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 16 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
