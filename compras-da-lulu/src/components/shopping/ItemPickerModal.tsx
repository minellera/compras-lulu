import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { ThemedText } from '@/components/common/ThemedText';
import { PurchaseItemForm } from '@/components/catalog/PurchaseItemForm';
import type { PurchaseItem } from '@/types';

interface ItemPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: PurchaseItem) => void;
  excludeIds?: string[];
}

export function ItemPickerModal({ visible, onClose, onSelect, excludeIds = [] }: ItemPickerModalProps) {
  const { tokens, fontFamily } = useTheme();
  const { items, add } = useCatalogStore();
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const sorted = [...items]
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    .filter((i) => !query.trim() || i.name.toLowerCase().includes(query.trim().toLowerCase()));

  async function handleNewItem(data: Omit<PurchaseItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const created = await add(data);
    setShowForm(false);
    onSelect(created);
    onClose();
  }

  function handleSelect(item: PurchaseItem) {
    onSelect(item);
    onClose();
  }

  const isExcluded = (id: string) => excludeIds.includes(id);

  return (
    <>
      {/* Picker modal */}
      <Modal
        visible={visible && !showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={[styles.container, { backgroundColor: tokens.background }]}>
          <View style={styles.header}>
            <ThemedText variant="title">Selecionar Item</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={tokens.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar item..."
            placeholderTextColor={tokens.textMuted}
            style={[
              styles.search,
              {
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
                color: tokens.text,
                fontFamily,
              },
            ]}
          />

          <FlatList
            data={sorted}
            keyExtractor={(i) => i.id}
            ListHeaderComponent={
              <TouchableOpacity
                style={[styles.newItemRow, { borderBottomColor: tokens.border }]}
                onPress={() => setShowForm(true)}
              >
                <View style={[styles.newItemIcon, { backgroundColor: tokens.primary }]}>
                  <MaterialIcons name="add" size={20} color={tokens.primaryText} />
                </View>
                <ThemedText style={{ color: tokens.primary, fontWeight: '600' }}>
                  Adicionar Novo Item
                </ThemedText>
              </TouchableOpacity>
            }
            renderItem={({ item }) => {
              const excluded = isExcluded(item.id);
              return (
                <TouchableOpacity
                  onPress={() => !excluded && handleSelect(item)}
                  style={[
                    styles.row,
                    { borderBottomColor: tokens.border },
                    excluded && styles.rowDisabled,
                  ]}
                  activeOpacity={excluded ? 1 : 0.6}
                >
                  <View style={[styles.iconWrap, { backgroundColor: item.highlightColor }]}>
                    <MaterialIcons name={item.icon as never} size={22} color="#FFF" />
                  </View>
                  <ThemedText style={[styles.itemName, excluded && { color: tokens.textMuted }]}>
                    {item.name}
                  </ThemedText>
                  {excluded && (
                    <ThemedText variant="muted" style={styles.alreadyAdded}>já adicionado</ThemedText>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <ThemedText variant="muted">Nenhum item encontrado.</ThemedText>
              </View>
            }
          />
        </View>
      </Modal>

      {/* New item form modal — rendered at same level to avoid Android nesting issues */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={[styles.container, { backgroundColor: tokens.background }]}>
          <View style={styles.header}>
            <ThemedText variant="title">Novo Item</ThemedText>
          </View>
          <PurchaseItemForm
            onSubmit={handleNewItem}
            onCancel={() => setShowForm(false)}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  search: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  newItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  newItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowDisabled: { opacity: 0.5 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { flex: 1, fontSize: 15 },
  alreadyAdded: { fontSize: 12, fontStyle: 'italic' },
  empty: { padding: 24, alignItems: 'center' },
});
