import { Doodler } from './doodler';
import { Platform } from './platform';

export function detectCollision(doodler: Doodler, platform: Platform): boolean {
  return (
    doodler.x < platform.x + platform.width &&
    doodler.x + doodler.width > platform.x &&
    doodler.y < platform.y + platform.height &&
    doodler.y + doodler.height > platform.y
  );
}

export function updateScore(velocityY: number, maxScore: number, score: number) {
  let points = Math.floor(5 * Math.random());
  if (velocityY < 0) {
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    }
  } else if (velocityY >= 0) {
    maxScore -= points;
  }
}
