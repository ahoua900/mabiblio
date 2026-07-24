import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';

// Active LayoutAnimation sur Android (transitions de liste/mise en page fluides).
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Déclenche une transition douce pour le prochain changement de mise en page.
export function animateNext(duration = 260) {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
  );
}

// Bouton/zone tactile qui se réduit légèrement à l'appui.
export function PressableScale({ children, onPress, onLongPress, disabled, style, scaleTo = 0.96 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (to, bounciness) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 50, bounciness }).start();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      onPressIn={() => press(scaleTo, 0)}
      onPressOut={() => press(1, 6)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

// Entrée en fondu + légère montée, avec délai optionnel (pour un effet décalé).
export function FadeInUp({ children, delay = 0, distance = 14, duration = 420, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
