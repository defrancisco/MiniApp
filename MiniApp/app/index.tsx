import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('facil');
<<<<<<< HEAD
  const [iterations, setIterations] = useState('5'); // Nuevo estado para las rondas
=======
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6

  const levels = [
    { id: 'facil', label: 'Fácil', color: '#8ecae6' },
    { id: 'medio', label: 'Medio', color: '#ffb703' },
    { id: 'dificil', label: 'Difícil', color: '#fb8500' },
  ];

<<<<<<< HEAD
  const roundOptions = ['5', '10', '15'];

  const navigateToGame = (mode: string) => {
    router.push({
      pathname: '/game',
      // Ahora mandamos también las iteraciones
      params: { mode, difficulty, iterations } 
=======
  const navigateToGame = (mode: string) => {
    router.push({
      pathname: '/game',
      params: { mode, difficulty }
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6
    });
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Cálculo Mental</Text>

        {/* --- SELECTOR DE DIFICULTAD --- */}
<<<<<<< HEAD
        <Text style={styles.subtitle}>Dificultad:</Text>
        <View style={styles.rowContainer}>
=======
        <Text style={styles.subtitle}>Selecciona Dificultad:</Text>
        <View style={styles.difficultyContainer}>
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6
          {levels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
<<<<<<< HEAD
                styles.optionButton, 
                { backgroundColor: level.color },
                difficulty === level.id && styles.selectedOption
              ]}
              onPress={() => setDifficulty(level.id)}
            >
              <Text style={styles.optionText}>{level.label}</Text>
=======
                styles.levelButton, 
                { backgroundColor: level.color },
                difficulty === level.id && styles.selectedLevel
              ]}
              onPress={() => setDifficulty(level.id)}
            >
              <Text style={styles.levelText}>{level.label}</Text>
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6
            </TouchableOpacity>
          ))}
        </View>

<<<<<<< HEAD
        {/* --- SELECTOR DE RONDAS --- */}
        <Text style={styles.subtitle}>Preguntas por partida:</Text>
        <View style={styles.rowContainer}>
          {roundOptions.map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.optionButton, 
                { backgroundColor: '#A08055' },
                iterations === num && styles.selectedOption
              ]}
              onPress={() => setIterations(num)}
            >
              <Text style={styles.optionText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- MODOS DE JUEGO --- */}
        <Text style={styles.subtitle}>Modo de Juego:</Text>
=======
        {/* --- MODOS DE JUEGO --- */}
        <Text style={styles.subtitle}>Selecciona un Modo:</Text>
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6
        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Clásico')}>
          <Text style={styles.modeText}>Modo Clásico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Verdadero-Falso')}>
          <Text style={styles.modeText}>Verdadero / Falso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Multiple-Choice')}>
          <Text style={styles.modeText}>Múltiple Choice</Text>
        </TouchableOpacity>

<<<<<<< HEAD
        <TouchableOpacity style={[styles.modeButton, { backgroundColor: '#E07A5F', borderColor: '#E07A5F' }]} onPress={() => navigateToGame('Contra Reloj')}>
          <Text style={[styles.modeText, { color: '#FFF' }]}>⏱ Contra Reloj</Text>
=======
        <TouchableOpacity style={[styles.modeButton, { backgroundColor: '#E07A5F' }]} onPress={() => navigateToGame('Contra Reloj')}>
          <Text style={styles.modeText}>⏱ Contra Reloj</Text>
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6
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
<<<<<<< HEAD
  title: { fontSize: 42, fontWeight: '900', color: '#D4A373', marginBottom: 5 },
  subtitle: { fontSize: 16, fontWeight: 'bold', color: '#A08055', marginBottom: 5, marginTop: 10, alignSelf: 'flex-start' },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  optionButton: { flex: 1, paddingVertical: 8, marginHorizontal: 5, borderRadius: 10, alignItems: 'center', opacity: 0.5 },
  selectedOption: { opacity: 1, borderWidth: 2, borderColor: '#D4A373' },
  optionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modeButton: { backgroundColor: '#FEFAE0', paddingVertical: 12, width: '100%', borderRadius: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E9C46A' },
  modeText: { fontSize: 18, fontWeight: 'bold', color: '#D4A373' },
  historyLink: { marginTop: 15 },
=======
  title: { fontSize: 42, fontWeight: '900', color: '#D4A373', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#A08055', marginBottom: 10, marginTop: 15 },
  difficultyContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  levelButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 10, alignItems: 'center', opacity: 0.6 },
  selectedLevel: { opacity: 1, borderWidth: 2, borderColor: '#D4A373' },
  levelText: { color: '#FFF', fontWeight: 'bold' },
  modeButton: { backgroundColor: '#FEFAE0', paddingVertical: 15, width: '100%', borderRadius: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E9C46A' },
  modeText: { fontSize: 18, fontWeight: 'bold', color: '#D4A373' },
  historyLink: { marginTop: 20 },
>>>>>>> 479cd05b916c16520ca24e47e750294afd9934a6
  historyLinkText: { color: '#A08055', fontWeight: 'bold', textDecorationLine: 'underline' }
});