// src/components/ProgressBar.tsx
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  // Nos aseguramos de que el porcentaje no baje de 0
  const widthPercentage = Math.max(0, percentage);

  return (
    <View style={styles.container}>
      <Text style={styles.heart}>❤️</Text>
      
      <View style={styles.track}>
        {/* Esta es la barra que se va achicando */}
        <View style={[styles.fill, { width: `${widthPercentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  heart: {
    fontSize: 24,
    marginRight: 10,
  },
  track: {
    flex: 1,
    height: 24,
    backgroundColor: '#45475A', // Gris oscuro (fondo de la barra vacía)
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#11111B', // Borde negro estilo retro
    overflow: 'hidden', // Para que el relleno no se salga de los bordes curvos
  },
  fill: {
    height: '100%',
    backgroundColor: '#F38BA8', // Rojo vida
    borderRadius: 8,
  },
});