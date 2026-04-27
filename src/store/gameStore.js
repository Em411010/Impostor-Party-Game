import { create } from 'zustand';
import { initGame, evaluateVote, evaluateGuess } from '../engine/gameEngine';
import { getModeRule } from '../engine/modeRules';
import { pickRandomIndex } from '../utils/random';

const useGameStore = create((set, get) => ({
  // Game state
  status: 'idle', // idle | setup | reveal | discussion | voting | guess | result
  mode: 'normal',
  playerCount: 4,
  targetRoleCount: 1,
  playerNames: [],
  categoryIds: [],
  categoryName: '',
  categories: [],
  word: '',
  clue: '',
  players: [],
  hiddenRoleIds: [],
  currentRevealIndex: 0,
  // Discussion
  discussionFirstPlayer: null,
  discussionDirection: 'clockwise',
  // Voting (sequential for multiple hidden-role players)
  caughtHiddenRoleIds: [],
  currentVotingRound: 0,
  votedPlayerId: null,
  voteResult: null,
  guessResult: null,
  winner: null,

  // Actions
  setPlayerCount: (count) => set({ playerCount: count }),
  setTargetRoleCount: (count) => set({ targetRoleCount: count }),
  setPlayerNames: (names) => set({ playerNames: names }),

  startGame: (categories, playerNames, mode = get().mode) => {
    const { playerCount, targetRoleCount } = get();
    const game = initGame({ playerCount, categories, targetRoleCount, playerNames, mode });
    // Random first player and direction for discussion
    const firstIdx = pickRandomIndex(playerCount);
    const direction = Math.random() < 0.5 ? 'clockwise' : 'counter-clockwise';
    set({
      mode,
      status: 'reveal',
      categoryIds: categories.map((c) => c.id),
      categoryName: game.categoryName,
      categories,
      word: game.word,
      clue: game.clue,
      players: game.players,
      hiddenRoleIds: game.hiddenRoleIds,
      currentRevealIndex: 0,
      discussionFirstPlayer: game.players[firstIdx],
      discussionDirection: direction,
      caughtHiddenRoleIds: [],
      currentVotingRound: 0,
      votedPlayerId: null,
      voteResult: null,
      guessResult: null,
      winner: null,
    });
  },

  markPlayerViewed: () => {
    const { currentRevealIndex, players } = get();
    const updated = [...players];
    updated[currentRevealIndex] = { ...updated[currentRevealIndex], hasViewed: true };
    set({ players: updated });
  },

  advanceReveal: () => {
    const { currentRevealIndex, players } = get();
    const next = currentRevealIndex + 1;
    if (next >= players.length) {
      set({ status: 'discussion', currentRevealIndex: next });
    } else {
      set({ currentRevealIndex: next });
    }
  },

  goToVoting: () => set({ status: 'voting' }),

  submitVote: (playerId) => {
    const { hiddenRoleIds, caughtHiddenRoleIds, mode } = get();
    const modeRule = getModeRule(mode);
    const result = evaluateVote(playerId, hiddenRoleIds);
    if (result === 'caught') {
      const newCaught = [...caughtHiddenRoleIds, playerId];
      if (newCaught.length >= hiddenRoleIds.length) {
        set({
          votedPlayerId: playerId,
          voteResult: 'caught',
          caughtHiddenRoleIds: newCaught,
          winner: modeRule.caughtWinner,
          status: 'result',
        });
      } else {
        set({
          voteResult: 'caught',
          caughtHiddenRoleIds: newCaught,
          currentVotingRound: newCaught.length,
          votedPlayerId: null,
          status: 'voting',
        });
      }
    } else {
      set({
        votedPlayerId: playerId,
        voteResult: 'escaped',
        winner: modeRule.escapedWinner,
        status: 'result',
      });
    }
  },

  submitGuess: (guess, actualWord) => {
    const correct = evaluateGuess(guess, actualWord);
    const { votedPlayerId, caughtHiddenRoleIds, hiddenRoleIds, mode } = get();
    const modeRule = getModeRule(mode);
    if (correct) {
      set({ guessResult: 'correct', winner: modeRule.escapedWinner, status: 'result' });
    } else {
      const newCaught = [...caughtHiddenRoleIds, votedPlayerId];
      if (newCaught.length >= hiddenRoleIds.length) {
        set({
          guessResult: 'wrong',
          caughtHiddenRoleIds: newCaught,
          winner: modeRule.caughtWinner,
          status: 'result',
        });
      } else {
        set({
          guessResult: 'wrong',
          caughtHiddenRoleIds: newCaught,
          currentVotingRound: newCaught.length,
          votedPlayerId: null,
          voteResult: null,
          status: 'voting',
        });
      }
    }
  },

  rematch: (categories, playerNames, mode = get().mode) => {
    const { playerCount, targetRoleCount } = get();
    const game = initGame({ playerCount, categories, targetRoleCount, playerNames, mode });
    const firstIdx = pickRandomIndex(playerCount);
    const direction = Math.random() < 0.5 ? 'clockwise' : 'counter-clockwise';
    set({
      mode,
      status: 'reveal',
      categoryIds: categories.map((c) => c.id),
      categoryName: game.categoryName,
      categories,
      word: game.word,
      clue: game.clue,
      players: game.players,
      hiddenRoleIds: game.hiddenRoleIds,
      currentRevealIndex: 0,
      discussionFirstPlayer: game.players[firstIdx],
      discussionDirection: direction,
      caughtHiddenRoleIds: [],
      currentVotingRound: 0,
      votedPlayerId: null,
      voteResult: null,
      guessResult: null,
      winner: null,
    });
  },

  resetGame: () =>
    set({
      status: 'idle',
      categoryIds: [],
      categoryName: '',
      categories: [],
      word: '',
      clue: '',
      players: [],
      hiddenRoleIds: [],
      currentRevealIndex: 0,
      discussionFirstPlayer: null,
      discussionDirection: 'clockwise',
      caughtHiddenRoleIds: [],
      currentVotingRound: 0,
      votedPlayerId: null,
      voteResult: null,
      guessResult: null,
      winner: null,
    }),
}));

export default useGameStore;
