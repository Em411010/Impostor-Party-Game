import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const modes = [
  {
    name: 'Impostor Mode',
    icon: 'people-outline',
    active: true,
    screen: 'Setup',
    params: { mode: 'normal' },
    description: 'Find the impostor among players',
  },
  {
    name: 'Civilian Mode',
    icon: 'shield-checkmark-outline',
    active: true,
    screen: 'Setup',
    params: { mode: 'civilian' },
    description: 'Find the civilian among impostors',
  },
  { name: 'Quiz Survival', icon: 'help-circle-outline', active: true, screen: 'QuizSetup', description: 'Answer questions or lose a life' },
  { name: 'Reverse Clue', icon: 'swap-horizontal-outline', active: false, screen: null, description: 'Coming soon' },
  { name: 'Memory Mode', icon: 'brain-outline', active: false, screen: null, description: 'Coming soon' },
];

export default function ModesScreen({ navigation }) {
  return (
    <ScreenWrapper>
      <ScreenHeader title="Game Modes" navigation={navigation} />

      {modes.map((mode, i) => (
        <Pressable
          key={i}
          onPress={() => mode.active && navigation.navigate(mode.screen, mode.params)}
          disabled={!mode.active}
          style={({ pressed }) => [
            styles.card,
            !mode.active && styles.cardLocked,
            pressed && mode.active && styles.cardPressed,
          ]}
        >
          <Ionicons
            name={mode.icon}
            size={28}
            color={mode.active ? colors.primary : colors.textMuted}
          />
          <View style={styles.modeInfo}>
            <Text style={[styles.modeName, !mode.active && styles.modeNameLocked]}>
              {mode.name}
            </Text>
            <Text style={styles.modeDesc}>{mode.description}</Text>
          </View>
          {mode.active ? (
            <Ionicons name="chevron-forward" size={20} color={colors.textDim} />
          ) : (
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
            </View>
          )}
        </Pressable>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    gap: 14,
  },
  cardLocked: {
    opacity: 0.45,
  },
  cardPressed: {
    opacity: 0.75,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  modeNameLocked: {
    color: colors.textMuted,
  },
  modeDesc: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 2,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
