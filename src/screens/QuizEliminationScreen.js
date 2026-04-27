import React from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import QuizExitButton from '../components/QuizExitButton';
import useQuizStore from '../store/quizStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function QuizEliminationScreen({ navigation }) {
  const players = useQuizStore((s) => s.players);
  const currentPlayerIndex = useQuizStore((s) => s.currentPlayerIndex);
  const eliminatedPlayer = players[currentPlayerIndex];

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  if (!eliminatedPlayer) return null;

  return (
    <ScreenWrapper backgroundColor={colors.impostorBg}>
      <QuizExitButton navigation={navigation} light />
      <View style={styles.container}>
        <Ionicons name="skull-outline" size={80} color={colors.impostor} />

        <Text style={styles.playerName}>{eliminatedPlayer.name}</Text>
        <Text style={styles.title}>Eliminated!</Text>

        <View style={styles.heartsRow}>
          <Ionicons name="heart-dislike-outline" size={40} color={colors.textMuted} />
        </View>

        <Text style={styles.subtitle}>No lives remaining</Text>

        <BigButton
          title="Continue"
          onPress={() => navigation.replace('QuizLivesSummary')}
          variant="danger"
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
    gap: 14,
  },
  playerName: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.impostor,
  },
  heartsRow: {
    marginTop: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  btn: {
    marginTop: 24,
    width: '80%',
  },
});
