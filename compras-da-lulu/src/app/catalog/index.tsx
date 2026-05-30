import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { Screen } from '@/components/common/Screen';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedButton } from '@/components/common/ThemedButton';
import { PurchaseItemCard } from '@/components/catalog/PurchaseItemCard';
import { PurchaseItemForm } from '@/components/catalog/PurchaseItemForm';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { purchaseItemRepo } from '@/repositories/purchaseItem.repo';
import { useTheme } from '@/theme/ThemeProvider';
import type { PurchaseItem } from '@/types';

type ModalMode = { type: 'create' } | { type: 'edit'; item: PurchaseItem };

export default function CatalogScreen() {
  const { tokens } = useTheme();
  const { items, load, add, edit, remove } = useCatalogStore();
  const [modal, setModal] = useState<ModalMode | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = [...items].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
  );

  async function handleSubmit(
    data: Omit<PurchaseItem, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    if (modal?.type === 'edit') {
      await edit(modal.item.id, data);
    } else {
      await add(data);
    }
    setModal(null);
  }

  async function handleDelete(item: PurchaseItem) {
    const count = await purchaseItemRepo.countListReferences(item.id);
    if (count > 0) {
      Alert.alert(
        'Item em uso',
        `"${item.name}" está em uso em ${count} lista(s) e não pode ser excluído.`,
        [{ text: 'OK' }],
      );
      return;
    }
    Alert.alert(
      'Excluir item',
      `Deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => remove(item.id),
        },
      ],
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText variant="title">Catálogo de Itens</ThemedText>
        <ThemedButton
          label="+ Adicionar"
          onPress={() => setModal({ type: 'create' })}
          style={styles.addBtn}
        />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PurchaseItemCard
            item={item}
            onEdit={() => setModal({ type: 'edit', item })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText variant="muted" style={styles.emptyText}>
              Nenhum item cadastrado.{'\n'}Toque em &quot;+ Adicionar&quot; para começar.
            </ThemedText>
          </View>
        }
        contentContainerStyle={sorted.length === 0 && styles.emptyContainer}
      />

      <Modal
        visible={!!modal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModal(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: tokens.background }]}>
          <View style={styles.modalHeader}>
            <ThemedText variant="title">
              {modal?.type === 'edit' ? 'Editar Item' : 'Novo Item'}
            </ThemedText>
          </View>
          {!!modal && (
            <PurchaseItemForm
              initial={modal.type === 'edit' ? modal.item : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setModal(null)}
            />
          )}
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingTop: 32 },
  emptyText: { textAlign: 'center', lineHeight: 24 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  modalContainer: { flex: 1 },
  modalHeader: { padding: 16, paddingBottom: 0 },
});
