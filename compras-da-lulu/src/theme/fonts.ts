import {
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  Lato_400Regular,
  Lato_700Bold,
} from '@expo-google-fonts/lato';
import type { FontName } from '@/types';

export const fontAssets = {
  Inter_400Regular,
  Inter_700Bold,
  Roboto_400Regular,
  Roboto_700Bold,
  Poppins_400Regular,
  Poppins_700Bold,
  Nunito_400Regular,
  Nunito_700Bold,
  Lato_400Regular,
  Lato_700Bold,
};

export const fontFamilyMap: Record<FontName, string> = {
  Inter: 'Inter_400Regular',
  Roboto: 'Roboto_400Regular',
  Poppins: 'Poppins_400Regular',
  Nunito: 'Nunito_400Regular',
  Lato: 'Lato_400Regular',
};
