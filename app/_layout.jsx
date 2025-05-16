import { Lato_400Regular, Lato_700Bold, useFonts } from '@expo-google-fonts/lato';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageProvider } from '../Context/ImageProvider';

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    Lato_700Bold,
    Lato_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ImageProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ImageProvider>
    </GestureHandlerRootView>
  );
}
