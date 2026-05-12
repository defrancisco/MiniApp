import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { Difficulty } from '../src/models/MathEngine';
import { calculateScore } from '../src/models/ScoreEngine';
import ProgressBar from '../src/components/ProgressBar';

import { generarPreguntaMC, generarPreguntaVF, generarPreguntaClasica } from '../src/strategies/GameModes';
// 1. Importamos la función para guardar la partida
import { saveScore } from '../src/models/StorageEngine';

const TIME_LIMIT_MS = 10000; 

export default function GameScreen() {
  const { difficulty, mode } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
  const [score, setScore] = useState(0);

  const modoNormalizado = String(mode || '').toLowerCase();
  const esMultipleChoice = modoNormalizado.includes('choice') || modoNormalizado.includes('ltiple') || modoNormalizado.includes('multiple');
  const esVerdaderoFalso = modoNormalizado.includes('verdadero') || modoNormalizado.includes('falso') || modoNormalizado.includes('v/f');
  const esClasico = !esMultipleChoice && !esVerdaderoFalso;

  const startNewRound = () => {
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
    setTimeLeft(TIME_LIMIT_MS);
  };

  useEffect(() => {
    startNewRound();
  }, [difficulty, mode]);

  useEffect(() => {
    if (!currentRound || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer);
          handleTimeOut(); 
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentRound, timeLeft]);

  // 2. Función que guarda los datos en AsyncStorage y nos lleva al historial
  const handleEndGame = async () => {
    await saveScore(String(mode || 'Clásico'), String(difficulty || 'Fácil'), score);
    router.replace('/history');
  };

  const handleTimeOut = () => {
    const points = calculateScore(false, true, 0, TIME_LIMIT_MS);
    setScore(prev => prev + points);

    Alert.alert('¡Tiempo agotado!', `Perdiste ${Math.abs(points)} puntos.`, [
      { text: 'Siguiente', onPress: startNewRound },
      { text: 'Terminar Partida', onPress: handleEndGame, style: 'destructive' }
    ]);
  };

  const handleValidate = (respuestaUsuario: string | number) => {
    if (!currentRound) return;

    const isCorrect = respuestaUsuario == currentRound.respuestaCorrecta; 
    
    const points = calculateScore(isCorrect, false, timeLeft, TIME_LIMIT_MS);
    setScore(prev => prev + points);

    if (isCorrect) {
      Alert.alert('¡Correcto!', `Sumaste ${points} puntos.`);
    } else {
      Alert.alert('Incorrecto', `La respuesta era ${currentRound.respuestaCorrecta}. Perdiste ${Math.abs(points)} puntos.`);
    }
    startNewRound();
  };

  const progressPercentage = (timeLeft / TIME_LIMIT_MS) * 100;
  const tituloPantalla = esMultipleChoice ? 'Múltiple Choice' : (esVerdaderoFalso ? 'Verdadero / Falso' : 'Modo Clásico');

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
                   <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50', flex: 1, marginHorizontal: 5 }]} onPress={() => handleValidate('Verdadero')}>
                     <Text style={styles.buttonText}>Verdadero</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.button, { backgroundColor: '#F44336', flex: 1, marginHorizontal: 5 }]} onPress={() => handleValidate('Falso')}>
                     <Text style={styles.buttonText}>Falso</Text>
                   </TouchableOpacity>
                </View>
              </>
            )}

            {esClasico && (
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

        {/* 3. Botón para terminar y llamar a la función que guarda los puntos */}
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