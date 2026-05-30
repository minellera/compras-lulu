import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { ThemedText } from '@/components/common/ThemedText';
import type { PurchaseItem } from '@/types';

interface PurchaseItemCardProps {
  item: PurchaseItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function PurchaseItemCard({ item, onEdit, onDelete }: PurchaseItemCardProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: tokens.surface, borderColor: tokens.border }]}>
      <View style={[styles.iconWrapper, { backgroundColor: item.highlightColor }]}>
        <MaterialIcons name={item.icon as never} size={24} color="#FFFFFF" />
      </View>
      <ThemedText style={styles.name} numberOfLines={1}>{item.name}</ThemedText>
      <TouchableOpacity onPress={onEdit} style={styles.action} hitSlop={8}>
        <MaterialIcons name="edit" size={20} color={tokens.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.action} hitSlop={8}>
        <MaterialIcons name="delete" size={20} color={tokens.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { flex: 1, fontSize: 15 },
  action: { padding: 4 },
});
