import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {
  console.log("Root layout rendered");
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
