import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useQuizStore from '../store/quizStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { QUIZ_DEFAULT_BG } from '../utils/quizBg';

export default function QuizWinnerScreen({ navigation }) {
  const winner = useQuizStore((s) => s.winner);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  const handlePlayAgain = () => {
    resetQuiz();
    navigation.reset({
      index: 0,
      routes: [{ name: 'QuizSetup' }],
    });
  };

  const handleHome = () => {
    resetQuiz();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <ScreenWrapper backgroundImage={QUIZ_DEFAULT_BG} backgroundColor={colors.civilianBg}>
      <View style={styles.container}>
        <Ionicons name="trophy" size={90} color={colors.warning} />

        <Text style={styles.winnerLabel}>Winner!</Text>
        <Text style={styles.winnerName}>{winner?.name ?? 'Player'}</Text>

        <Text style={styles.subtitle}>Survived all the questions!</Text>

        <View style={styles.buttons}>
          <BigButton
            title="Play Again"
            onPress={handlePlayAgain}
            variant="success"
            style={styles.btn}
          />
          <BigButton
            title="Home"
            onPress={handleHome}
            variant="outline"
            style={styles.btn}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  winnerLabel: {
    fontSize: 18,
    color: colors.civilian,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  winnerName: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textDim,
    marginTop: 4,
    marginBottom: 20,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
  },
});
