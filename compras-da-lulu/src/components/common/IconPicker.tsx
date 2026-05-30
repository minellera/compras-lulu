import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

const ICONS: string[] = [
  'shopping-cart', 'local-grocery-store', 'storefront', 'store',
  'restaurant', 'local-dining', 'local-pizza', 'bakery-dining',
  'local-drink', 'coffee', 'wine-bar', 'liquor',
  'egg', 'set-meal', 'rice-bowl', 'soup-kitchen',
  'fastfood', 'lunch-dining', 'breakfast-dining', 'brunch-dining',
  'icecream', 'cake', 'cookie', 'candy',
  'local-florist', 'grass', 'nature', 'eco',
  'cleaning-services', 'soap', 'sanitizer', 'wash',
  'pets', 'child-care', 'baby-changing-station', 'toys',
  'medical-services', 'medication', 'health-and-safety', 'fitness-center',
  'home', 'kitchen', 'blender', 'microwave',
  'checkroom', 'dry-cleaning', 'iron', 'laundry',
  'local-pharmacy', 'local-hospital', 'dentistry', 'face',
  'smartphone', 'laptop', 'cable', 'battery-charging-full',
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const { tokens } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? ICONS.filter((i) => i.includes(query.trim().toLowerCase()))
    : ICONS;

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar ícone..."
        placeholderTextColor={tokens.textMuted}
        style={[
          styles.search,
          {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
            color: tokens.text,
          },
        ]}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item}
        numColumns={6}
        style={styles.list}
        renderItem={({ item }) => {
          const selected = item === value;
          return (
            <TouchableOpacity
              onPress={() => onChange(item)}
              style={[
                styles.iconCell,
                selected && {
                  backgroundColor: tokens.primary,
                  borderRadius: 8,
                },
              ]}
            >
              <MaterialIcons
                name={item as never}
                size={28}
                color={selected ? tokens.primaryText : tokens.text}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  list: { flex: 1 },
  iconCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
