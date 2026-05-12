import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import QuizExitButton from '../components/QuizExitButton';
import useQuizStore from '../store/quizStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getQuizBg } from '../utils/quizBg';

function Hearts({ lives, maxLives }) {
  return (
    <View style={styles.heartsRow}>
      {Array.from({ length: maxLives }, (_, i) => (
        <Ionicons
          key={i}
          name={i < lives ? 'heart' : 'heart-outline'}
          size={28}
          color={i < lives ? colors.impostor : colors.textMuted}
        />
      ))}
    </View>
  );
}

export default function QuizAnswerResultScreen({ navigation }) {
  const players = useQuizStore((s) => s.players);
  const currentPlayerIndex = useQuizStore((s) => s.currentPlayerIndex);
  const startingLives = useQuizStore((s) => s.startingLives);
  const lastAnswerCorrect = useQuizStore((s) => s.lastAnswerCorrect);
  const lastCorrectAnswer = useQuizStore((s) => s.lastCorrectAnswer);
  const currentPlayerEliminated = useQuizStore((s) => s.currentPlayerEliminated);

  const currentQuestion = useQuizStore((s) => s.currentQuestion);

  const currentPlayer = players[currentPlayerIndex];

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  const handleContinue = () => {
    if (currentPlayerEliminated) {
      navigation.replace('QuizElimination');
    } else {
      navigation.replace('QuizLivesSummary');
    }
  };

  if (!currentPlayer) return null;

  const correct = lastAnswerCorrect;
  const bgColor = correct ? colors.civilianBg : colors.impostorBg;
  const accentColor = correct ? colors.civilian : colors.impostor;
  const iconName = correct ? 'checkmark-circle' : 'close-circle';

  return (
    <ScreenWrapper backgroundImage={getQuizBg(currentQuestion?.categoryId)} backgroundColor={bgColor}>
      <QuizExitButton navigation={navigation} light />
      <View style={styles.container}>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>

        <Ionicons name={iconName} size={80} color={accentColor} />

        <Text style={[styles.verdict, { color: accentColor }]}>
          {correct ? 'Correct!' : 'Wrong!'}
        </Text>

        {!correct && (
          <View style={styles.correctBox}>
            <Text style={styles.correctLabel}>The correct answer was:</Text>
            <Text style={styles.correctAnswer}>{lastCorrectAnswer}</Text>
          </View>
        )}

        {/* Lives remaining */}
        <View style={styles.livesBox}>
          <Text style={styles.livesLabel}>Lives remaining</Text>
          <Hearts lives={currentPlayer.lives} maxLives={startingLives} />
          <Text style={styles.livesCount}>{currentPlayer.lives} / {startingLives}</Text>
        </View>

        <BigButton
          title="Continue"
          onPress={handleContinue}
          variant={correct ? 'success' : 'danger'}
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
    gap: 18,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDim,
    marginBottom: 4,
  },
  verdict: {
    fontSize: 36,
    fontWeight: '900',
  },
  correctBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  correctLabel: {
    color: colors.textDim,
    fontSize: 13,
  },
  correctAnswer: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  livesBox: {
    alignItems: 'center',
    gap: 6,
  },
  livesLabel: {
    color: colors.textDim,
    fontSize: 14,
  },
  heartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    maxWidth: 280,
  },
  livesCount: {
    color: colors.textMuted,
    fontSize: 13,
  },
  btn: {
    marginTop: 8,
    width: '80%',
  },
});
