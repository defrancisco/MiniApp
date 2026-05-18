// src/models/ScoreEngine.ts
import { GameRules } from '../constants/gameRules';

export const calculateScore = (
  isCorrect: boolean,
  isTimeOut: boolean,
  timeLeft: number,
  timeLimit: number
): number => {
  // Caso 1: Se acabó el tiempo
  if (isTimeOut) {
    return GameRules.scores.timeOut;
  }

  // Caso 2: Respondió mal
  if (!isCorrect) {
    return GameRules.scores.incorrect;
  }

  // Caso 3: Respondió bien, verificamos la velocidad
  const timeUsed = timeLimit - timeLeft;
  const fastThreshold = timeLimit * GameRules.thresholds.fastResponse;

  if (timeUsed < fastThreshold) {
    return GameRules.scores.correctFast; // Respondió rapidísimo
  } else {
    return GameRules.scores.correctNormal; // Respondió bien, pero tardó
  }
};