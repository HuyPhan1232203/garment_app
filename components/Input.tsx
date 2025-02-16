import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constraints/token";
import { TextInput } from "react-native-gesture-handler";
type inputProps = {
  name: string;
  type: "password" | "text";
};
const Input = ({ name, type }: inputProps) => {
  let password = false;
  if (type === "password") {
    password = true;
  }
  return (
    <View style={styles.border}>
      <View>
        <TextInput
          style={styles.input}
          placeholder={name}
          secureTextEntry={password}
          placeholderTextColor={colors.textMuted}
        ></TextInput>
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  border: {
    marginTop: 30,
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },
  input: {
    width: 312,
    height: 48,
    paddingLeft: 16,
  },
});
