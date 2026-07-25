import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Modal, TextInput, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, serif } from '../theme';

// Lecteur paginé façon livre papier : chaque page est une vue plein écran,
// on tourne les pages par balayage horizontal (défilement natif paginé) avec
// un léger effet de bascule 3D façon page qui tourne. Contrairement à un
// simple slide continu, chaque geste s'arrête toujours sur une page entière.
// Le contenu d'une page reste défilable verticalement (au cas où l'estimation
// de pagination déborde légèrement du cadre visible).
export default function BookPager({ pages, page, onPageChange, theme, font, fontSize, pad, disabled }) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(width);
  const [showGoTo, setShowGoTo] = useState(false);
  const [goToValue, setGoToValue] = useState('');
  const count = pages.length || 1;
  const index = Math.min(count, Math.max(1, page)) - 1;

  // Recentre la liste sur la page courante quand elle change hors interaction
  // (reprise de lecture, changement de réglages qui recalcule la pagination).
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * containerWidth, animated: false });
    }
  }, [index, containerWidth, pages]);

  function handleMomentumEnd(e) {
    if (disabled) return;
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / containerWidth);
    const newPage = Math.min(count, Math.max(1, newIndex + 1));
    if (newPage !== page) onPageChange(newPage);
  }

  function goTo(delta) {
    if (disabled) return;
    const target = Math.min(count, Math.max(1, page + delta));
    if (target === page) return;
    scrollRef.current?.scrollTo({ x: (target - 1) * containerWidth, animated: true });
    onPageChange(target);
  }

  function openGoTo() {
    if (disabled) return;
    setGoToValue(String(page));
    setShowGoTo(true);
  }

  const goToTarget = parseInt(goToValue, 10);
  const goToValid = Number.isInteger(goToTarget) && goToTarget >= 1 && goToTarget <= count;

  function submitGoTo() {
    if (!goToValid) return;
    setShowGoTo(false);
    scrollRef.current?.scrollTo({ x: (goToTarget - 1) * containerWidth, animated: true });
    onPageChange(goToTarget);
  }

  return (
    <View style={{ flex: 1 }} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width || width)}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={!disabled}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        onMomentumScrollEnd={handleMomentumEnd}
        contentOffset={{ x: index * containerWidth, y: 0 }}
      >
        {pages.map((content, i) => {
          const inputRange = [(i - 1) * containerWidth, i * containerWidth, (i + 1) * containerWidth];
          const rotateY = scrollX.interpolate({
            inputRange,
            outputRange: ['35deg', '0deg', '-35deg'],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.55, 1, 0.55],
            extrapolate: 'clamp',
          });
          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [containerWidth * 0.08, 0, -containerWidth * 0.08],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={{
                width: containerWidth,
                flex: 1,
                opacity,
                transform: [{ perspective: 1200 }, { translateX }, { rotateY }],
              }}
            >
              <TouchableWithoutFeedback onPress={(e) => !disabled && tapZone(e, containerWidth, () => goTo(-1), () => goTo(1))}>
                <View style={{ flex: 1 }}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: pad, paddingTop: 14, paddingBottom: 30 }}
                  >
                    <Text style={{ fontSize, lineHeight: fontSize * 1.85, color: theme.fg, fontFamily: font, textAlign: 'justify' }}>
                      {content}
                    </Text>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <TouchableOpacity style={styles.footer} onPress={openGoTo} disabled={disabled} hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}>
        <Text style={[styles.footerText, { color: theme.sub }]}>Page {page} sur {count}</Text>
        {disabled ? null : <Feather name="edit-3" size={11} color={theme.sub} style={{ marginLeft: 6 }} />}
      </TouchableOpacity>

      {/* Atteindre une page précise en saisissant son numéro */}
      <Modal visible={showGoTo} transparent animationType="fade" onRequestClose={() => setShowGoTo(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShowGoTo(false)} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aller à la page</Text>
          <Text style={styles.cardSub}>Entre un numéro entre 1 et {count}</Text>
          <TextInput
            style={[styles.input, !goToValid && goToValue.length > 0 && styles.inputError]}
            value={goToValue}
            onChangeText={setGoToValue}
            keyboardType="number-pad"
            autoFocus
            selectTextOnFocus
            onSubmitEditing={submitGoTo}
            returnKeyType="go"
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={[styles.cardBtn, styles.cardBtnGhost]} onPress={() => setShowGoTo(false)}>
              <Text style={styles.cardBtnGhostText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardBtn, { backgroundColor: goToValid ? colors.red : colors.soft2 }]}
              onPress={submitGoTo}
              disabled={!goToValid}
            >
              <Text style={[styles.cardBtnText, { color: goToValid ? '#fff' : colors.muted }]}>Aller</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Tape à gauche/droite de l'écran pour tourner la page ; le tiers central ne fait rien
// (laisse la place à un futur menu contextuel sans gêner la lecture).
function tapZone(e, width, onLeft, onRight) {
  const x = e.nativeEvent.locationX;
  if (x < width * 0.32) onLeft();
  else if (x > width * 0.68) onRight();
}

const styles = StyleSheet.create({
  footer: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 11.5, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  card: {
    position: 'absolute', left: 28, right: 28, top: '38%',
    backgroundColor: colors.surface, borderRadius: 20, padding: 22,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', fontFamily: serif, color: colors.text },
  cardSub: { fontSize: 12.5, color: colors.muted, marginTop: 4, marginBottom: 16 },
  input: {
    borderWidth: 1.5, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center',
  },
  inputError: { borderColor: colors.red },
  cardBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardBtnGhost: { backgroundColor: colors.soft },
  cardBtnGhostText: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  cardBtnText: { fontSize: 14.5, fontWeight: '700' },
});
