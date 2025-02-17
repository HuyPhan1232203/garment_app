import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <RootNavigation />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
const RootNavigation = () => (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="departmentPage" options={{ headerShown: false }} />
  </Stack>
);
