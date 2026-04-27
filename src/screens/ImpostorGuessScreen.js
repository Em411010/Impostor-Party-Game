import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useGameStore from '../store/gameStore';
import { defaultCategories } from '../data/categories';
import useSettingsStore from '../store/settingsStore';
import { getGuessOptions } from '../engine/gameEngine';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function ImpostorGuessScreen({ navigation }) {
  const word = useGameStore((s) => s.word);
  const categories = useGameStore((s) => s.categories);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const votedPlayerId = useGameStore((s) => s.votedPlayerId);
  const players = useGameStore((s) => s.players);
  const [selectedWord, setSelectedWord] = useState(null);

  const caughtPlayer = players.find((p) => p.id === votedPlayerId);

  const options = useMemo(() => {
    if (!categories || categories.length === 0) return [word];
    return getGuessOptions(categories, word, 5);
  }, [categories, word]);

  const handleGuess = () => {
    if (!selectedWord) return;
    submitGuess(selectedWord, word);
    const state = useGameStore.getState();
    if (state.status === 'voting') {
      // More impostors to catch — go back to vote
      navigation.replace('Vote');
    } else {
      navigation.replace('Result');
    }
  };

  return (
    <ScreenWrapper backgroundColor={colors.impostorBg}>
      <View style={styles.container}>
        <Ionicons name="skull-outline" size={48} color={colors.impostor} />
        <Text style={styles.title}>{caughtPlayer?.name || 'Impostor'} Was Caught!</Text>
        <Text style={styles.subtitle}>Guess the word to still win</Text>

        <View style={styles.options}>
          {options.map((opt, idx) => (
            <BigButton
              key={idx}
              title={opt}
              variant={selectedWord === opt ? 'danger' : 'dark'}
              onPress={() => setSelectedWord(opt)}
              style={styles.optionBtn}
            />
          ))}
        </View>

        <BigButton
          title="Submit Guess"
          onPress={handleGuess}
          variant="primary"
          disabled={!selectedWord}
          style={styles.submitBtn}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.impostor,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDim,
    marginBottom: 28,
  },
  options: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  optionBtn: {
    width: '100%',
  },
  submitBtn: {
    width: '80%',
  },
});
