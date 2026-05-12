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

export default function QuizPassScreen({ navigation }) {
  const players = useQuizStore((s) => s.players);
  const currentPlayerIndex = useQuizStore((s) => s.currentPlayerIndex);
  const currentPlayer = players[currentPlayerIndex];
  const currentQuestion = useQuizStore((s) => s.currentQuestion);

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  if (!currentPlayer) return null;

  return (
    <ScreenWrapper backgroundImage={getQuizBg(currentQuestion?.categoryId)}>
      <QuizExitButton navigation={navigation} />
      <View style={styles.container}>
        <Ionicons name="phone-portrait-outline" size={56} color={colors.textDim} />

        <Text style={styles.passLabel}>Pass the phone to</Text>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>

        <View style={styles.privacy}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.warning} />
          <Text style={styles.privacyText}>
            Make sure only {currentPlayer.name} is looking at the screen
          </Text>
        </View>

        <BigButton
          title="Tap to See Question"
          onPress={() => navigation.replace('QuizQuestion')}
          variant="primary"
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
    gap: 16,
  },
  passLabel: {
    fontSize: 18,
    color: colors.textDim,
    marginTop: 12,
  },
  playerName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginHorizontal: 8,
  },
  privacyText: {
    color: colors.warning,
    fontSize: 13,
    flex: 1,
  },
  btn: {
    marginTop: 24,
    width: '80%',
  },
});
