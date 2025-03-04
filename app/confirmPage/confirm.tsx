import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";
import Input from "@/components/Input";
import axios from "axios";
import Toast from "react-native-toast-message";
import { formatDateToString } from "@/helper/validateDate";
const confirm = () => {
  const name = useSelector((store) => store.task.name);
  const id = useSelector((store) => store.task.id);
  const code = useSelector((store) => store.task.code);
  const param = useLocalSearchParams();
  const target = useSelector((store) => store.task.target);
  const [inputValue, setInputValue] = useState(0);
  const idTaskDetail = useSelector((store) => store.taskDetail.id);
  const codeTaskDetail = useSelector((store) => store.taskDetail.code);
  const nameTaskDetail = useSelector((store) => store.taskDetail.name);
  const dateStartTaskDetail = useSelector(
    (store) => store.taskDetail.dateStart
  );
  const dateEndTaskDetail = useSelector((store) => store.taskDetail.dateEnd);
  const operationIdTaskDetail = useSelector(
    (store) => store.taskDetail.operationId
  );
  const taskProductIdTaskDetail = useSelector(
    (store) => store.taskDetail.taskProductId
  );
  const handleRefresh = () => {
    setInputValue(0);
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
  }, []);
  const handleConfirm = async () => {
    console.log({
      code: `${codeTaskDetail}`,
      name: `${nameTaskDetail}`,
      quantity: inputValue,
      dateStart: `${formatDateToString(dateStartTaskDetail)}`,
      dateEnd: `${formatDateToString(dateEndTaskDetail)}`,
      operationId: `${operationIdTaskDetail}`,
      taskProductId: `${taskProductIdTaskDetail}`,
    });
    console.log(idTaskDetail);
    try {
      await axios.put(
        `https://api-xuongmay-dev.lighttail.com/api/taskdetail/${idTaskDetail}`,
        {
          code: `${codeTaskDetail}`,
          name: `${nameTaskDetail}`,
          quantity: inputValue,
          dateStart: `${formatDateToString(dateStartTaskDetail)}`,
          dateEnd: `${formatDateToString(dateEndTaskDetail)}`,
          operationId: `${operationIdTaskDetail}`,
          taskProductId: `${taskProductIdTaskDetail}`,
        }
      );
      setInputValue(0);
      Toast.show({
        type: "success",
        text1: "Updated Successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "updated error",
      });
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
        <View>
          <View style={styles.quantityContainer}>
            <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
              Số lượng:
            </Text>
            <Text style={{ fontSize: 36, fontWeight: 500 }}>{inputValue}</Text>
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
            name="Nhập số lượng"
            onChangeText={setInputValue}
            value={inputValue}
            type="number"
          />
        </View>
        {/*  */}
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
                setInputValue(Number(inputValue) - 1);
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
            onPress={() => setInputValue(Number(inputValue) + 1)}
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
  confirm: {
    flexDirection: "row",
    backgroundColor: "#2589FF",
    padding: 10,
    width: 131,
    justifyContent: "space-around",
    borderRadius: 10,
  },
});

export default confirm;
