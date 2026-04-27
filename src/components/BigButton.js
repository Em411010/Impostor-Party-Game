import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const variants = {
  primary: { bg: colors.primary, text: colors.white },
  success: { bg: colors.civilian, text: colors.white },
  danger: { bg: colors.impostor, text: colors.white },
  neutral: { bg: colors.neutral, text: colors.white },
  outline: { bg: 'rgba(0,0,0,0)', text: colors.text, border: colors.border },
  dark: { bg: colors.surface, text: colors.text },
};

export default function BigButton({ title, onPress, variant = 'primary', disabled, style }) {
  const v = variants[variant] || variants.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg },
        v.border && { borderWidth: 2, borderColor: v.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: v.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
