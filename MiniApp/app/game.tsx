import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { Difficulty } from '../src/models/MathEngine';
import { calculateScore } from '../src/models/ScoreEngine';
import ProgressBar from '../src/components/ProgressBar';

import { generarPreguntaMC, generarPreguntaVF, generarPreguntaClasica } from '../src/strategies/GameModes';
import { saveScore } from '../src/models/StorageEngine';

export default function GameScreen() {
  const { difficulty, mode } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);

  // 1. Detectamos todos los modos, incluyendo el Contra Reloj
  const modoNormalizado = String(mode || '').toLowerCase();
  const esMultipleChoice = modoNormalizado.includes('choice') || modoNormalizado.includes('ltiple') || modoNormalizado.includes('multiple');
  const esVerdaderoFalso = modoNormalizado.includes('verdadero') || modoNormalizado.includes('falso') || modoNormalizado.includes('v/f');
  const esContraReloj = modoNormalizado.includes('reloj') || modoNormalizado.includes('contra');
  const esClasico = !esMultipleChoice && !esVerdaderoFalso && !esContraReloj;

  // 2. Calculamos el tiempo base según la dificultad elegida
  const obtenerTiempoPorDificultad = () => {
    const dif = String(difficulty || '').toLowerCase();
    if (dif === 'dificil') return 5000; 
    if (dif === 'medio') return 8000;  
    return 12000;                      
  };

  // 60s para contra reloj, o el tiempo dinámico para los demás modos
  const TIME_LIMIT_MS = esContraReloj ? 60000 : obtenerTiempoPorDificultad();
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);

  // 3. Modificamos startNewRound para que acepte NO reiniciar el reloj
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

  // Cuando arranca la pantalla por primera vez, generamos la primera pregunta
  useEffect(() => {
    startNewRound(true);
  }, [difficulty, mode]);

  // REGLA: El reloj corre solo basándose en el tiempo, no en la ronda
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 100 : 0));
    }, 100);

    return () => clearInterval(timer);
  }, []); 

  const handleEndGame = async () => {
    await saveScore(String(mode || 'Clásico'), String(difficulty || 'Fácil'), score);
    router.replace('/history');
  };

  const handleTimeOut = () => {
    const points = calculateScore(false, true, 0, TIME_LIMIT_MS);
    setScore(prev => prev + points);

    Alert.alert('¡Tiempo agotado!', `Se acabó el tiempo. Terminaste con ${score} puntos.`, [
      { text: 'Ver Resultados', onPress: handleEndGame }
    ]);
  };

  // Efecto separado para detectar cuando el tiempo llega a cero
  useEffect(() => {
    if (timeLeft === 0 && currentRound) {
      handleTimeOut();
    }
  }, [timeLeft]);

  const handleValidate = (respuestaUsuario: string | number) => {
    if (!currentRound) return;

    const isCorrect = respuestaUsuario == currentRound.respuestaCorrecta; 
    const points = calculateScore(isCorrect, false, timeLeft, TIME_LIMIT_MS);
    
    if (isCorrect) {
      setScore(prev => prev + points);
      if (!esContraReloj) {
        Alert.alert('¡Correcto!', `Sumaste ${points} puntos.`);
      }
      startNewRound(!esContraReloj); 
    } else {
      if (esContraReloj) {
        Alert.alert('¡Fallaste!', `En el Modo Contra Reloj un error termina la partida. La respuesta era ${currentRound.respuestaCorrecta}.`, [
          { text: 'Ver Resultados', onPress: handleEndGame, style: 'destructive' }
        ]);
      } else {
        setScore(prev => prev + points);
        Alert.alert('Incorrecto', `Era ${currentRound.respuestaCorrecta}.`);
        startNewRound(true); 
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
          <Text style={styles.titleText}>{tituloPantalla}</Text>
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
                   <TouchableOpacity style={[styles.button, { backgroundColor: '#95e198', flex: 1, marginHorizontal: 5 }]} onPress={() => handleValidate('Verdadero')}>
                     <Text style={styles.buttonText}>Verdadero</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.button, { backgroundColor: '#dc5248', flex: 1, marginHorizontal: 5 }]} onPress={() => handleValidate('Falso')}>
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
                  placeholderTextColor="#A08055"
                  autoFocus 
                />
                <TouchableOpacity style={styles.button} onPress={() => handleValidate(answer)}>
                  <Text style={styles.buttonText}>Responder</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={handleEndGame}>
          <Text style={styles.backButtonText}>Terminar y Guardar Partida</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  titleText: { color: '#A08055', fontSize: 18, fontWeight: 'bold' },
  scoreText: { color: '#D4A373', fontSize: 22, fontWeight: '900' },
  gameArea: { width: '100%', alignItems: 'center' },
  questionText: { fontSize: 48, fontWeight: '900', color: '#D4A373', marginBottom: 30, textShadowColor: 'rgba(255, 255, 255, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  input: { width: '80%', backgroundColor: '#FEFAE0', color: '#D4A373', fontSize: 24, padding: 15, borderRadius: 15, textAlign: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#E9C46A' },
  button: { backgroundColor: '#D4A373', paddingVertical: 15, width: '80%', borderRadius: 15, alignItems: 'center', marginBottom: 40, elevation: 3 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#FEFAE0' },
  backButton: { marginTop: 'auto', marginBottom: 40 },
  backButtonText: { color: '#E07A5F', fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  gridButton: { backgroundColor: '#D4A373', paddingVertical: 15, width: '45%', borderRadius: 15, alignItems: 'center', marginBottom: 20, elevation: 3 }
});