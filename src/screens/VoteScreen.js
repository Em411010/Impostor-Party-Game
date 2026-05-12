import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import PlayerListItem from '../components/PlayerListItem';
import useGameStore from '../store/gameStore';
import { getModeRule } from '../engine/modeRules';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function VoteScreen({ navigation }) {
  const players = useGameStore((s) => s.players);
  const submitVotes = useGameStore((s) => s.submitVotes);
  const mode = useGameStore((s) => s.mode);
  const caughtHiddenRoleIds = useGameStore((s) => s.caughtHiddenRoleIds);
  const eliminatedCivilianIds = useGameStore((s) => s.eliminatedCivilianIds);
  const hiddenRoleIds = useGameStore((s) => s.hiddenRoleIds);
  const modeRule = getModeRule(mode);

  const [selectedIds, setSelectedIds] = useState([]);
  const [feedback, setFeedback] = useState(null); // { type: 'caught'|'wrong', ... }

  const votablePlayers = useMemo(() => {
    return players.filter(
      (p) => !caughtHiddenRoleIds.includes(p.id) && !eliminatedCivilianIds.includes(p.id)
    );
  }, [players, caughtHiddenRoleIds, eliminatedCivilianIds]);

  const remainingHiddenRoles = hiddenRoleIds.length - caughtHiddenRoleIds.length;
  const isMultiHidden = hiddenRoleIds.length > 1;
  const votePrompt = remainingHiddenRoles > 1 ? modeRule.votePromptPlural : modeRule.votePromptSingular;

  const togglePlayer = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleVote = () => {
    if (selectedIds.length === 0) return;
    submitVotes(selectedIds);
    const state = useGameStore.getState();
    if (state.status === 'result') {
      navigation.replace('Result');
    } else if (state.voteResult === 'wrong') {
      const eliminatedPlayer = players.find((p) => p.id === selectedIds[0]);
      const remainingHidden = state.hiddenRoleIds.length - state.caughtHiddenRoleIds.length;
      setFeedback({ type: 'wrong', eliminatedName: eliminatedPlayer?.name, remainingHidden });
      setSelectedIds([]);
    } else {
      const remaining = state.hiddenRoleIds.length - state.caughtHiddenRoleIds.length;
      setFeedback({ type: 'caught', caughtCount: selectedIds.length, remaining });
      setSelectedIds([]);
    }
  };

  const handleContinue = () => {
    setFeedback(null);
  };

  if (feedback) {
    const isWrong = feedback.type === 'wrong';
    return (
      <ScreenWrapper>
        <View style={styles.feedbackContainer}>
          <Ionicons
            name={isWrong ? 'close-circle' : 'checkmark-circle'}
            size={80}
            color={isWrong ? colors.danger : colors.success}
          />
          <Text style={styles.feedbackTitle}>{isWrong ? 'Wrong!' : 'Correct!'}</Text>
          {isWrong ? (
            <>
              <Text style={styles.feedbackSub}>
                {feedback.eliminatedName} was a {modeRule.visibleRole}.
              </Text>
              <Text style={styles.feedbackRemaining}>
                {feedback.remainingHidden} {modeRule.hiddenRole}{feedback.remainingHidden !== 1 ? 's' : ''} remain.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.feedbackSub}>
                {feedback.caughtCount === 1
                  ? `1 ${modeRule.hiddenRole} caught!`
                  : `${feedback.caughtCount} ${modeRule.hiddenRole}s caught!`}
              </Text>
              <Text style={styles.feedbackRemaining}>
                {feedback.remaining === 1
                  ? `1 ${modeRule.hiddenRole} is still hiding...`
                  : `${feedback.remaining} ${modeRule.hiddenRole}s are still hiding...`}
              </Text>
            </>
          )}
          <BigButton
            title="Continue Voting"
            onPress={handleContinue}
            variant="primary"
            style={styles.btn}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title="Vote" />
      <Text style={styles.subtitle}>
        {votePrompt}{remainingHiddenRoles > 1 ? ` (${remainingHiddenRoles} remain)` : ''}
      </Text>
      {isMultiHidden && (
        <Text style={styles.hint}>You may select multiple players</Text>
      )}

      <FlatList
        data={votablePlayers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PlayerListItem
            player={item}
            selected={selectedIds.includes(item.id)}
            onPress={togglePlayer}
            multiSelect={isMultiHidden}
          />
        )}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <BigButton
        title={selectedIds.length > 1 ? `Confirm Vote (${selectedIds.length} selected)` : 'Confirm Vote'}
        onPress={handleVote}
        variant={modeRule.confirmVoteVariant}
        disabled={selectedIds.length === 0}
        style={styles.btn}
      />
      <View style={{ height: 20 }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 12,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  btn: {
    width: '100%',
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  feedbackTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  feedbackSub: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  feedbackRemaining: {
    fontSize: 16,
    color: colors.textDim,
    marginBottom: 40,
    textAlign: 'center',
  },
});
