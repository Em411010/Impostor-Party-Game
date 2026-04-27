import React from 'react';
import { View, Text, StyleSheet, BackHandler, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import QuizExitButton from '../components/QuizExitButton';
import useQuizStore from '../store/quizStore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

function PlayerLivesRow({ player, startingLives }) {
  return (
    <View style={[styles.playerRow, player.isEliminated && styles.playerRowEliminated]}>
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, player.isEliminated && styles.playerNameEliminated]}>
          {player.name}
        </Text>
        {player.isEliminated && (
          <View style={styles.eliminatedBadge}>
            <Text style={styles.eliminatedText}>OUT</Text>
          </View>
        )}
      </View>
      <View style={styles.hearts}>
        {Array.from({ length: startingLives }, (_, i) => (
          <Ionicons
            key={i}
            name={i < player.lives ? 'heart' : 'heart-outline'}
            size={20}
            color={
              player.isEliminated
                ? colors.textMuted
                : i < player.lives
                ? colors.impostor
                : colors.textMuted
            }
          />
        ))}
      </View>
    </View>
  );
}

export default function QuizLivesSummaryScreen({ navigation }) {
  const players = useQuizStore((s) => s.players);
  const startingLives = useQuizStore((s) => s.startingLives);
  const winner = useQuizStore((s) => s.winner);
  const advanceTurn = useQuizStore((s) => s.advanceTurn);

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  const handleContinue = () => {
    if (winner) {
      navigation.replace('QuizWinner');
    } else {
      advanceTurn();
      navigation.replace('QuizQuestion');
    }
  };

  return (
    <ScreenWrapper>
      <QuizExitButton navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>Lives Remaining</Text>
        <Ionicons name="heart-outline" size={32} color={colors.impostor} style={styles.titleIcon} />

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {players.map((player) => (
            <PlayerLivesRow
              key={player.id}
              player={player}
              startingLives={startingLives}
            />
          ))}
        </ScrollView>

        <BigButton
          title={winner ? 'See Winner' : 'Next Player'}
          onPress={handleContinue}
          variant={winner ? 'success' : 'primary'}
          style={styles.btn}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playerRowEliminated: {
    opacity: 0.45,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  playerName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  playerNameEliminated: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  eliminatedBadge: {
    backgroundColor: colors.impostor + '30',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  eliminatedText: {
    color: colors.impostor,
    fontSize: 11,
    fontWeight: '700',
  },
  hearts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'flex-end',
    maxWidth: 160,
  },
  btn: {
    marginTop: 16,
    marginBottom: 8,
  },
});
