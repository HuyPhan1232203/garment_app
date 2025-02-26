import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { defaultStyles } from "@/styles/default";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const _layout = () => {
  return (
    <SafeAreaView style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="QATask"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </SafeAreaView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
