import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import BigButton from '../components/BigButton';
import useGameStore from '../store/gameStore';
import useSettingsStore from '../store/settingsStore';
import { defaultCategories } from '../data/categories';
import { getModeRule } from '../engine/modeRules';
import { pickRandom } from '../utils/random';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function ResultScreen({ navigation }) {
  const mode = useGameStore((s) => s.mode);
  const winner = useGameStore((s) => s.winner);
  const word = useGameStore((s) => s.word);
  const hiddenRoleIds = useGameStore((s) => s.hiddenRoleIds);
  const players = useGameStore((s) => s.players);
  const categories = useGameStore((s) => s.categories);
  const categoryName = useGameStore((s) => s.categoryName);
  const voteResult = useGameStore((s) => s.voteResult);
  const guessResult = useGameStore((s) => s.guessResult);
  const rematch = useGameStore((s) => s.rematch);
  const resetGame = useGameStore((s) => s.resetGame);
  const customCategories = useSettingsStore((s) => s.customCategories);
  const defaultCategoryAdditions = useSettingsStore((s) => s.defaultCategoryAdditions);
  const modeRule = getModeRule(mode);

  const allCategories = useMemo(() => {
    const defaults = defaultCategories.map((c) => {
      const additions = defaultCategoryAdditions[c.id] || [];
      return additions.length > 0 ? { ...c, words: [...c.words, ...additions] } : c;
    });
    return [...defaults, ...customCategories];
  }, [customCategories, defaultCategoryAdditions]);

  const civiliansWon = winner === 'civilians';
  const bgColor = civiliansWon ? colors.civilianBg : colors.impostorBg;
  const accentColor = civiliansWon ? colors.civilian : colors.impostor;

  const hiddenRoleNames = hiddenRoleIds
    .map((id) => players.find((p) => p.id === id)?.name || `Player ${id}`)
    .join(', ');

  const civilianCount = players.filter((player) => player.role === 'civilian').length;
  const impostorCount = players.filter((player) => player.role === 'impostor').length;

  const getMessage = () => {
    if (voteResult === 'escaped') {
      return modeRule.resultEscapedMessage;
    }
    if (guessResult === 'correct') {
      return modeRule.resultEscapedMessage;
    }
    return modeRule.resultCaughtMessage;
  };

  const getWinnerTitle = () => {
    if (winner === 'civilians') {
      return civilianCount === 1 ? 'Civilian Wins!' : 'Civilians Win!';
    }
    return impostorCount === 1 ? 'Impostor Wins!' : 'Impostors Win!';
  };

  const handleRematch = () => {
    let cats = categories;
    if (!cats || cats.length === 0) {
      cats = [pickRandom(allCategories)];
    }
    const names = players.map((p) => p.name);
    rematch(cats, names, mode);
    navigation.replace('RevealWait');
  };

  const handleNewGame = () => {
    resetGame();
    navigation.replace('Setup', { mode });
  };

  return (
    <ScreenWrapper backgroundColor={bgColor}>
      <View style={styles.container}>
        <Ionicons
          name={civiliansWon ? 'trophy-outline' : 'skull-outline'}
          size={64}
          color={accentColor}
        />

        <Text style={[styles.winnerText, { color: accentColor }]}>
          {getWinnerTitle()}
        </Text>

        <Text style={styles.message}>{getMessage()}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{hiddenRoleIds.length > 1 ? modeRule.roleInfoLabelPlural : modeRule.roleInfoLabelSingular}</Text>
            <Text style={styles.infoValue}>{hiddenRoleNames}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>The Word</Text>
            <Text style={styles.infoValue}>{word}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{categoryName}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <BigButton
            title="Play Again"
            onPress={handleRematch}
            variant={civiliansWon ? 'success' : 'danger'}
            style={styles.btn}
          />
          <BigButton
            title="New Game"
            onPress={handleNewGame}
            variant="dark"
            style={styles.btn}
          />
          <BigButton
            title="Home"
            onPress={() => {
              resetGame();
              navigation.replace('Home');
            }}
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
  },
  winnerText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 16,
  },
  message: {
    fontSize: 15,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  infoBox: {
    backgroundColor: colors.background + '80',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  infoItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textDim,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  buttons: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
  },
});
