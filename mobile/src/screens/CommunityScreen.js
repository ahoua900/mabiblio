import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { communityFeed } from '../data';
import { colors, serif } from '../theme';
import Stars from '../components/Stars';

const TABS = ['Tous', 'Avis', 'Citations'];

export default function CommunityScreen() {
  const [tab, setTab] = useState('Tous');
  const feed = communityFeed.filter((p) => tab === 'Tous' || p.type === tab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Communauté</Text>

        <View style={styles.seg}>
          {TABS.map((t) => (
            <TouchableOpacity key={t} style={[styles.segItem, t === tab && styles.segItemOn]} onPress={() => setTab(t)}>
              <Text style={[styles.segText, { color: t === tab ? colors.text : colors.muted }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ gap: 14, marginTop: 16 }}>
          {feed.map((p) => (
            <View key={p.id} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                <View style={styles.badge}><Text style={styles.badgeText}>{p.initial}</Text></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 13.5 }}>
                    <Text style={{ fontWeight: '700', color: colors.text }}>{p.user}</Text>
                    <Text style={{ color: colors.muted }}> {p.action} </Text>
                    <Text style={{ fontWeight: '700', color: colors.text }}>{p.book}</Text>
                  </Text>
                  <Text style={{ fontSize: 11.5, color: colors.muted2 }}>{p.time}</Text>
                </View>
              </View>
              {p.rating > 0 ? <View style={{ marginVertical: 8 }}><Stars rating={p.rating} size={14} /></View> : null}
              <Text style={[styles.text, p.type === 'Citations' && styles.quote, { marginTop: p.rating > 0 ? 0 : 10 }]}>{p.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, color: colors.text, paddingTop: 14, paddingBottom: 8 },
  seg: { flexDirection: 'row', backgroundColor: colors.soft, borderRadius: 11, padding: 3, alignSelf: 'flex-start' },
  segItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  segItemOn: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  segText: { fontSize: 13, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16 },
  badge: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontWeight: '700', fontSize: 14, color: colors.text },
  text: { fontSize: 13.5, color: '#3A3A44', lineHeight: 21 },
  quote: { fontStyle: 'italic', fontFamily: serif, color: colors.text, fontSize: 14 },
});
