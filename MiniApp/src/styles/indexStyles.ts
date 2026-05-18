import { StyleSheet } from 'react-native';
import { Theme } from '../constants/theme';

export const indexStyles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.colors.backgroundOverlay, padding: 20 },
  title: { fontSize: 42, fontWeight: '900', color: Theme.colors.primary, marginBottom: 5 },
  subtitle: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.secondary, marginBottom: 5, marginTop: 10, alignSelf: 'flex-start' },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  optionButton: { flex: 1, paddingVertical: 8, marginHorizontal: 5, borderRadius: 10, alignItems: 'center', opacity: 0.5 },
  selectedOption: { opacity: 1, borderWidth: 2, borderColor: Theme.colors.primary },
  optionText: { color: Theme.colors.textLight, fontWeight: 'bold', fontSize: 16 },
  modeButton: { backgroundColor: Theme.colors.cardBackground, paddingVertical: 12, width: '100%', borderRadius: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: Theme.colors.borderColor },
  modeText: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.primary },
  historyLink: { marginTop: 15 },
  historyLinkText: { color: Theme.colors.secondary, fontWeight: 'bold', textDecorationLine: 'underline' }
});