const categoryBgMap = {
  geography: require('../../assets/geography-bg.png'),
  ph_politics: require('../../assets/phpolitics-bg.png'),
  mathematics: require('../../assets/mathematics-bg.png'),
  sports: require('../../assets/sports-bg.png'),
  engineering: require('../../assets/engineering-bg.png'),
  object: require('../../assets/object-bg.png'),
  general_knowledge: require('../../assets/general-knowledge-bg.png'),
  riddles: require('../../assets/riddles-bg.png'),
  movie: require('../../assets/movie-bg.png'),
  genz_internet_culture: require('../../assets/genz-bg.png'),
  computer_science: require('../../assets/computer-science-bg.png'),
  geek: require('../../assets/geek-bg.png'),
};

export const QUIZ_DEFAULT_BG = require('../../assets/quiz-mode-bg.png');

export function getQuizBg(categoryId) {
  if (!categoryId) return QUIZ_DEFAULT_BG;
  return categoryBgMap[categoryId] || QUIZ_DEFAULT_BG;
}
