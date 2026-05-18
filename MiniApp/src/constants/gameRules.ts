// src/constants/gameRules.ts

export const GameRules = {
  scores: {
    correctFast: 100,
    correctNormal: 70,
    incorrect: -30,
    timeOut: -50,
  },
  thresholds: {
    fastResponse: 0.75, // 75% del tiempo total
  }
};