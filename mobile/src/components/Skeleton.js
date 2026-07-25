import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors } from '../theme';

// Bloc grisé qui pulse doucement, pour signaler un chargement en cours sans
// laisser un écran figé (« skeleton loader »).
export default function SkeletonBlock({ width, height, radius = 8, color = colors.soft2, style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: color, opacity }, style]} />;
}
