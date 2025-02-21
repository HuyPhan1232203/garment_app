import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useRouter } from "expo-router";

const QCRole = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(20);
  const total = 1000;
  const current = 500;
  const options = [5, 10, 15, 20, 25, 30];

  return (
    <View style={styles.container}>
      <Header text="QCRole" />
      <View style={styles.body}>
        {/* Tổng số lượng */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            {/* <Ionicons name="calculator-outline" size={24} color="black" /> */}
            Tổng số lượng: {current}/{total}
          </Text>
        </View>

        {/* Hiển thị số lượng đã chọn */}
        <View style={styles.quantityBox}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </View>
        {/* Nút Đặt lại & Xác nhận */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={() => setQuantity(0)}
          >
            <Text style={styles.buttonText}>🔄 Đặt lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]}>
            <Text style={styles.buttonText}>✅ Xác nhận</Text>
          </TouchableOpacity>
        </View>

        {/* Ô nhập số lượng */}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nhập số lượng"
          value={
            quantity === 0 ? <Text>Nhập số lượng</Text> : quantity.toString()
          }
          onChangeText={(text) => setQuantity(Number(text) || 0)}
        />

        {/* Các nút chọn nhanh */}
        <View style={styles.optionsContainer}>
          {options.map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.optionButton}
              onPress={() => setQuantity(num)}
            >
              <Text style={styles.optionText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  body: {
    width: "100%",
    height: "auto",
    padding: 20,
    justifyContent: "center",
  },
  totalContainer: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#87CEFA",
    borderRadius: 10,
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 18,
    color: "#333",
  },
  quantityValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    marginVertical: 5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: "#4CAF50",
  },
  confirmButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QCRole;
