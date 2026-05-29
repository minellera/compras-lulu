import { View, Text, StyleSheet } from 'react-native';

export default function ShoppingListsScreen() {
  return (
    <View style={styles.container}>
      <Text>Lista de Compras</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
