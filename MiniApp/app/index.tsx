import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cálculo Mental</Text>
      <Text style={styles.subtitle}>¡Pon a prueba tu velocidad!</Text>

      {/* Botón para iniciar el juego en modo Clásico y Fácil */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => 
          router.push({ 
            pathname: '/game', 
            params: { difficulty: 'facil', mode: 'clasico' } 
          })
        }
      >
        <Text style={styles.buttonText}>Jugar Fácil - Clásico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E', // Un color oscuro elegante
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#A6ADC8',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#89B4FA', // Azul vibrante
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3, // Sombra en Android
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11111B',
  },
});