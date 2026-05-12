import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { generateOperation, MathOperation, Difficulty } from '../src/models/MathEngine';

export default function GameScreen() {
  // Obtenemos los parámetros que mandamos desde el Inicio
  const { difficulty, mode } = useLocalSearchParams();
  const router = useRouter();
  
  const [operation, setOperation] = useState<MathOperation | null>(null);
  const [answer, setAnswer] = useState('');

  // Generar la primera operación al cargar la pantalla
  useEffect(() => {
    setOperation(generateOperation((difficulty as Difficulty) || 'facil'));
  }, [difficulty]);

  const handleValidate = () => {
    if (!operation || answer === '') return;

    const userAnswer = parseInt(answer);

    if (userAnswer === operation.correctAnswer) {
      Alert.alert('¡Correcto!', 'Suma puntos aquí (próximamente)');
      // Generamos una nueva cuenta y limpiamos el input
      setOperation(generateOperation((difficulty as Difficulty) || 'facil'));
      setAnswer('');
    } else {
      Alert.alert('Incorrecto', `La respuesta correcta era ${operation.correctAnswer}`);
      setAnswer('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Modo: {mode} | Dificultad: {difficulty}</Text>

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
          />

          <TouchableOpacity style={styles.button} onPress={handleValidate}>
            <Text style={styles.buttonText}>Responder</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón para volver atrás */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Abandonar Partida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  infoText: {
    color: '#A6ADC8',
    fontSize: 16,
    marginBottom: 40,
    textTransform: 'capitalize',
  },
  gameArea: {
    width: '100%',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    backgroundColor: '#313244',
    color: '#FFFFFF',
    fontSize: 24,
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A6E3A1', // Verde pastel
    paddingVertical: 15,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11111B',
  },
  backButton: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  backButtonText: {
    color: '#F38BA8', // Rojo pastel
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});