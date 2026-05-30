import { useEffect } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedButton } from '@/components/common/ThemedButton';
import { ShoppingListCard } from '@/components/shopping/ShoppingListCard';
import { useShoppingStore } from '@/stores/useShoppingStore';
import { useTheme } from '@/theme/ThemeProvider';
import type { ShoppingList } from '@/types';

export default function ShoppingListsScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { lists, load } = useShoppingStore();

  useEffect(() => {
    load();
  }, [load]);

  const byUpdatedDesc = (a: ShoppingList, b: ShoppingList) =>
    b.updatedAt.localeCompare(a.updatedAt);

  const open = lists.filter((l) => l.status === 'open').sort(byUpdatedDesc);
  const completed = lists.filter((l) => l.status === 'completed').sort(byUpdatedDesc);

  const sections = [
    ...(open.length > 0 ? [{ title: 'Abertas', data: open }] : []),
    ...(completed.length > 0 ? [{ title: 'Concluídas', data: completed }] : []),
  ];

  return (
    <Screen noPadding>
      <View style={styles.headerBar}>
        <ThemedText variant="title" style={styles.screenTitle}>Listas de Compras</ThemedText>
        <ThemedButton
          label="+ Criar nova lista"
          onPress={() => router.push('/shopping-lists/edit')}
          style={styles.createBtn}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.emptyContainer,
        ]}
        renderSectionHeader={({ section }) => (
          <ThemedText
            variant="muted"
            style={[styles.sectionHeader, { backgroundColor: tokens.background }]}
          >
            {section.title}
          </ThemedText>
        )}
        renderItem={({ item }) => (
          <ShoppingListCard
            list={item}
            onPress={() => router.push(`/shopping-lists/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText variant="muted" style={styles.emptyText}>
              Nenhuma lista criada ainda.{'\n'}Toque em &quot;+ Criar nova lista&quot; para começar.
            </ThemedText>
          </View>
        }
        stickySectionHeadersEnabled
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  screenTitle: { flex: 1 },
  createBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: 8,
  },
  empty: { alignItems: 'center', paddingTop: 32 },
  emptyText: { textAlign: 'center', lineHeight: 26 },
});
