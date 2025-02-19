import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import { colors } from "@/constraints/token";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

type inputProps = {
  name: string;
  type: "password" | "text";
  value: string;
  onChangeText: (text: string) => void;
};

const Input = ({ name, type, value, onChangeText }: inputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isPassword = type === "password";

  return (
    <View style={styles.border}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={name}
          value={value}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor={colors.textMuted}
          onChangeText={onChangeText}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
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
    shadowRadius: 4.65, // Added for iOS
    elevation: 7, // Added for Android
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 312,
    height: 48,
    paddingLeft: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    height: 48,
    justifyContent: "center",
  },
});