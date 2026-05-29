import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface ThemedButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
}

export function ThemedButton({ label, loading = false, disabled, style, ...rest }: ThemedButtonProps) {
  const { tokens, fontFamily } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        styles.button,
        { backgroundColor: tokens.primary, opacity: isDisabled ? 0.5 : 1 },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={tokens.primaryText} />
      ) : (
        <Text style={[styles.label, { color: tokens.primaryText, fontFamily }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, fontWeight: '600' },
});
