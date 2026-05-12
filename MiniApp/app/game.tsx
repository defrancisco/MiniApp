// app/game.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { generateOperation, MathOperation, Difficulty } from '../src/models/MathEngine';
import ProgressBar from '../src/components/ProgressBar';

// Definimos el tiempo máximo por operación (ej. 10 segundos)
const TIME_LIMIT_MS = 10000; 

export default function GameScreen() {
  const { difficulty, mode } = useLocalSearchParams();
  const router = useRouter();
  
  const [operation, setOperation] = useState<MathOperation | null>(null);
  const [answer, setAnswer] = useState('');
  
  // Estado para el cronómetro
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_MS);

  // Generar nueva cuenta y reiniciar el reloj
  const startNewRound = () => {
    setOperation(generateOperation((difficulty as Difficulty) || 'facil'));
    setAnswer('');
    setTimeLeft(TIME_LIMIT_MS);
  };

  // Efecto inicial
  useEffect(() => {
    startNewRound();
  }, [difficulty]);

  // Efecto del Cronómetro
  useEffect(() => {
    // Si no hay operación activa o el tiempo llegó a cero, no hacemos nada
    if (!operation || timeLeft <= 0) return;

    // Restamos 100ms cada 100ms para una animación fluida de la barra
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer);
          handleTimeOut(); // Se acabó el tiempo
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    // Limpieza obligatoria del intervalo
    return () => clearInterval(timer);
  }, [operation, timeLeft]);

  const handleTimeOut = () => {
    Alert.alert('¡Tiempo agotado!', 'Perdiste 50 puntos.', [
      { text: 'Siguiente', onPress: startNewRound }
    ]);
  };

  const handleValidate = () => {
    if (!operation || answer === '') return;

    const userAnswer = parseInt(answer);

    if (userAnswer === operation.correctAnswer) {
      // Aquí más adelante calcularemos si respondió rápido (menos del 75%) o normal
      Alert.alert('¡Correcto!', `Te sobraron ${timeLeft / 1000} segundos.`);
      startNewRound();
    } else {
      Alert.alert('Incorrecto', `La respuesta era ${operation.correctAnswer}`);
      startNewRound();
    }
  };

  // Calculamos qué porcentaje de la barra debe estar pintado de rojo
  const progressPercentage = (timeLeft / TIME_LIMIT_MS) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Modo: {mode} | Dificultad: {difficulty}</Text>

      {/* Agregamos nuestra nueva barra de progreso */}
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
            placeholderTextColor="#A6ADC8"
            autoFocus // Para que el teclado se abra solo
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
  );
}

// ... Mantén los mismos estilos (styles) que tenías antes en game.tsx
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E2E', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  infoText: { color: '#A6ADC8', fontSize: 16, marginBottom: 20, textTransform: 'capitalize' },
  gameArea: { width: '100%', alignItems: 'center' },
  questionText: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 30 },
  input: { width: '80%', backgroundColor: '#313244', color: '#FFFFFF', fontSize: 24, padding: 15, borderRadius: 10, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#A6E3A1', paddingVertical: 15, width: '80%', borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#11111B' },
  backButton: { marginTop: 'auto', marginBottom: 40 },
  backButtonText: { color: '#F38BA8', fontSize: 16, textDecorationLine: 'underline' },
});