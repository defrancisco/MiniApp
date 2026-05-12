import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    // ImageBackground envuelve toda la pantalla
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      {/* Usamos un overlay para asegurarnos de que el texto se lea bien sobre los cuadros */}
      <View style={styles.overlay}>
        
        {/* Aquí agregamos tu ícono de estrella */}
        <Image 
          source={require('../assets/icon.jpg')} 
          style={styles.logo} 
        />

        <Text style={styles.title}>Cálculo Mental</Text>
        <Text style={styles.subtitle}>¡Pon a prueba tu velocidad!</Text>

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
    justifyContent: 'center',
    padding: 20,
    // Un fondo blanco apenas transparente para que resalte el contenido sin tapar el patrón
    backgroundColor: 'rgba(255, 255, 255, 0.4)', 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 30, // Redondea un poco los bordes cuadrados de la imagen jpg
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#D4A373', // Un tono mostaza/tierra oscuro
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 20,
    color: '#A08055',
    marginBottom: 40,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FEFAE0', // Un amarillo muy pastel
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 4, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#E9C46A',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A373',
  },
});