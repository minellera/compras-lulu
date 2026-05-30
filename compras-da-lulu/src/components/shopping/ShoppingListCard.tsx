import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/common/ThemedText';
import { formatBRL } from '@/utils/money';
import type { ShoppingList } from '@/types';

interface ShoppingListCardProps {
  list: ShoppingList;
  onPress: () => void;
}

export function ShoppingListCard({ list, onPress }: ShoppingListCardProps) {
  const { tokens } = useTheme();
  const isCompleted = list.status === 'completed';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: tokens.surface,
          borderColor: isCompleted ? tokens.success : tokens.border,
        },
      ]}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <ThemedText style={styles.title} numberOfLines={1}>{list.title}</ThemedText>
          {!!list.description && (
            <ThemedText variant="muted" numberOfLines={1}>{list.description}</ThemedText>
          )}
          <View style={styles.meta}>
            <MaterialIcons name="shopping-cart" size={14} color={tokens.textMuted} />
            <ThemedText variant="muted" style={styles.metaText}>
              {list.items.length} {list.items.length === 1 ? 'item' : 'itens'}
            </ThemedText>
            {isCompleted && list.totalValue != null && (
              <>
                <ThemedText variant="muted" style={styles.dot}> · </ThemedText>
                <ThemedText variant="muted" style={styles.metaText}>
                  {formatBRL(list.totalValue)}
                </ThemedText>
              </>
            )}
          </View>
        </View>
        <View style={styles.right}>
          {isCompleted ? (
            <MaterialIcons name="check-circle" size={22} color={tokens.success} />
          ) : (
            <MaterialIcons name="chevron-right" size={22} color={tokens.textMuted} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '600' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  metaText: { fontSize: 12 },
  dot: { fontSize: 12 },
  right: { paddingLeft: 4 },
});
