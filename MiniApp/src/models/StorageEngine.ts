import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORES_KEY = '@game_scores';

// Definimos cómo se ve una partida guardada
export interface GameRecord {
  id: string;
  date: string;
  mode: string;
  difficulty: string;
  score: number;
}

// Función para guardar una nueva partida
export const saveScore = async (mode: string, difficulty: string, score: number) => {
  try {
    const existingScores = await getScores();
    
    const newRecord: GameRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      mode,
      difficulty,
      score,
    };

    // Agregamos la nueva partida al historial
    const updatedScores = [...existingScores, newRecord];
    
    // Ordenamos de mayor a menor puntaje
    updatedScores.sort((a, b) => b.score - a.score);
    
    // Guardamos solo los mejores 10 para mantenerlo limpio (opcional)
    const topScores = updatedScores.slice(0, 10);

    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(topScores));
  } catch (error) {
    console.error('Error guardando el puntaje:', error);
  }
};

// Función para leer el historial
export const getScores = async (): Promise<GameRecord[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SCORES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error leyendo los puntajes:', error);
    return [];
  }
};