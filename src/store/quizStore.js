import { create } from 'zustand';
import { pickQuestion, checkAnswer, getNextActivePlayerIndex, getWinner } from '../engine/quizEngine';

const useQuizStore = create((set, get) => ({
  // status: 'idle' | 'playing' | 'finished'
  status: 'idle',
  players: [],
  category: null,
  startingLives: 2,
  currentPlayerIndex: 0,
  currentQuestion: null,
  usedQuestionIndices: [],
  lastAnswerCorrect: null,
  lastCorrectAnswer: null,
  winner: null,
  currentPlayerEliminated: false,

  /**
   * Initialize a new quiz session.
   * @param {string[]} playerNameList - Array of player name strings (min 2)
   * @param {object} category - Quiz category object with questions array
   * @param {number} startingLives - Lives per player (min 2)
   */
  startQuiz: (playerNameList, category, startingLives) => {
    const players = playerNameList.map((name, i) => ({
      id: i + 1,
      name: name.trim() || `Player ${i + 1}`,
      lives: startingLives,
      isEliminated: false,
    }));

    const { question, newUsedIndices } = pickQuestion(category, []);

    set({
      status: 'playing',
      players,
      category,
      startingLives,
      currentPlayerIndex: 0,
      currentQuestion: question,
      usedQuestionIndices: newUsedIndices,
      lastAnswerCorrect: null,
      lastCorrectAnswer: null,
      winner: null,
      currentPlayerEliminated: false,
    });
  },

  /**
   * Process the current player's answer.
   * Updates lives, elimination status, and winner state.
   */
  submitAnswer: (chosenAnswer) => {
    const { currentQuestion, currentPlayerIndex, players } = get();
    const correct = checkAnswer(currentQuestion, chosenAnswer);
    const updatedPlayers = [...players];
    const player = { ...updatedPlayers[currentPlayerIndex] };
    let eliminated = false;

    if (!correct) {
      player.lives -= 1;
      if (player.lives <= 0) {
        player.lives = 0;
        player.isEliminated = true;
        eliminated = true;
      }
      updatedPlayers[currentPlayerIndex] = player;
    }

    const winner = getWinner(updatedPlayers);

    set({
      players: updatedPlayers,
      lastAnswerCorrect: correct,
      lastCorrectAnswer: currentQuestion.correctAnswer,
      currentPlayerEliminated: eliminated,
      winner: winner || null,
      status: winner ? 'finished' : 'playing',
    });
  },

  /**
   * Advance to the next active player and pick the next question.
   * Call this from LivesSummary screen before navigating to QuizPass.
   */
  advanceTurn: () => {
    const { players, currentPlayerIndex, category, usedQuestionIndices } = get();
    const nextIdx = getNextActivePlayerIndex(players, currentPlayerIndex);
    const { question, newUsedIndices } = pickQuestion(category, usedQuestionIndices);

    set({
      currentPlayerIndex: nextIdx,
      currentQuestion: question,
      usedQuestionIndices: newUsedIndices,
      lastAnswerCorrect: null,
      lastCorrectAnswer: null,
      currentPlayerEliminated: false,
    });
  },

  /** Reset all quiz state back to idle. */
  resetQuiz: () =>
    set({
      status: 'idle',
      players: [],
      category: null,
      startingLives: 2,
      currentPlayerIndex: 0,
      currentQuestion: null,
      usedQuestionIndices: [],
      lastAnswerCorrect: null,
      lastCorrectAnswer: null,
      winner: null,
      currentPlayerEliminated: false,
    }),
}));

export default useQuizStore;
