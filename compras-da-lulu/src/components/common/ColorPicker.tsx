import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const PALETTE = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
  '#F43F5E', '#84CC16', '#06B6D4', '#A855F7',
];

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.grid}>
      {PALETTE.map((hex) => {
        const selected = hex.toLowerCase() === value.toLowerCase();
        return (
          <TouchableOpacity
            key={hex}
            onPress={() => onChange(hex)}
            style={[
              styles.swatch,
              { backgroundColor: hex },
              selected && [styles.selected, { borderColor: tokens.text }],
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderWidth: 3,
  },
});
