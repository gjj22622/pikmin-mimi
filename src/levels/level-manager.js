import { LEVEL_01 } from './level-01.js';

export class LevelManager {
  constructor() {
    this.levels = [LEVEL_01];
    this.currentLevelIndex = 0;
  }

  getCurrentLevel() {
    return this.levels[this.currentLevelIndex];
  }

  nextLevel() {
    this.currentLevelIndex = Math.min(
      this.currentLevelIndex + 1,
      this.levels.length - 1
    );
  }

  isLastLevel() {
    return this.currentLevelIndex >= this.levels.length - 1;
  }
}
