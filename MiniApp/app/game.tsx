import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { Difficulty } from '../src/models/MathEngine';
import { calculateScore } from '../src/models/ScoreEngine';
import ProgressBar from '../src/components/ProgressBar';


import { generarPreguntaMC, generarPreguntaVF, generarPreguntaClasica } from '../src/strategies/GameModes';
import { saveScore } from '../src/models/StorageEngine';
// Importación del archivo centralizado de estilos
import { Theme } from '../src/constants/theme';
import { gameStyles as styles } from '../src/styles/gameStyles';

export default function GameScreen() {
  const { difficulty, mode, iterations } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const maxIterations = Number(iterations) || 5;

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const modoNormalizado = String(mode || '').toLowerCase();
  const esMultipleChoice = modoNormalizado.includes('choice') || modoNormalizado.includes('ltiple') || modoNormalizado.includes('multiple');
  const esVerdaderoFalso = modoNormalizado.includes('verdadero') || modoNormalizado.includes('falso') || modoNormalizado.includes('v/f');
  const esContraReloj = modoNormalizado.includes('reloj') || modoNormalizado.includes('contra');
  const esClasico = !esMultipleChoice && !esVerdaderoFalso && !esContraReloj;

  const obtenerTiempoPorDificultad = () => {
    const dif = String(difficulty || '').toLowerCase();
    if (dif === 'dificil') return 5000; 
    if (dif === 'medio') return 8000;  
    return 12000;                      
  };

  const TIME_LIMIT_MS = esContraReloj ? 60000 : obtenerTiempoPorDificultad();
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);

  const startNewRound = (reiniciarReloj = true) => {
    let nuevaPregunta;
    
    if (esMultipleChoice) {
       nuevaPregunta = generarPreguntaMC((difficulty as Difficulty) || 'facil');
    } else if (esVerdaderoFalso) {
       nuevaPregunta = generarPreguntaVF((difficulty as Difficulty) || 'facil');
    } else {
       nuevaPregunta = generarPreguntaClasica((difficulty as Difficulty) || 'facil');
    }

    setCurrentRound(nuevaPregunta);
    setAnswer('');
    
    if (reiniciarReloj) {
      setTimeLeft(TIME_LIMIT_MS);
    }
  };

  useEffect(() => {
    startNewRound(true);
  }, [difficulty, mode]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 100 : 0));
    }, 100);

    return () => clearInterval(timer);
  }, []); 

  const handleEndGame = async (finalScore: number) => {
    await saveScore(String(mode || 'Clásico'), String(difficulty || 'Fácil'), finalScore);
    router.replace('/history');
  };

  const handleRestartGame = async (finalScore: number) => {
    await saveScore(String(mode || 'Clásico'), String(difficulty || 'Fácil'), finalScore);
    setScore(0);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    setReactionTimes([]);
    startNewRound(true);
  };

  const confirmarReinicio = () => {
    Alert.alert(
      '🔄 Reiniciar Partida',
      '¿Estás seguro de que querés reiniciar? Se guardará tu progreso actual en el historial y volverás a empezar desde cero.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, reiniciar', onPress: () => handleRestartGame(score) }
      ],
      { cancelable: true }
    );
  };

  const mostrarEstadisticasFinales = (finalScore: number, finalCorrect: number, finalIncorrect: number, finalTimes: number[]) => {
    const promedioTiempo = finalTimes.length > 0 
      ? (finalTimes.reduce((acc, t) => acc + t, 0) / finalTimes.length).toFixed(2) 
      : '0.00';

    Alert.alert(
      '📊 Estadísticas de la Ronda',
      `¡Partida Finalizada!\n\n` +
      `✅ Respuestas Correctas: ${finalCorrect}\n` +
      `❌ Respuestas Incorrectas: ${finalIncorrect}\n` +
      `⏱️ Tiempo Promedio de Reacción: ${promedioTiempo}s\n\n` +
      `🏆 Puntaje Total Obtenido: ${finalScore} pts`,
      [
        { text: 'Jugar de Nuevo', onPress: () => handleRestartGame(finalScore) },
        { text: 'Guardar y Ver Historial', onPress: () => handleEndGame(finalScore) }
      ],
      { cancelable: false }
    );
  };

  const checkGameEnd = (currentScore: number, currentCorrect: number, currentIncorrect: number, currentTimes: number[]) => {
    if (!esContraReloj && questionNumber >= maxIterations) {
      mostrarEstadisticasFinales(currentScore, currentCorrect, currentIncorrect, currentTimes);
      return true;
    }
    return false;
  };

  const handleTimeOut = () => {
    const points = calculateScore(false, true, 0, TIME_LIMIT_MS);
    const newScore = score + points;
    const newIncorrect = incorrectCount + 1;
    
    const tiempoReaccion = TIME_LIMIT_MS / 1000;
    const newTimes = [...reactionTimes, tiempoReaccion];
    
    setScore(newScore);
    setIncorrectCount(newIncorrect);
    setReactionTimes(newTimes);

    if (esContraReloj) {
      mostrarEstadisticasFinales(newScore, correctCount, newIncorrect, newTimes);
    } else {
      if (!checkGameEnd(newScore, correctCount, newIncorrect, newTimes)) {
        Alert.alert('¡Tiempo agotado!', `Perdiste ${Math.abs(points)} puntos.`, [
          { text: 'Siguiente', onPress: () => {
              setQuestionNumber(prev => prev + 1);
              startNewRound(true);
          }}
        ]);
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && currentRound) {
      handleTimeOut();
    }
  }, [timeLeft]);

  const handleValidate = (respuestaUsuario: string | number) => {
    if (!currentRound) return;

    const isCorrect = respuestaUsuario == currentRound.respuestaCorrecta; 
    const points = calculateScore(isCorrect, false, timeLeft, TIME_LIMIT_MS);
    const newScore = score + points;

    const tiempoReaccion = (TIME_LIMIT_MS - timeLeft) / 1000;
    const newTimes = [...reactionTimes, tiempoReaccion];
    setReactionTimes(newTimes);

    let newCorrect = correctCount;
    let newIncorrect = incorrectCount;

    if (isCorrect) {
      newCorrect += 1;
      setCorrectCount(newCorrect);
      setScore(newScore);
      
      if (esContraReloj) {
        startNewRound(false); 
      } else {
        if (!checkGameEnd(newScore, newCorrect, newIncorrect, newTimes)) {
          Alert.alert('¡Correcto!', `Sumaste ${points} puntos.`, [
            { text: 'Siguiente', onPress: () => {
                setQuestionNumber(prev => prev + 1);
                startNewRound(true);
            }}
          ]);
        }
      }
    } else {
      newIncorrect += 1;
      setIncorrectCount(newIncorrect);
      
      if (esContraReloj) {
        mostrarEstadisticasFinales(newScore, newCorrect, newIncorrect, newTimes);
      } else {
        setScore(newScore);
        if (!checkGameEnd(newScore, newCorrect, newIncorrect, newTimes)) {
          Alert.alert('Incorrecto', `Era ${currentRound.respuestaCorrecta}.\nPerdiste ${Math.abs(points)} puntos.`, [
             { text: 'Siguiente', onPress: () => {
                 setQuestionNumber(prev => prev + 1);
                 startNewRound(true);
             }}
          ]);
        }
      }
    }
  };

  const progressPercentage = (timeLeft / TIME_LIMIT_MS) * 100;
  
  let tituloPantalla = 'Modo Clásico';
  if (esMultipleChoice) tituloPantalla = 'Múltiple Choice';
  if (esVerdaderoFalso) tituloPantalla = 'Verdadero / Falso';
  if (esContraReloj) tituloPantalla = 'Contra Reloj';

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <Stack.Screen options={{ title: tituloPantalla }} />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <View>
            <Text style={styles.titleText}>{tituloPantalla}</Text>
            {!esContraReloj && (
              <Text style={styles.iterationText}>Pregunta {questionNumber} de {maxIterations}</Text>
            )}
          </View>
          <Text style={styles.scoreText}>Puntos: {score}</Text>
        </View>

        <ProgressBar percentage={progressPercentage} />

        {currentRound && (
          <View style={styles.gameArea}>
            
            {esMultipleChoice && (
              <>
                <Text style={styles.questionText}>{currentRound.pregunta} = ?</Text>
                <View style={styles.grid}>
                   {currentRound.opciones.map((opcion: number, index: number) => (
                      <TouchableOpacity key={index} style={styles.gridButton} onPress={() => handleValidate(opcion)}>
                         <Text style={styles.buttonText}>{opcion}</Text>
                      </TouchableOpacity>
                   ))}
                </View>
              </>
            )}

            {esVerdaderoFalso && (
              <>
                <Text style={styles.questionText}>{currentRound.pregunta}</Text>
                <View style={styles.row}>
                   <TouchableOpacity style={[styles.button, { backgroundColor: Theme.colors.success, flex: 1, marginHorizontal: 5 }]} onPress={() => handleValidate('Verdadero')}>
                     <Text style={styles.buttonText}>Verdadero</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.button, { backgroundColor: Theme.colors.error, flex: 1, marginHorizontal: 5 }]} onPress={() => handleValidate('Falso')}>
                     <Text style={styles.buttonText}>Falso</Text>
                   </TouchableOpacity>
                </View>
              </>
            )}

            {(esClasico || esContraReloj) && (
              <>
                <Text style={styles.questionText}>{currentRound.pregunta} = ?</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Escribe tu respuesta..."
                  placeholderTextColor={Theme.colors.secondary}
                  autoFocus 
                />
                <TouchableOpacity style={styles.button} onPress={() => handleValidate(answer)}>
                  <Text style={styles.buttonText}>Responder</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.restartButton} onPress={confirmarReinicio}>
            <Text style={styles.restartButtonText}>Reiniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => mostrarEstadisticasFinales(score, correctCount, incorrectCount, reactionTimes)}>
            <Text style={styles.backButtonText}>Terminar y Guardar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

