import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { getScores, GameRecord } from '../src/models/StorageEngine';


// HISTORIAL DE PARTIDAS

export default function HistoryScreen() {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const data = await getScores();
      setHistory(data);
    };
    loadData();
  }, []);

  const renderItem = ({ item }: { item: GameRecord }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.modeText}>{item.mode}</Text>
        <Text style={styles.dateText}>{item.date} - {item.difficulty}</Text>
      </View>
      <Text style={styles.scoreText}>{item.score} pts</Text>
    </View>
  );

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
    >
      <Stack.Screen options={{ title: 'Mejores Puntajes' }} />
      <View style={styles.overlay}>
        
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>¡Aún no hay partidas registradas!</Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
          <Text style={styles.backButtonText}>Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flex: 1, paddingTop: 20, paddingHorizontal: 20, backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  card: { 
    backgroundColor: '#FEFAE0', 
    padding: 15, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9C46A',
    elevation: 2
  },
  modeText: { fontSize: 18, fontWeight: 'bold', color: '#D4A373' },
  dateText: { fontSize: 12, color: '#A08055' },
  scoreText: { fontSize: 22, fontWeight: '900', color: '#E07A5F' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#A08055', fontSize: 16 },
  backButton: { backgroundColor: '#D4A373', padding: 15, borderRadius: 15, marginTop: 'auto', marginBottom: 30, alignItems: 'center' },
  backButtonText: { color: '#FEFAE0', fontWeight: 'bold', fontSize: 16 }
});