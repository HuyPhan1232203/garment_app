import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BlankPage from "@/components/BlankPage";
import { useRouter } from "expo-router";

const Task = () => {
  const router = useRouter();
  return (
    <View>
      <BlankPage headerTitle="Sản xuất - Tổ" />
      <TouchableOpacity onPress={() => router.navigate("/QCPage/QCRole")}>
        <Text>Chuyển trang</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({});