import { pickRandom, shuffleArray } from '../utils/random';
import { getModeRule } from './modeRules';

/**
 * initGame now supports:
 * - categories: array of category objects (multi-select); words are merged
 * - targetRoleCount: how many hidden-role players to assign
 * - playerNames: optional array of names (length === playerCount)
 * - mode: determines which role is hidden and hunted
 */
export function initGame({ playerCount, categories, targetRoleCount = 1, playerNames, mode = 'normal' }) {
  const modeRule = getModeRule(mode);
  // Tag each word with its source category
  const taggedWords = categories.flatMap((c) =>
    c.words.map((w) => ({ ...w, _categoryId: c.id, _categoryName: c.name }))
  );
  const wordObj = pickRandom(taggedWords);

  // Pick N unique hidden-role indices via shuffle
  const allIndices = Array.from({ length: playerCount }, (_, i) => i);
  const shuffled = shuffleArray(allIndices);
  const hiddenRoleCount = Math.min(targetRoleCount, playerCount - 1);
  const hiddenRoleIndices = new Set(shuffled.slice(0, hiddenRoleCount));

  const players = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: i + 1,
      name: playerNames?.[i] || `Player ${i + 1}`,
      role: hiddenRoleIndices.has(i) ? modeRule.hiddenRole : modeRule.visibleRole,
      hasViewed: false,
    });
  }

  const hiddenRoleIds = shuffled.slice(0, hiddenRoleCount).map((idx) => idx + 1);

  return {
    players,
    word: wordObj.word,
    clue: wordObj.clue,
    hiddenRoleIds,
    categoryId: wordObj._categoryId,
    categoryName: wordObj._categoryName,
    categories,
  };
}

export function evaluateVote(votedPlayerId, hiddenRoleIds) {
  return hiddenRoleIds.includes(votedPlayerId) ? 'caught' : 'escaped';
}

export function evaluateGuess(guess, actualWord) {
  return guess.trim().toLowerCase() === actualWord.trim().toLowerCase();
}

export function getGuessOptions(categories, actualWord, count = 5) {
  const allWords = categories.flatMap((c) => c.words);
  const otherWords = allWords
    .map((w) => w.word)
    .filter((w) => w.toLowerCase() !== actualWord.toLowerCase());

  // Deduplicate
  const unique = [...new Set(otherWords)];
  const randomized = shuffleArray(unique);
  const options = randomized.slice(0, count - 1);
  options.push(actualWord);
  return shuffleArray(options);
}
