// src/strategies/GameModes.ts
import { MathOperation } from '../models/MathEngine';

// Interfaz que define qué información necesita la vista
export interface GameModeState {
  questionDisplay: string;
  options?: number[]; // Solo para Múltiple Choice
  isTrueFalse?: boolean; // Para saber si mostramos botones de V/F
  proposedAnswer?: number; // La respuesta que le mostramos en el modo V/F
}

// Interfaz del Patrón Strategy
export interface GameModeStrategy {
  generateState(operation: MathOperation): GameModeState;
  validate(operation: MathOperation, userAnswer: number | boolean, proposedAnswer?: number): boolean;
}

// 1. ESTRATEGIA CLÁSICA
export const ClassicStrategy: GameModeStrategy = {
  generateState: (operation) => ({
    questionDisplay: `${operation.question} = ?`,
  }),
  validate: (operation, userAnswer) => operation.correctAnswer === userAnswer,
};

// 2. ESTRATEGIA VERDADERO / FALSO
export const TrueFalseStrategy: GameModeStrategy = {
  generateState: (operation) => {
    // 50% de probabilidad de mostrar la respuesta correcta, 50% de mostrar una falsa
    const isActuallyCorrect = Math.random() > 0.5;
    let proposedAnswer = operation.correctAnswer;

    if (!isActuallyCorrect) {
      // Generamos un error por poco margen para confundir al usuario
      const offset = Math.floor(Math.random() * 5) + 1; 
      proposedAnswer += (Math.random() > 0.5 ? offset : -offset);
    }

    return {
      questionDisplay: `${operation.question} = ${proposedAnswer}`,
      isTrueFalse: true,
      proposedAnswer,
    };
  },
  validate: (operation, userAnswer, proposedAnswer) => {
    // userAnswer en este caso será un boolean (true si tocó "Verdadero", false si tocó "Falso")
    const isCorrect = operation.correctAnswer === proposedAnswer;
    return isCorrect === userAnswer;
  },
};

// 3. ESTRATEGIA MÚLTIPLE CHOICE
export const MultipleChoiceStrategy: GameModeStrategy = {
  generateState: (operation) => {
    const options = new Set<number>();
    options.add(operation.correctAnswer); // Agregamos la correcta

    // Rellenamos con 3 opciones falsas
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 10) + 1;
      const fakeAnswer = operation.correctAnswer + (Math.random() > 0.5 ? offset : -offset);
      options.add(fakeAnswer);
    }

    // Mezclamos el array para que la correcta no esté siempre en el mismo lugar
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    return {
      questionDisplay: `${operation.question} = ?`,
      options: shuffledOptions,
    };
  },
  validate: (operation, userAnswer) => operation.correctAnswer === userAnswer,
};

// Función Factory para obtener la estrategia correcta según el string que le pasemos
export const getStrategy = (mode: string): GameModeStrategy => {
  switch (mode) {
    case 'verdadero-falso': return TrueFalseStrategy;
    case 'multiple-choice': return MultipleChoiceStrategy;
    case 'clasico':
    default: return ClassicStrategy;
  }
};