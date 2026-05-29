import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { fontAssets } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{ drawerLabel: 'Dashboard', title: 'Dashboard' }}
          />
          <Drawer.Screen
            name="shopping-lists"
            options={{ drawerLabel: 'Lista de Compras', title: 'Lista de Compras' }}
          />
          <Drawer.Screen
            name="wishlist"
            options={{ drawerLabel: 'Lista de Desejos', title: 'Lista de Desejos' }}
          />
          <Drawer.Screen
            name="catalog"
            options={{ drawerLabel: 'Cadastrar Itens', title: 'Cadastrar Itens' }}
          />
          <Drawer.Screen
            name="data-transfer"
            options={{ drawerLabel: 'Exportar / Importar', title: 'Exportar / Importar' }}
          />
          <Drawer.Screen
            name="settings"
            options={{ drawerLabel: 'Configurações', title: 'Configurações' }}
          />
          <Drawer.Screen name="explore" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
