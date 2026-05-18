// LÓGICA DE PUNTUACIÓN

export const calculateScore = (
  isCorrect: boolean,
  isTimeOut: boolean,
  timeLeft: number,
  timeLimit: number
): number => {
  // Caso 1: Se acabó el tiempo
  if (isTimeOut) {
    return -50;
  }

  // Caso 2: Respondió mal
  if (!isCorrect) {
    return -30;
  }

  // Caso 3: Respondió bien, verificamos la velocidad
  // El tiempo usado es el límite total menos lo que sobró en el reloj
  const timeUsed = timeLimit - timeLeft;
  
  // Calculamos cuánto es el 75% del tiempo total
  const fastThreshold = timeLimit * 0.75;

  if (timeUsed < fastThreshold) {
    return 100; // Respondió rapidísimo
  } else {
    return 70;  // Respondió bien, pero tardó
  }
};