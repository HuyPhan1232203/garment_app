import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "../store/store";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar hidden></StatusBar>
        <GestureHandlerRootView>
          <RootNavigation />
        </GestureHandlerRootView>
      </SafeAreaProvider>
      <Toast />
    </Provider>
  );
}

const RootNavigation = () => (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="departmentPage" options={{ headerShown: false }} />
    <Stack.Screen name="taskPage" options={{ headerShown: false }} />
    <Stack.Screen name="QADepartmentPage" options={{ headerShown: false }} />
    <Stack.Screen name="confirmPage" options={{ headerShown: false }} />
    <Stack.Screen name="detailed_QAQCPage" options={{ headerShown: false }} />
    <Stack.Screen name="taskDetailPage" options={{ headerShown: false }} />
    <Stack.Screen name="QA_Task" options={{ headerShown: false }} />
  </Stack>
);
