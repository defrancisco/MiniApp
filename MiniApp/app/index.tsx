import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const startGame = (mode: string) => {
    router.push({ 
      pathname: '/game', 
      params: { difficulty: 'facil', mode: mode } 
    });
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      
      <ScrollView contentContainerStyle={styles.overlay}>
        <Image source={require('../assets/icon.jpg')} style={styles.logo} />

        <Text style={styles.title}>Cálculo Mental</Text>
        <Text style={styles.footer}>Selecciona un modo para empezar</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => startGame('clasico')}>
            <Text style={styles.buttonText}>Modo Clásico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => startGame('verdadero-falso')}>
            <Text style={styles.buttonText}>Verdadero / Falso</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.tertiaryButton]} onPress={() => startGame('multiple-choice')}>
            <Text style={styles.buttonText}>Múltiple Choice</Text>
          </TouchableOpacity>
        </View>

        
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  logo: { width: 120, height: 120, marginBottom: 15, borderRadius: 25 },
  title: { fontSize: 56, fontWeight: '900', color: '#D4A373', marginBottom: 2, textAlign: 'center' },
  buttonContainer: { width: '100%', gap: 15, marginTop: 40 },
  button: { backgroundColor: '#FEFAE0', paddingVertical: 15, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderColor: '#E9C46A', elevation: 3 },
  secondaryButton: { backgroundColor: '#FAEDCD' },
  tertiaryButton: { backgroundColor: '#F1E3B0' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#D4A373' },
  footer: { marginTop: -2, color: '#A08055', fontWeight: '600' }
});