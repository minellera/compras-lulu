import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '@/components/common/Screen';
import { ThemedText } from '@/components/common/ThemedText';
import { useTheme } from '@/theme/ThemeProvider';
import { themes } from '@/theme/themes';
import { fontFamilyMap } from '@/theme/fonts';
import type { FontName, ThemeName } from '@/types';

const THEME_NAMES: ThemeName[] = ['white', 'black', 'green', 'red', 'pink', 'yellow', 'purple', 'blue'];
const FONT_NAMES: FontName[] = ['Inter', 'Roboto', 'Poppins', 'Nunito', 'Lato'];

const THEME_LABELS: Record<ThemeName, string> = {
  white: 'Branco',
  black: 'Preto',
  green: 'Verde',
  red: 'Vermelho',
  pink: 'Rosa',
  yellow: 'Amarelo',
  purple: 'Roxo',
  blue: 'Azul',
};

export default function SettingsScreen() {
  const { settings, tokens, setTheme, setFont } = useTheme();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText variant="title" style={styles.sectionTitle}>Configurações</ThemedText>

        <ThemedText variant="body" style={styles.label}>Tema</ThemedText>
        <View style={styles.swatchGrid}>
          {THEME_NAMES.map((name) => {
            const isActive = settings.theme === name;
            return (
              <TouchableOpacity
                key={name}
                onPress={() => setTheme(name)}
                style={[
                  styles.swatchItem,
                  { borderColor: isActive ? tokens.text : 'transparent', borderWidth: isActive ? 3 : 0 },
                ]}
              >
                <View style={[styles.swatch, { backgroundColor: themes[name].primary }]} />
                <ThemedText variant="muted" style={styles.swatchLabel}>
                  {THEME_LABELS[name]}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <ThemedText variant="body" style={[styles.label, styles.spacingTop]}>Fonte</ThemedText>
        {FONT_NAMES.map((name) => {
          const isActive = settings.fontFamily === name;
          return (
            <TouchableOpacity
              key={name}
              onPress={() => setFont(name)}
              style={[
                styles.fontItem,
                {
                  backgroundColor: isActive ? tokens.primary : tokens.surface,
                  borderColor: tokens.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.fontLabel,
                  {
                    fontFamily: fontFamilyMap[name],
                    color: isActive ? tokens.primaryText : tokens.text,
                  },
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginBottom: 24 },
  label: { marginBottom: 12, fontWeight: '600' },
  spacingTop: { marginTop: 24 },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatchItem: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 4,
    width: 68,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  swatchLabel: { marginTop: 4, fontSize: 11 },
  fontItem: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  fontLabel: { fontSize: 18 },
});
