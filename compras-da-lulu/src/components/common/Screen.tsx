import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function Screen({ children, noPadding = false, style, ...rest }: ScreenProps) {
  const { tokens } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tokens.background }]}>
      <View style={[styles.content, noPadding && styles.noPadding, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: 16 },
  noPadding: { padding: 0 },
});
