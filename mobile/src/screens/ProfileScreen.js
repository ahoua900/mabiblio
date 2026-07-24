import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../lib/store';
import { colors, serif } from '../theme';
import { fmtDuration } from '../lib/util';

export default function ProfileScreen({ navigation }) {
  const app = useApp();
  const hist = app.history();
  const myReviews = Object.keys(app.reviewsByBook).reduce(
    (n, k) => n + app.reviewsByBook[k].filter((r) => r.user === app.user?.name).length, 0
  );

  useFocusEffect(React.useCallback(() => { app.refreshListen(); }, []));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Text style={styles.h1}>Profil</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => app.signOut()}>
            <Feather name="log-out" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.head}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{(app.user?.name || '?')[0].toUpperCase()}</Text></View>
          <View>
            <Text style={styles.name}>{app.user?.name}</Text>
            <Text style={styles.email}>{app.user?.email || 'Compte local'}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Stat value={hist.length} label="Livres ouverts" />
          <Stat value={myReviews} label="Avis écrits" />
          <Stat value={fmtDuration(app.listenSeconds)} label="Écoute" />
        </View>

        <Text style={styles.secTitle}>Historique de lecture</Text>
        {hist.length ? (
          <View style={{ gap: 10 }}>
            {hist.slice(0, 8).map((h) => {
              const v = Math.round(h.value);
              return (
                <TouchableOpacity key={h.id} activeOpacity={0.85} style={styles.histRow} onPress={() => navigation.navigate('Book', { bookId: h.id })}>
                  <View style={[styles.dot, { backgroundColor: h.color || colors.red }]} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.histTitle} numberOfLines={1}>{h.title}</Text>
                    <View style={styles.track}><View style={[styles.fill, { width: `${v}%`, backgroundColor: h.color || colors.red }]} /></View>
                  </View>
                  <Text style={styles.histMeta}>{v >= 100 ? 'Terminé' : `${v}%`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={{ color: colors.muted, fontSize: 13.5, paddingVertical: 8 }}>Ouvrez un livre pour commencer votre historique.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14 },
  h1: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.text },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 20 },
  avatar: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 25 },
  name: { fontSize: 20, fontWeight: '800', fontFamily: serif, color: colors.text },
  email: { fontSize: 13, color: colors.muted },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.red, fontFamily: serif },
  statLabel: { fontSize: 11.5, color: colors.muted, fontWeight: '600', marginTop: 2 },
  secTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, color: colors.text, marginTop: 24, marginBottom: 12 },
  histRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  histTitle: { fontSize: 13.5, fontWeight: '700', color: colors.text },
  track: { height: 4, backgroundColor: colors.soft2, borderRadius: 4, marginTop: 6, overflow: 'hidden' },
  fill: { height: '100%' },
  histMeta: { fontSize: 12, fontWeight: '700', color: colors.muted },
});
