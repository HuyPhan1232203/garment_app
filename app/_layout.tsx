import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <RootNavigation />
    </GestureHandlerRootView>
  );
}
const RootNavigation = () => (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="departmentPage" options={{ headerShown: false }} />
  </Stack>
);
