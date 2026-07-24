import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, serif } from '../theme';

export function Chip({ label, active, red, onPress, style, children }) {
  const bg = active ? (red ? colors.red : colors.text) : colors.soft;
  const fg = active ? '#fff' : '#48484E';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.chip, { backgroundColor: bg }, style]}>
      <Text style={{ color: fg, fontSize: 13, fontWeight: '600' }}>{label}</Text>
      {children}
    </TouchableOpacity>
  );
}

export function Button({ title, onPress, variant = 'primary', disabled, style, icon }) {
  const bg = variant === 'primary' ? colors.red : variant === 'soft' ? colors.soft : colors.surface;
  const fg = variant === 'primary' ? '#fff' : colors.text;
  const border = variant === 'ghost' ? { borderWidth: 1, borderColor: colors.line } : null;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.55 : 1 }, border, style]}
    >
      {icon}
      {title ? <Text style={{ color: fg, fontSize: 15, fontWeight: '700' }}>{title}</Text> : null}
    </TouchableOpacity>
  );
}

export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={styles.sec}>
      <Text style={styles.secTitle}>{title}</Text>
      {actionLabel ? (
        <Text style={styles.secAction} onPress={onAction}>{actionLabel}</Text>
      ) : null}
    </View>
  );
}

export function Avatar({ name, size = 40, dark = true }) {
  const t = (name || '').trim();
  const initial = t ? t[0].toUpperCase() : '?';
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: dark ? colors.text : colors.soft,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Text style={{ color: dark ? '#fff' : colors.text, fontWeight: '700', fontSize: size * 0.38 }}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  btn: {
    paddingVertical: 15, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  sec: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 },
  secTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, color: colors.text },
  secAction: { fontSize: 13, color: colors.red, fontWeight: '700' },
});
