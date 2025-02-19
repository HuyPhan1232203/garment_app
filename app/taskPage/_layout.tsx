import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { defaultStyles } from '@/styles/default';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <SafeAreaView style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="task"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </SafeAreaView>
  );
};

export default _layout

const styles = StyleSheet.create({})