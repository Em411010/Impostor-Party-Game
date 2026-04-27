import { shuffleArray } from '../utils/random';

/**
 * Pick a question from a category that hasn't been used yet.
 * When all questions are exhausted, the used list resets automatically.
 */
export function pickQuestion(category, usedIndices) {
  const total = category.questions.length;
  const currentUsed = usedIndices.length >= total ? [] : usedIndices;

  const available = [];
  for (let i = 0; i < total; i++) {
    if (!currentUsed.includes(i)) available.push(i);
  }

  const shuffled = shuffleArray(available);
  const idx = shuffled[0];

  return {
    question: category.questions[idx],
    newUsedIndices: [...currentUsed, idx],
  };
}

/** Returns true if the chosen answer matches the correct answer. */
export function checkAnswer(question, chosenAnswer) {
  return question.correctAnswer === chosenAnswer;
}

/**
 * Returns the index of the next active (non-eliminated) player,
 * wrapping around the array. Skips eliminated players.
 */
export function getNextActivePlayerIndex(players, currentIndex) {
  const total = players.length;
  for (let i = 1; i <= total; i++) {
    const nextIdx = (currentIndex + i) % total;
    if (!players[nextIdx].isEliminated) return nextIdx;
  }
  return currentIndex;
}

/** Returns the number of players who are not eliminated. */
export function countActivePlayers(players) {
  return players.filter((p) => !p.isEliminated).length;
}

/** Returns the winning player object if only one active player remains, else null. */
export function getWinner(players) {
  const active = players.filter((p) => !p.isEliminated);
  return active.length === 1 ? active[0] : null;
}
