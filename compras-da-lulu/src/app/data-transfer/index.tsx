import { View, Text, StyleSheet } from 'react-native';

export default function DataTransferScreen() {
  return (
    <View style={styles.container}>
      <Text>Exportar / Importar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
