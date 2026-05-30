import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '@/components/common/Screen';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedButton } from '@/components/common/ThemedButton';
import { ItemPickerModal } from '@/components/shopping/ItemPickerModal';
import { useShoppingStore } from '@/stores/useShoppingStore';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { useTheme } from '@/theme/ThemeProvider';
import { newId } from '@/utils/uuid';
import type { PurchaseItem, QuantityType } from '@/types';

interface EditItem {
  id: string;
  purchaseItem: PurchaseItem;
  quantity: string;
  quantityType: QuantityType;
  quantityError: string;
}

const QTY_TYPES: { value: QuantityType; label: string }[] = [
  { value: 'unit', label: 'Un.' },
  { value: 'weight', label: 'kg' },
  { value: 'volume', label: 'L' },
];

export default function ShoppingListEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { tokens, fontFamily } = useTheme();
  const { lists, create, update } = useShoppingStore();
  const { load: loadCatalog } = useCatalogStore();

  const existing = id ? lists.find((l) => l.id === id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [titleError, setTitleError] = useState('');
  const [editItems, setEditItems] = useState<EditItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      await loadCatalog();
      if (!id) return;
      const existingList = useShoppingStore.getState().lists.find((l) => l.id === id);
      if (!existingList) return;
      const catItems = useCatalogStore.getState().items;
      const mapped: EditItem[] = existingList.items.flatMap((it) => {
        const pi = catItems.find((c) => c.id === it.purchaseItemId);
        if (!pi) return [];
        return [{
          id: it.id,
          purchaseItem: pi,
          quantity: String(it.quantity),
          quantityType: it.quantityType,
          quantityError: '',
        }];
      });
      setEditItems(mapped);
    }
    void init();
  }, [id, loadCatalog]);

  function addItem(pi: PurchaseItem) {
    if (editItems.some((i) => i.purchaseItem.id === pi.id)) return;
    setEditItems((prev) => [
      ...prev,
      { id: newId(), purchaseItem: pi, quantity: '1', quantityType: 'unit', quantityError: '' },
    ]);
  }

  function removeItem(id: string) {
    setEditItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: string, value: string) {
    setEditItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: value, quantityError: '' } : i)),
    );
  }

  function updateQtyType(id: string, qtyType: QuantityType) {
    setEditItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantityType: qtyType, quantityError: '' } : i)),
    );
  }

  function validateItems(): boolean {
    let valid = true;
    setEditItems((prev) =>
      prev.map((i) => {
        const num = parseFloat(i.quantity);
        let quantityError = '';
        if (!i.quantity.trim() || isNaN(num) || num <= 0) {
          quantityError = 'Quantidade deve ser > 0.';
          valid = false;
        } else if (i.quantityType === 'unit' && !Number.isInteger(num)) {
          quantityError = 'Un. deve ser inteiro.';
          valid = false;
        }
        return { ...i, quantityError };
      }),
    );
    return valid;
  }

  async function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Título é obrigatório.');
      return;
    }
    if (!validateItems()) return;

    setSaving(true);
    try {
      const items = editItems.map((i) => ({
        id: i.id,
        purchaseItemId: i.purchaseItem.id,
        quantity: parseFloat(i.quantity),
        quantityType: i.quantityType,
        inCart: false,
      }));

      if (existing) {
        await update(existing.id, { title: trimmedTitle, description, items });
      } else {
        await create({
          title: trimmedTitle,
          description,
          status: 'open',
          totalValue: null,
          completedAt: null,
          items,
        });
      }
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a lista.');
    } finally {
      setSaving(false);
    }
  }

  const excludeIds = editItems.map((i) => i.purchaseItem.id);

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText variant="muted" style={styles.label}>Título *</ThemedText>
        <TextInput
          value={title}
          onChangeText={(v) => { setTitle(v); setTitleError(''); }}
          placeholder="Ex.: Supermercado semanal"
          placeholderTextColor={tokens.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: tokens.surface,
              borderColor: titleError ? tokens.danger : tokens.border,
              color: tokens.text,
              fontFamily,
            },
          ]}
          maxLength={80}
        />
        {!!titleError && (
          <ThemedText style={[styles.fieldError, { color: tokens.danger }]}>{titleError}</ThemedText>
        )}

        <ThemedText variant="muted" style={[styles.label, styles.gap]}>Descrição</ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Opcional"
          placeholderTextColor={tokens.textMuted}
          multiline
          style={[
            styles.input,
            styles.multiline,
            {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
              color: tokens.text,
              fontFamily,
            },
          ]}
          maxLength={200}
        />

        <View style={[styles.itemsHeader, styles.gap]}>
          <ThemedText variant="muted">Itens ({editItems.length})</ThemedText>
          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            style={[styles.addItemBtn, { backgroundColor: tokens.primary }]}
          >
            <MaterialIcons name="add" size={16} color={tokens.primaryText} />
            <ThemedText style={[styles.addItemLabel, { color: tokens.primaryText }]}>
              Adicionar item
            </ThemedText>
          </TouchableOpacity>
        </View>

        {editItems.length === 0 && (
          <ThemedText variant="muted" style={styles.emptyItems}>
            Nenhum item adicionado ainda.
          </ThemedText>
        )}

        {editItems.map((item) => (
          <View
            key={item.id}
            style={[styles.itemRow, { backgroundColor: tokens.surface, borderColor: tokens.border }]}
          >
            <View style={[styles.itemIcon, { backgroundColor: item.purchaseItem.highlightColor }]}>
              <MaterialIcons name={item.purchaseItem.icon as never} size={18} color="#FFF" />
            </View>
            <ThemedText style={styles.itemName} numberOfLines={1}>
              {item.purchaseItem.name}
            </ThemedText>
            <View style={styles.qtySection}>
              <TextInput
                value={item.quantity}
                onChangeText={(v) => updateQty(item.id, v)}
                keyboardType="decimal-pad"
                style={[
                  styles.qtyInput,
                  {
                    backgroundColor: tokens.background,
                    borderColor: item.quantityError ? tokens.danger : tokens.border,
                    color: tokens.text,
                    fontFamily,
                  },
                ]}
              />
              <View style={styles.typeSelector}>
                {QTY_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => updateQtyType(item.id, t.value)}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor:
                          item.quantityType === t.value ? tokens.primary : tokens.background,
                        borderColor: tokens.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.typeBtnLabel,
                        {
                          color: item.quantityType === t.value ? tokens.primaryText : tokens.text,
                          fontFamily,
                        },
                      ]}
                    >
                      {t.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={8}>
                <MaterialIcons name="delete-outline" size={20} color={tokens.danger} />
              </TouchableOpacity>
            </View>
            {!!item.quantityError && (
              <ThemedText style={[styles.itemError, { color: tokens.danger }]}>
                {item.quantityError}
              </ThemedText>
            )}
          </View>
        ))}

        <ThemedButton
          label={existing ? 'Salvar alterações' : 'Criar lista'}
          onPress={handleSave}
          loading={saving}
          style={[styles.saveBtn, styles.gap]}
        />
      </ScrollView>

      <ItemPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addItem}
        excludeIds={excludeIds}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, marginBottom: 6 },
  gap: { marginTop: 16 },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  multiline: { height: 72, paddingTop: 10, textAlignVertical: 'top' },
  fieldError: { fontSize: 12, marginTop: 4 },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addItemLabel: { fontSize: 13, fontWeight: '600' },
  emptyItems: { textAlign: 'center', paddingVertical: 16, fontStyle: 'italic' },
  itemRow: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    gap: 6,
  },
  itemIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: { marginLeft: 42, fontSize: 14, fontWeight: '500', marginBottom: 2 },
  qtySection: {
    marginLeft: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyInput: {
    width: 60,
    height: 34,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  typeSelector: { flexDirection: 'row', gap: 4, flex: 1 },
  typeBtn: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBtnLabel: { fontSize: 12, fontWeight: '600' },
  itemError: { marginLeft: 42, fontSize: 11 },
  saveBtn: { marginTop: 8 },
});
