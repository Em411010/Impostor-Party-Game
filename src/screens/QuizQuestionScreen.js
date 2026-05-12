import React from 'react';
import { View, Text, StyleSheet, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import QuizExitButton from '../components/QuizExitButton';
import useQuizStore from '../store/quizStore';
import { colors } from '../theme/colors';
import { getQuizBg } from '../utils/quizBg';

const LABELS = ['A', 'B', 'C', 'D'];

export default function QuizQuestionScreen({ navigation }) {
  const players = useQuizStore((s) => s.players);
  const currentPlayerIndex = useQuizStore((s) => s.currentPlayerIndex);
  const currentQuestion = useQuizStore((s) => s.currentQuestion);
  const submitAnswer = useQuizStore((s) => s.submitAnswer);
  const category = useQuizStore((s) => s.category);

  const currentPlayer = players[currentPlayerIndex];
  const categoryLabel = currentQuestion?.categoryName || category?.name;

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  const handleChoice = (choice) => {
    submitAnswer(choice);
    navigation.replace('QuizAnswerResult');
  };

  if (!currentQuestion || !currentPlayer) return null;

  return (
    <ScreenWrapper backgroundImage={getQuizBg(currentQuestion?.categoryId)}>
      <QuizExitButton navigation={navigation} />
      <View style={styles.container}>
        {/* Player + category badge */}
        <View style={styles.topRow}>
          <View style={styles.playerBadge}>
            <Text style={styles.playerBadgeText}>{currentPlayer.name}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {categoryLabel}
            </Text>
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Choices */}
        <View style={styles.choices}>
          {currentQuestion.choices.map((choice, i) => (
            <Pressable
              key={i}
              onPress={() => handleChoice(choice)}
              style={({ pressed }) => [
                styles.choiceBtn,
                pressed && styles.choiceBtnPressed,
              ]}
            >
              <View style={styles.choiceLabel}>
                <Text style={styles.choiceLabelText}>{LABELS[i]}</Text>
              </View>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerBadge: {
    backgroundColor: colors.primary + '25',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playerBadgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  categoryBadge: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    color: colors.textDim,
    fontSize: 13,
  },
  questionBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'center',
  },
  choices: {
    gap: 12,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  choiceBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  choiceLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLabelText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  choiceText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
