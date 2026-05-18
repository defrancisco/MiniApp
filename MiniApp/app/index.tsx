import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
// Importamos el archivo central de diseño
import { Theme } from '../src/constants/theme';
import { indexStyles as styles } from '../src/styles/indexStyles';

export default function WelcomeScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('facil');
  const [iterations, setIterations] = useState('5');

  const levels = [
    { id: 'facil', label: 'Fácil', color: Theme.colors.levels.facil },
    { id: 'medio', label: 'Medio', color: Theme.colors.levels.medio },
    { id: 'dificil', label: 'Difícil', color: Theme.colors.levels.dificil },
  ];

  // Configuración dinámica de colores para las iteraciones
  const roundOptions = [
    { id: '5', label: '5', color: Theme.colors.iterations.i5 },
    { id: '10', label: '10', color: Theme.colors.iterations.i10 },
    { id: '15', label: '15', color: Theme.colors.iterations.i15 },
  ];

  const navigateToGame = (mode: string) => {
    router.push({
      pathname: '/game',
      params: { mode, difficulty, iterations }
    });
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Cálculo Mental</Text>

        {/* --- DIFICULTAD --- */}
        <Text style={styles.subtitle}>Dificultad:</Text>
        <View style={styles.rowContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionButton, 
                { backgroundColor: level.color },
                difficulty === level.id && styles.selectedOption
              ]}
              onPress={() => setDifficulty(level.id)}
            >
              <Text style={styles.optionText}>{level.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- PREGUNTAS POR PARTIDA (AHORA CON COLORES) --- */}
        <Text style={styles.subtitle}>Preguntas por partida:</Text>
        <View style={styles.rowContainer}>
          {roundOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionButton, 
                { backgroundColor: opt.color },
                iterations === opt.id && styles.selectedOption
              ]}
              onPress={() => setIterations(opt.id)}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- MODOS DE JUEGO --- */}
        <Text style={styles.subtitle}>Modo de Juego:</Text>
        
        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Clásico')}>
          <Text style={styles.modeText}>Modo Clásico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Verdadero-Falso')}>
          <Text style={styles.modeText}>Verdadero / Falso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeButton} onPress={() => navigateToGame('Multiple-Choice')}>
          <Text style={styles.modeText}>Múltiple Choice</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.modeButton, { backgroundColor: Theme.colors.accent, borderColor: Theme.colors.accent }]} 
          onPress={() => navigateToGame('Contra Reloj')}
        >
          <Text style={[styles.modeText, { color: Theme.colors.textLight }]}>⏱ Contra Reloj</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyLink} onPress={() => router.push('/history')}>
          <Text style={styles.historyLinkText}>🏆 Ver Mejores Puntajes</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

