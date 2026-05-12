import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { generateOperation, MathOperation, Difficulty } from '../src/models/MathEngine';
import { calculateScore } from '../src/models/ScoreEngine';
import ProgressBar from '../src/components/ProgressBar';

const TIME_LIMIT_MS = 10000; 

export default function GameScreen() {
  const { difficulty, mode } = useLocalSearchParams();
  const router = useRouter();
  
  const [operation, setOperation] = useState<MathOperation | null>(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);
  
  // ¡Nuevo estado para el puntaje acumulado!
  const [score, setScore] = useState(0);

  const startNewRound = () => {
    setOperation(generateOperation((difficulty as Difficulty) || 'facil'));
    setAnswer('');
    setTimeLeft(TIME_LIMIT_MS);
  };

  useEffect(() => {
    startNewRound();
  }, [difficulty]);

  useEffect(() => {
    if (!operation || timeLeft <= 0) return;

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
  }, [operation, timeLeft]);

  const handleTimeOut = () => {
    // Calculamos puntaje por tiempo agotado
    const points = calculateScore(false, true, 0, TIME_LIMIT_MS);
    setScore(prev => prev + points);

    Alert.alert('¡Tiempo agotado!', `Perdiste ${Math.abs(points)} puntos.`, [
      { text: 'Siguiente', onPress: startNewRound }
    ]);
  };

  const handleValidate = () => {
    if (!operation || answer === '') return;

    const userAnswer = parseInt(answer);
    const isCorrect = userAnswer === operation.correctAnswer;

    // Calculamos el puntaje usando nuestro motor
    const points = calculateScore(isCorrect, false, timeLeft, TIME_LIMIT_MS);
    setScore(prev => prev + points);

    if (isCorrect) {
      Alert.alert('¡Correcto!', `Sumaste ${points} puntos.`);
      startNewRound();
    } else {
      Alert.alert('Incorrecto', `La respuesta era ${operation.correctAnswer}. Perdiste ${Math.abs(points)} puntos.`);
      startNewRound();
    }
  };

  const progressPercentage = (timeLeft / TIME_LIMIT_MS) * 100;

  return (
    // Agregamos el mismo ImageBackground que en el index
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Mostramos el puntaje en la parte superior */}
        <View style={styles.header}>
          <Text style={styles.infoText}>Modo: {mode} | Dificultad: {difficulty}</Text>
          <Text style={styles.scoreText}>Puntos: {score}</Text>
        </View>

        <ProgressBar percentage={progressPercentage} />

        {operation && (
          <View style={styles.gameArea}>
            <Text style={styles.questionText}>{operation.question} = ?</Text>
            
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={answer}
              onChangeText={setAnswer}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#A08055"
              autoFocus 
            />

            <TouchableOpacity style={styles.button} onPress={handleValidate}>
              <Text style={styles.buttonText}>Responder</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Abandonar Partida</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Mismo filtro sutil
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoText: { 
    color: '#A08055', 
    fontSize: 16, 
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  scoreText: {
    color: '#D4A373',
    fontSize: 20,
    fontWeight: '900',
  },
  gameArea: { 
    width: '100%', 
    alignItems: 'center' 
  },
  questionText: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#D4A373', 
    marginBottom: 30,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: { 
    width: '80%', 
    backgroundColor: '#FEFAE0', 
    color: '#D4A373', 
    fontSize: 24, 
    padding: 15, 
    borderRadius: 15, 
    textAlign: 'center', 
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E9C46A',
  },
  button: { 
    backgroundColor: '#D4A373', 
    paddingVertical: 15, 
    width: '80%', 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 40,
    elevation: 3,
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FEFAE0' 
  },
  backButton: { 
    marginTop: 'auto', 
    marginBottom: 40 
  },
  backButtonText: { 
    color: '#E07A5F', // Un rojo/naranja más suave
    fontSize: 16, 
    fontWeight: 'bold',
    textDecorationLine: 'underline' 
  },
});