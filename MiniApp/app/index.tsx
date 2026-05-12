import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('facil');

  const levels = [
    { id: 'facil', label: 'Fácil', color: '#8ecae6' },
    { id: 'medio', label: 'Medio', color: '#ffb703' },
    { id: 'dificil', label: 'Difícil', color: '#fb8500' },
  ];

  const navigateToGame = (mode: string) => {
    router.push({
      pathname: '/game',
      params: { mode, difficulty }
    });
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Cálculo Mental</Text>

        {/* --- SELECTOR DE DIFICULTAD --- */}
        <Text style={styles.subtitle}>Selecciona Dificultad:</Text>
        <View style={styles.difficultyContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelButton, 
                { backgroundColor: level.color },
                difficulty === level.id && styles.selectedLevel
              ]}
              onPress={() => setDifficulty(level.id)}
            >
              <Text style={styles.levelText}>{level.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- MODOS DE JUEGO --- */}
        <Text style={styles.subtitle}>Selecciona un Modo:</Text>
        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Clásico')}>
          <Text style={styles.modeText}>Modo Clásico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Verdadero-Falso')}>
          <Text style={styles.modeText}>Verdadero / Falso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Multiple-Choice')}>
          <Text style={styles.modeText}>Múltiple Choice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.modeButton, { backgroundColor: '#E07A5F' }]} onPress={() => navigateToGame('Contra Reloj')}>
          <Text style={styles.modeText}>⏱ Contra Reloj</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyLink} onPress={() => router.push('/history')}>
          <Text style={styles.historyLinkText}>🏆 Ver Mejores Puntajes</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.4)', padding: 20 },
  title: { fontSize: 42, fontWeight: '900', color: '#D4A373', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#A08055', marginBottom: 10, marginTop: 15 },
  difficultyContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  levelButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 10, alignItems: 'center', opacity: 0.6 },
  selectedLevel: { opacity: 1, borderWidth: 2, borderColor: '#D4A373' },
  levelText: { color: '#FFF', fontWeight: 'bold' },
  modeButton: { backgroundColor: '#FEFAE0', paddingVertical: 15, width: '100%', borderRadius: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E9C46A' },
  modeText: { fontSize: 18, fontWeight: 'bold', color: '#D4A373' },
  historyLink: { marginTop: 20 },
  historyLinkText: { color: '#A08055', fontWeight: 'bold', textDecorationLine: 'underline' }
});