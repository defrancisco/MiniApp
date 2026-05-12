

export type Difficulty = 'facil' | 'medio' | 'dificil';

// Interfaz para representar una operación matemática
export interface MathOperation {
  question: string;
  correctAnswer: number;
}

// Genera una operación matemática basada en la dificultad seleccionada
export const generateOperation = (difficulty: Difficulty): MathOperation => {
  let num1: number, num2: number, operator: string;
  let correctAnswer: number = 0;

  const getRandomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  switch (difficulty) {
    case 'facil':
      // Sumas y restas simples (1 al 20)
      num1 = getRandomInt(1, 20);
      num2 = getRandomInt(1, 20);
      operator = Math.random() > 0.5 ? '+' : '-';
      
      // Evitar resultados negativos para nivel fácil
      if (operator === '-' && num1 < num2) {
        const temp = num1;
        num1 = num2;
        num2 = temp;
      }
      break;

    case 'medio':
      // Sumas, restas y multiplicaciones (números un poco más grandes)
      const opsMedio = ['+', '-', '*'];
      operator = opsMedio[Math.floor(Math.random() * opsMedio.length)];
      num1 = getRandomInt(10, 50);
      num2 = operator === '*' ? getRandomInt(2, 12) : getRandomInt(10, 50);
      break;

    case 'dificil':
      // Incluye divisiones exactas y números más complejos
      const opsDificil = ['+', '-', '*', '/'];
      operator = opsDificil[Math.floor(Math.random() * opsDificil.length)];
      
      if (operator === '/') {
        num2 = getRandomInt(2, 15); // Divisor
        correctAnswer = getRandomInt(3, 20); // Cociente entero
        num1 = num2 * correctAnswer; // Dividendo exacto
      } else {
        num1 = getRandomInt(20, 100); // Números más grandes para sumas, restas y multiplicaciones
        num2 = operator === '*' ? getRandomInt(5, 25) : getRandomInt(20, 100);
      }
      break;
  }

  // Calcular la respuesta correcta si no es división
  if (operator !== '/') {
    switch (operator) {
      case '+': correctAnswer = num1 + num2; break;
      case '-': correctAnswer = num1 - num2; break;
      case '*': correctAnswer = num1 * num2; break;
    }
  }

  // Devolver la pregunta y la respuesta correcta
  return {
    question: `${num1} ${operator} ${num2}`,
    correctAnswer
  };
};