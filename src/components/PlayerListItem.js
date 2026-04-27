import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PlayerListItem({ player, selected, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(player.id)}
      style={[styles.item, selected && styles.itemSelected]}
    >
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? colors.primary : colors.textDim}
      />
      <Text style={[styles.text, selected && styles.textSelected]}>{player.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0)',
  },
  itemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  text: {
    color: colors.textDim,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  textSelected: {
    color: colors.text,
  },
});
