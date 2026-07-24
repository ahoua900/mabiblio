import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, serif } from '../theme';

// Splash animé : prend le relais du splash natif statique, anime le logo,
// puis se dissout pour révéler l'application une fois celle-ci prête.
export default function AnimatedSplash({ ready, onFinish }) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordY = useRef(new Animated.Value(10)).current;
  const cover = useRef(new Animated.Value(1)).current;
  const done = useRef(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(wordOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(wordY, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (ready && !done.current) {
      done.current = true;
      Animated.timing(cover, {
        toValue: 0,
        duration: 440,
        delay: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onFinish && onFinish());
    }
  }, [ready]);

  return (
    <Animated.View style={[styles.fill, { opacity: cover }]} pointerEvents="none">
      <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
        <Animated.View style={styles.tile}>
          <Feather name="book" size={62} color="#fff" />
        </Animated.View>
      </Animated.View>
      <Animated.Text style={[styles.word, { opacity: wordOpacity, transform: [{ translateY: wordY }] }]}>
        Lectura
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  tile: {
    width: 128,
    height: 128,
    borderRadius: 34,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.red,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  word: { marginTop: 26, fontSize: 30, fontWeight: '800', letterSpacing: -0.5, color: colors.text, fontFamily: serif },
});
