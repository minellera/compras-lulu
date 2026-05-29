import { Text, type TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'body' | 'muted';
}

export function ThemedText({ variant = 'body', style, ...rest }: ThemedTextProps) {
  const { tokens, fontFamily } = useTheme();

  const variantStyle = variant === 'title'
    ? styles.title
    : variant === 'muted'
    ? styles.muted
    : styles.body;

  const color = variant === 'muted' ? tokens.textMuted : tokens.text;

  return (
    <Text
      style={[variantStyle, { color, fontFamily }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  body: { fontSize: 16, lineHeight: 24 },
  muted: { fontSize: 14, lineHeight: 20 },
});
