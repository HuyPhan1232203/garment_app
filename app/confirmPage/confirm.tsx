import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";
import Input from "@/components/Input";
import axios from "axios";

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
    // console.log(
    //   "code" + `${codeTaskDetail}`,
    //   "name" + `${nameTaskDetail}`,
    //   "quantity" + quantityTaskDetail,
    //   "operationId" + `${operationIdTaskDetail}`,
    //   "taskProductId" + `${taskProductIdTaskDetail}`
    // );
    try {
      const respone = await axios.put(
        `https://api-xuongmay-dev.lighttail.com/api/taskdetail/${idTaskDetail}`,
        {
          code: `${codeTaskDetail}`,
          name: `${nameTaskDetail}`,
          quantity: inputValue,
          operationId: `${operationIdTaskDetail}`,
          taskProductId: `${taskProductIdTaskDetail}`,
        }
      );
    } catch {
      console.error("put err");
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
        <View style={styles.allNumberContainer}>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => {
              setInputValue(5);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => {
              setInputValue(10);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => {
              setInputValue(15);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>15</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => {
              setInputValue(20);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>25</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => {
              setInputValue(25);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>25</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberContainer}
            onPress={() => {
              setInputValue(30);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>30</Text>
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
  numberContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
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
  allNumberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    justifyContent: "center",
    marginTop: 50,
  },
});

export default confirm;
