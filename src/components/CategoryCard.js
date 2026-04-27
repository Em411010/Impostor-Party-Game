import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CategoryCard({ category, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}
    >
      <Ionicons
        name={category.icon || 'help-circle-outline'}
        size={32}
        color={selected ? colors.primary : colors.textDim}
      />
      <Text style={[styles.name, selected && styles.nameSelected]}>{category.name}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{category.words.length}</Text>
      </View>
      {category.isCustom && (
        <View style={styles.customBadge}>
          <Text style={styles.customBadgeText}>Custom</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0)',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  name: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.text,
  },
  badge: {
    marginTop: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.textDim,
    fontSize: 11,
  },
  customBadge: {
    marginTop: 4,
    backgroundColor: colors.primary + '30',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  customBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '600',
  },
});
