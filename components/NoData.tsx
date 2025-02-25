import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";

const NoData = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          ...defaultStyles.text,
          color: colors.textMuted,
          marginTop: 50,
        }}
      >
        No data
      </Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({});
