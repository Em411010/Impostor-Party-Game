import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useGameStore from '../store/gameStore';
import useSettingsStore from '../store/settingsStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function RoleRevealScreen({ navigation }) {
  const currentRevealIndex = useGameStore((s) => s.currentRevealIndex);
  const players = useGameStore((s) => s.players);
  const word = useGameStore((s) => s.word);
  const clue = useGameStore((s) => s.clue);
  const categoryName = useGameStore((s) => s.categoryName);
  const markPlayerViewed = useGameStore((s) => s.markPlayerViewed);
  const advanceReveal = useGameStore((s) => s.advanceReveal);
  const status = useGameStore((s) => s.status);
  const showCategoryToAll = useSettingsStore((s) => s.showCategoryToAll);
  const showClue = useSettingsStore((s) => s.showClue);

  const currentPlayer = players[currentRevealIndex];
  const isLast = currentRevealIndex === players.length - 1;

  // Disable hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  const handleHide = () => {
    markPlayerViewed();
    advanceReveal();
    if (isLast) {
      navigation.replace('Discussion');
    } else {
      navigation.replace('Pass');
    }
  };

  if (!currentPlayer) return null;

  const isImpostor = currentPlayer.role === 'impostor';
  const bgImage = isImpostor
    ? require('../../assets/impostor-bg.png')
    : require('../../assets/civilian-bg.png');
  const accentColor = isImpostor ? colors.impostor : colors.civilian;
  const roleLabel = isImpostor ? 'IMPOSTOR' : 'CIVILIAN';

  return (
    <ScreenWrapper backgroundImage={bgImage}>
      <View style={styles.container}>
        <Ionicons
          name={isImpostor ? 'skull-outline' : 'checkmark-circle-outline'}
          size={64}
          color={accentColor}
        />

        <Text style={[styles.role, { color: accentColor }]}>
          {roleLabel}
        </Text>

        {(showCategoryToAll || !isImpostor) && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{categoryName}</Text>
          </View>
        )}

        {isImpostor ? (
          <View style={styles.wordBox}>
            <Ionicons name="help-circle-outline" size={40} color={accentColor} />
            <Text style={[styles.wordHidden, { color: accentColor }]}>???</Text>
            <Text style={styles.wordHint}>You don't know the word. Blend in!</Text>
            {showClue && clue ? (
              <View style={styles.clueRow}>
                <Text style={styles.clueLabel}>Suggested Clue:</Text>
                <Text style={[styles.clueValue, { color: accentColor }]}>{clue}</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.wordBox}>
            <Text style={styles.wordLabel}>The Word</Text>
            <Text style={styles.word}>{word}</Text>
          </View>
        )}

        <BigButton
          title="Hide & Continue"
          onPress={handleHide}
          variant={isImpostor ? 'danger' : 'success'}
          style={styles.btn}
        />
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
  role: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 16,
    marginBottom: 24,
  },
  infoRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  wordBox: {
    backgroundColor: colors.background + '80',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 32,
    minWidth: 240,
  },
  wordLabel: {
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 6,
    textAlign: 'center',
  },
  word: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  wordHidden: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.impostor,
    marginTop: 8,
    textAlign: 'center',
  },
  wordHint: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 8,
    textAlign: 'center',
  },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  clueLabel: {
    fontSize: 13,
    color: colors.textDim,
  },
  clueValue: {
    fontSize: 16,
    color: colors.civilian,
    fontWeight: '700',
    textAlign: 'center',
  },
  btn: {
    width: '80%',
  },
});
