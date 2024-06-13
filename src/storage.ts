import { HIGH_SCORE_KEY } from './constants';

export function getHighScore(): number {
  const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
  return savedHighScore ? parseInt(savedHighScore) : 0;
}

export function saveHighScore(highScore: number): void {
  localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
}
