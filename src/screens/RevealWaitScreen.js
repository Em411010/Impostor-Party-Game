import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useGameStore from '../store/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function RevealWaitScreen({ navigation }) {
  const currentRevealIndex = useGameStore((s) => s.currentRevealIndex);
  const players = useGameStore((s) => s.players);
  const currentPlayer = players[currentRevealIndex];

  // Disable hardware back button during reveal
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  if (!currentPlayer) return null;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.iconRow}>
          <Ionicons name="eye-off-outline" size={48} color={colors.textDim} />
        </View>

        <Text style={styles.playerLabel}>{currentPlayer.name}</Text>
        <Text style={styles.instruction}>Tap the button below to see your role</Text>

        <View style={styles.privacy}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.warning} />
          <Text style={styles.privacyText}>
            Make sure only {currentPlayer.name} is looking at the screen
          </Text>
        </View>

        <BigButton
          title="Tap to Reveal"
          onPress={() => navigation.replace('RoleReveal')}
          variant="primary"
          style={styles.btn}
        />

        <Text style={styles.progress}>
          {currentRevealIndex + 1} of {players.length}
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    marginBottom: 24,
  },
  playerLabel: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  instruction: {
    fontSize: 16,
    color: colors.textDim,
    marginBottom: 32,
    textAlign: 'center',
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 40,
    gap: 8,
  },
  privacyText: {
    color: colors.warning,
    fontSize: 13,
    flex: 1,
  },
  btn: {
    width: '80%',
  },
  progress: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 20,
  },
});
