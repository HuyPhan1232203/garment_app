import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { defaultStyles } from "@/styles/default";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <View style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="department"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </View>
  );
};

export default _layout;

const styles = StyleSheet.create({});
