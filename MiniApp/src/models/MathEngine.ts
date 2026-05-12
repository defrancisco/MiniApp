
export type Difficulty = 'facil' | 'medio' | 'dificil' | string;

export interface MathOperation {
  question: string;
  correctAnswer: number;
}

// Función auxiliar para obtener un número aleatorio entre min y max
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateOperation = (difficulty: Difficulty): MathOperation => {
  const diff = difficulty.toLowerCase();
  
  if (diff === 'dificil') {
    // DIFÍCIL: Multiplicaciones grandes y divisiones exactas
    const isMultiplication = Math.random() > 0.5;
    
    if (isMultiplication) {
      const a = getRandomInt(5, 20);
      const b = getRandomInt(5, 15);
      return { question: `${a} × ${b}`, correctAnswer: a * b };
    } else {
      // Para garantizar que la división sea exacta (sin decimales), 
      // multiplicamos dos números primero y pedimos que lo dividan.
      const divisor = getRandomInt(3, 15);
      const resultado = getRandomInt(4, 20);
      const dividendo = divisor * resultado;
      return { question: `${dividendo} ÷ ${divisor}`, correctAnswer: resultado };
    }
  } 
  
  else if (diff === 'medio') {
    // MEDIO: Sumas/Restas hasta 100, y multiplicaciones básicas
    const operationType = getRandomInt(1, 3); // 1: Suma, 2: Resta, 3: Multiplicación
    
    if (operationType === 1) {
      const a = getRandomInt(20, 80);
      const b = getRandomInt(10, 50);
      return { question: `${a} + ${b}`, correctAnswer: a + b };
    } else if (operationType === 2) {
      const a = getRandomInt(50, 100);
      const b = getRandomInt(10, 49);
      return { question: `${a} - ${b}`, correctAnswer: a - b };
    } else {
      const a = getRandomInt(2, 10);
      const b = getRandomInt(2, 10);
      return { question: `${a} × ${b}`, correctAnswer: a * b };
    }
  } 
  
  else {
    // FÁCIL (Por defecto): Sumas y restas hasta 20
    const isAddition = Math.random() > 0.5;
    
    if (isAddition) {
      const a = getRandomInt(1, 15);
      const b = getRandomInt(1, 10);
      return { question: `${a} + ${b}`, correctAnswer: a + b };
    } else {
      // Aseguramos que el resultado no sea negativo poniendo el mayor primero
      const a = getRandomInt(10, 20);
      const b = getRandomInt(1, a - 1); 
      return { question: `${a} - ${b}`, correctAnswer: a - b };
    }
  }
};