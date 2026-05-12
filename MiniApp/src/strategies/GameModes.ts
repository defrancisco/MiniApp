import { generateOperation, Difficulty } from '../models/MathEngine';

export const generarPreguntaClasica = (dificultad: Difficulty) => {
  const operacion = generateOperation(dificultad);
  return {
    pregunta: operacion.question,
    respuestaCorrecta: operacion.correctAnswer
  };
};

export const generarPreguntaVF = (dificultad: Difficulty) => {
  const operacion = generateOperation(dificultad);
  
  // 50% de prob de ser verdadero
  const esVerdadera = Math.random() > 0.5;
  // Si es falso, le sumamos un número random al resultado para que sea incorrecto
  const resultadoPropuesto = esVerdadera 
    ? operacion.correctAnswer 
    : operacion.correctAnswer + (Math.floor(Math.random() * 3) + 1);

  return {
    pregunta: `${operacion.question} = ${resultadoPropuesto}`,
    respuestaCorrecta: esVerdadera ? 'Verdadero' : 'Falso'
  };
};

export const generarPreguntaMC = (dificultad: Difficulty) => {
  const operacion = generateOperation(dificultad);
  const correcta = operacion.correctAnswer;
  
  // Generamos opciones mezcladas
  const opciones = [correcta, correcta + 2, correcta - 1, correcta + 5]
    .sort(() => Math.random() - 0.5);

  return {
    pregunta: operacion.question,
    opciones: opciones,
    respuestaCorrecta: correcta
  };
};