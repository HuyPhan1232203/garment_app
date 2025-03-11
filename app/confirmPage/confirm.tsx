import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";
import Input from "@/components/Input";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTimeRange } from "@/helper/validateDate";
const confirm = () => {
  const name = useSelector((store) => store.task.name);
  const id = useSelector((store) => store.task.id);
  const code = useSelector((store) => store.task.code);
  const param = useLocalSearchParams();
  const target = useSelector((store) => store.task.target);
  const [inputValue, setInputValue] = useState(0);
  const idTaskDetail = useSelector((store) => store.taskDetail.id);
  const handleRefresh = () => {
    updateInputValue(0);
  };
  const startDate = useSelector((store) => store.taskDetail.dateStart);
  const endDate = useSelector((store) => store.taskDetail.dateEnd);
  console.log(startDate);
  // Add these functions to store and retrieve the inputValue
  const storeInputValue = async (value) => {
    try {
      // Create a storage key that's unique to this task
      const storageKey = `inputValue_${idTaskDetail}`;
      await AsyncStorage.setItem(storageKey, value.toString());
      console.log("Input value stored successfully");
    } catch (error) {
      console.error("Error storing input value: ", error);
    }
  };

  const loadInputValue = async () => {
    try {
      const storageKey = `inputValue_${idTaskDetail}`;
      const value = await AsyncStorage.getItem(storageKey);
      if (value !== null) {
        setInputValue(Number(value));
        console.log("Input value loaded:", value);
      }
    } catch (error) {
      console.error("Error loading input value: ", error);
    }
  };
  const [finished, setfinished] = useState(0);
  const fetchFinished = async () => {
    try {
      const res = await axios.get(
        `https://api-xuongmay-dev.lighttail.com/api/taskdetail/totalquantity/${id}`
      );
      setfinished(res.data.data);
    } catch {
      console.error("fetch finish error");
    }
  };
  useEffect(() => {
    fetchFinished();
    loadInputValue();
  }, []);
  const updateInputValue = (value) => {
    const newValue = Number(value);
    setInputValue(newValue);
    storeInputValue(newValue);
  };
  const handleConfirm = async () => {
    try {
      await axios.patch(
        `https://api-xuongmay-dev.lighttail.com/api/taskdetail/addquantity/${idTaskDetail}?quantity=${inputValue}`
      );
      updateInputValue(0);
      alert("Xác nhận thành công");
      // Toast.show({
      //   type: "success",
      //   text1: "Updated Successfully",
      // });
      fetchFinished();
    } catch (error) {
      alert(
        `Đã xảy ra lỗi ${error.message} trong quá trình kiểm trả. VUi lòng thử lại`
      );
      // Toast.show({
      //   type: "error",
      //   text1: "updated error",
      // });
    }
  };
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
        <View style={{ width: "100%" }}>
          <View style={styles.quantityContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
                Số lượng:
              </Text>
              <Text style={{ fontSize: 36, fontWeight: 500 }}>
                {inputValue}
              </Text>
            </View>
            <Text style={{ color: "red", fontWeight: 700, fontSize: 20 }}>
              {formatTimeRange(startDate, endDate)}
            </Text>
          </View>
        </View>
        {/*  */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 319,
          }}
        >
          <TouchableOpacity style={styles.refresh} onPress={handleRefresh}>
            <Entypo name="cw" size={24} color={colors.icon} />
            <Text style={{ ...defaultStyles.text, color: "#fff" }}>
              Đặt lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
            <AntDesign name="check" size={24} color={colors.icon} />
            <Text style={{ ...defaultStyles.text, color: "#fff" }}>
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
        {/*  */}
        <View>
          <Input
            name=""
            onChangeText={updateInputValue}
            value={inputValue.toString()}
            type="number"
          />
        </View>
        {/*  */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => {
              setInputValue(5);
            }}
            style={styles.number}
          >
            <Text>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInputValue(10);
            }}
            style={styles.number}
          >
            <Text>10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInputValue(15);
            }}
            style={styles.number}
          >
            <Text>15</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInputValue(20);
            }}
            style={styles.number}
          >
            <Text>20</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: 319,
            justifyContent: "space-between",
            marginTop: 80,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              width: 130,
              height: 105,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => {
              if (inputValue > 0) {
                updateInputValue(Number(inputValue) - 1);
              }
            }}
          >
            <AntDesign name="minus" size={100} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              width: 130,
              height: 105,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => updateInputValue(Number(inputValue) + 1)}
          >
            <AntDesign name="plus" size={100} color={colors.icon} />
          </TouchableOpacity>
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
    height: 96,
    ...defaultStyles.modal,
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
  confirm: {
    flexDirection: "row",
    backgroundColor: "#2589FF",
    padding: 10,
    width: 131,
    justifyContent: "space-around",
    borderRadius: 10,
  },
  number: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 80,
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
});

export default confirm;
