import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";

const detailed_QAQC = () => {
  return (
    <View style={defaultStyles.container}>
      <Header text="W3- KT Áo" />
      <View style={{ flexDirection: "column", alignItems: "center", flex: 1 }}>
        {/* quantity */}
        <View style={styles.quantityTextContainer}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="calculator-outline" size={24} color="black" />
            <Text style={styles.quantityText}>Tổng số lượng:</Text>
          </View>
          <Text style={styles.quantityText}>50</Text>
        </View>
        {/* detail quantity  */}
        <View style={styles.detailQuantContainer}>
          <View style={styles.detailQuant}>
            <Text style={defaultStyles.text}>Số lượng đạt</Text>
            <Text
              style={[
                defaultStyles.text,
                { color: "#18611E", fontWeight: 600, paddingTop: 15 },
              ]}
            >
              36
            </Text>
          </View>
          <View style={styles.detailQuant}>
            <Text style={defaultStyles.text}>Số lượng lỗi</Text>
            <Text
              style={[
                defaultStyles.text,
                { color: "#FF0000", fontWeight: 600, paddingTop: 15 },
              ]}
            >
              14
            </Text>
          </View>
        </View>
        {/* feature */}
        <View style={styles.featureContainer}>
          <TouchableOpacity style={styles.feature}>
            <Feather name="trash" size={24} color="#fff" />
            <Text
              style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}
            >
              Xoá lỗi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature, { backgroundColor: "#1C9D1F" }]}
          >
            <FontAwesome5 name="flag" size={24} color="#fff" />
            <Text
              style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}
            >
              Báo cáo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature, { backgroundColor: "#2589FF" }]}
          >
            <AntDesign name="plus" size={24} color="#fff" />
            <Text
              style={{ ...defaultStyles.text, color: "#fff", paddingLeft: 10 }}
            >
              Thêm lỗi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature, { backgroundColor: "#8979FF" }]}
          >
            <Text style={{ ...defaultStyles.text, color: "#fff" }}>
              Nhập SL đạt
            </Text>
          </TouchableOpacity>
        </View>
        {/* Choose number */}
        <View style={styles.allnumberContainer}>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.numberContainer}>00</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default detailed_QAQC;

const styles = StyleSheet.create({
  quantityText: {
    ...defaultStyles.text,
    fontWeight: 500,
  },
  quantityTextContainer: {
    marginVertical: 30,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 18,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 319,
    alignItems: "center",
  },
  detailQuantContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#009DFF80",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 319,
  },
  detailQuant: {
    ...defaultStyles.text,
    flexDirection: "column",
    alignItems: "center",
  },
  feature: {
    flexDirection: "row",
    backgroundColor: "#FF111191",
    alignItems: "center",
    width: 143,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  featureContainer: {
    width: 319,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  numberContainer: {
    fontSize: 16,
    fontWeight: 500,
    paddingVertical: 28,
    paddingHorizontal: 25,
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
  allnumberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 319,
    gap: 12,
    marginTop: 30,
  },
});
