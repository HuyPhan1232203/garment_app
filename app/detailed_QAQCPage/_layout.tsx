import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { defaultStyles } from "@/styles/default";

const _layout = () => {
  return (
    <SafeAreaView style={defaultStyles.container}>
      <Stack>
        <Stack.Screen name="detailed_QAQC" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
