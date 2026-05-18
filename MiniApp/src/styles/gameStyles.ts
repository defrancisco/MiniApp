import { StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';

export const gameStyles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, backgroundColor: Theme.colors.backgroundOverlay },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
  titleText: { color: Theme.colors.secondary, fontSize: 18, fontWeight: 'bold' },
  iterationText: { color: Theme.colors.accent, fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  scoreText: { color: Theme.colors.primary, fontSize: 22, fontWeight: '900' },
  gameArea: { width: '100%', alignItems: 'center' },
  questionText: { fontSize: 48, fontWeight: '900', color: Theme.colors.primary, marginBottom: 30, textShadowColor: 'rgba(255, 255, 255, 0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  input: { width: '80%', backgroundColor: Theme.colors.cardBackground, color: Theme.colors.primary, fontSize: 24, padding: 15, borderRadius: 15, textAlign: 'center', marginBottom: 20, borderWidth: 2, borderColor: Theme.colors.borderColor },
  button: { backgroundColor: Theme.colors.primary, paddingVertical: 15, width: '80%', borderRadius: 15, alignItems: 'center', marginBottom: 40, elevation: 3 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.cardBackground },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 'auto', marginBottom: 40 },
  restartButton: { paddingVertical: 10, paddingHorizontal: 20 },
  restartButtonText: { color: Theme.colors.secondary, fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
  backButton: { paddingVertical: 10, paddingHorizontal: 20 },
  backButtonText: { color: Theme.colors.accent, fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  gridButton: { backgroundColor: Theme.colors.primary, paddingVertical: 15, width: '45%', borderRadius: 15, alignItems: 'center', marginBottom: 20, elevation: 3 }
});