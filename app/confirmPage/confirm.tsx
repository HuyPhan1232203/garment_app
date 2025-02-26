import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";

const confirm = () => {
  const name = useSelector((store) => store.task.name);
  const code = useSelector((store) => store.task.code);
  const param = useLocalSearchParams();
  const finished = useSelector((store) => store.taskDetail.quantity);
  const target = useSelector((store) => store.task.target);
  const data = useRef(0);
  return (
    <View style={defaultStyles.container}>
      <Header text={`${code}-${name}-${param.task}`} isChild={true} />
      <View style={{ alignItems: "center" }}>
        {/*  */}
        <View style={styles.sumQuantity}>
          <View style={{ flexDirection: "row" }}>
            <Entypo name="calculator" size={24} color="black" />
            <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
              Tổng số lượng:
            </Text>
          </View>
          <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
            {finished}/{target}
          </Text>
        </View>

        {/*  */}
        <View>
          <View style={styles.quantityContainer}>
            <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
              Số lượng:
            </Text>
            <Text style={{ fontSize: 36, fontWeight: 500 }}>20</Text>
          </View>
        </View>
        {/*  */}
        <View>
          <View style={styles.refresh}>
            <Entypo name="cw" size={24} color={colors.icon} />
            <Text style={{ ...defaultStyles.text, color: "#fff" }}>
              Đặt lại
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sumQuantity: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    width: 319,
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "space-around",
  },
  quantityContainer: {
    width: 319,
    height: 96,
    ...defaultStyles.modal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  refresh: {
    flexDirection: "row",
    backgroundColor: "#1C9D1F",
    padding: 10,
    width: 131,
    justifyContent: "space-around",
    borderRadius: 10,
  },
});

export default confirm;
