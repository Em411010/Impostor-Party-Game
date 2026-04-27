import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import ScreenHeader from '../components/ScreenHeader';
import BigButton from '../components/BigButton';
import PlayerListItem from '../components/PlayerListItem';
import useGameStore from '../store/gameStore';
import { getModeRule } from '../engine/modeRules';
import { colors } from '../theme/colors';

export default function VoteScreen({ navigation }) {
  const players = useGameStore((s) => s.players);
  const submitVote = useGameStore((s) => s.submitVote);
  const mode = useGameStore((s) => s.mode);
  const caughtHiddenRoleIds = useGameStore((s) => s.caughtHiddenRoleIds);
  const hiddenRoleIds = useGameStore((s) => s.hiddenRoleIds);
  const currentVotingRound = useGameStore((s) => s.currentVotingRound);
  const [selectedId, setSelectedId] = useState(null);
  const modeRule = getModeRule(mode);

  const votablePlayers = useMemo(() => {
    return players.filter((p) => !caughtHiddenRoleIds.includes(p.id));
  }, [players, caughtHiddenRoleIds]);

  const remainingHiddenRoles = hiddenRoleIds.length - caughtHiddenRoleIds.length;
  const votePrompt = remainingHiddenRoles > 1 ? modeRule.votePromptPlural : modeRule.votePromptSingular;

  const handleVote = () => {
    if (selectedId === null) return;
    submitVote(selectedId);
    const state = useGameStore.getState();
    if (state.status === 'result') {
      navigation.replace('Result');
    }
    // status === 'voting' means more rounds (handled by re-render via store)
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title="Vote" />
      <Text style={styles.subtitle}>
        {votePrompt}{remainingHiddenRoles > 1 ? ` (${remainingHiddenRoles} remain)` : ''}
      </Text>
      {currentVotingRound > 0 && (
        <Text style={styles.roundInfo}>Round {currentVotingRound + 1} of voting</Text>
      )}

      <FlatList
        data={votablePlayers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PlayerListItem
            player={item}
            selected={selectedId === item.id}
            onPress={setSelectedId}
          />
        )}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <BigButton
        title="Confirm Vote"
        onPress={handleVote}
        variant={modeRule.confirmVoteVariant}
        disabled={selectedId === null}
        style={styles.btn}
      />
      <View style={{ height: 20 }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 12,
  },
  roundInfo: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
    marginBottom: 12,
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  btn: {
    width: '100%',
  },
});
