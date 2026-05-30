import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedButton } from '@/components/common/ThemedButton';
import { ColorPicker } from '@/components/common/ColorPicker';
import { IconPicker } from '@/components/common/IconPicker';
import type { PurchaseItem } from '@/types';

const DEFAULT_COLOR = '#3B82F6';
const DEFAULT_ICON = 'shopping-cart';

interface FormData {
  name: string;
  highlightColor: string;
  icon: string;
}

interface PurchaseItemFormProps {
  initial?: PurchaseItem;
  onSubmit: (data: Omit<PurchaseItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
}

export function PurchaseItemForm({ initial, onSubmit, onCancel }: PurchaseItemFormProps) {
  const { tokens, fontFamily } = useTheme();
  const items = useCatalogStore((s) => s.items);

  const [form, setForm] = useState<FormData>({
    name: initial?.name ?? '',
    highlightColor: initial?.highlightColor ?? DEFAULT_COLOR,
    icon: initial?.icon ?? DEFAULT_ICON,
  });
  const [nameError, setNameError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validateName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return 'Nome é obrigatório.';
    const duplicate = items.find(
      (i) =>
        i.name.trim().toLowerCase() === trimmed.toLowerCase() &&
        i.id !== initial?.id,
    );
    if (duplicate) return 'Já existe um item com este nome.';
    return '';
  }

  async function handleSubmit() {
    const error = validateName(form.name);
    if (error) {
      setNameError(error);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        highlightColor: form.highlightColor,
        icon: form.icon,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText variant="muted" style={styles.label}>Nome</ThemedText>
      <TextInput
        value={form.name}
        onChangeText={(v) => {
          setForm((f) => ({ ...f, name: v }));
          if (nameError) setNameError('');
        }}
        placeholder="Ex.: Leite"
        placeholderTextColor={tokens.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: tokens.surface,
            borderColor: nameError ? tokens.danger : tokens.border,
            color: tokens.text,
            fontFamily,
          },
        ]}
        maxLength={60}
      />
      {!!nameError && (
        <ThemedText style={[styles.error, { color: tokens.danger }]}>{nameError}</ThemedText>
      )}

      <ThemedText variant="muted" style={[styles.label, styles.sectionGap]}>Cor de destaque</ThemedText>
      <ColorPicker
        value={form.highlightColor}
        onChange={(hex) => setForm((f) => ({ ...f, highlightColor: hex }))}
      />

      <ThemedText variant="muted" style={[styles.label, styles.sectionGap]}>Ícone</ThemedText>
      <View style={styles.iconPickerWrapper}>
        <IconPicker
          value={form.icon}
          onChange={(icon) => setForm((f) => ({ ...f, icon }))}
        />
      </View>

      <View style={styles.actions}>
        {onCancel && (
          <ThemedButton
            label="Cancelar"
            onPress={onCancel}
            style={[styles.btn, { backgroundColor: tokens.surface }]}
            disabled={submitting}
          />
        )}
        <ThemedButton
          label={submitting ? '' : initial ? 'Salvar' : 'Adicionar'}
          onPress={handleSubmit}
          loading={submitting}
          style={[styles.btn, onCancel && styles.btnFlex]}
          disabled={submitting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  label: { marginBottom: 6, fontSize: 13 },
  sectionGap: { marginTop: 16 },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  error: { fontSize: 12, marginTop: 4 },
  iconPickerWrapper: { height: 260 },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  btn: { flex: 1 },
  btnFlex: { flex: 2 },
});
