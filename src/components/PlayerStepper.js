import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PlayerStepper({ value, onChange, min = 3, max = 15, label = 'Players' }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.btn, value <= min && styles.btnDisabled]}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={28} color={value <= min ? colors.textMuted : colors.text} />
      </Pressable>

      <View style={styles.valueBox}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>

      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.btn, value >= max && styles.btnDisabled]}
        disabled={value >= max}
      >
        <Ionicons name="add" size={28} color={value >= max ? colors.textMuted : colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  valueBox: {
    alignItems: 'center',
    marginHorizontal: 24,
    minWidth: 60,
  },
  value: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  label: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: -2,
  },
});
