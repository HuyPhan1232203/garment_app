import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import BlankPage from "@/components/BlankPage";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/components/Header";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";

const Task = () => {
  const param = useLocalSearchParams();
  const [task, setTask] = useState([]);
  const fetchTask = async () => {
    try {
      const res = await axios.get(
        "https://67b8b3ac699a8a7baef4fde6.mockapi.io/task"
      );
      setTask(res.data);
    } catch {
      console.log("fetch task error");
    }
  };
  useEffect(() => {
    fetchTask();
  }, []);
  return (
    <View>
      <Header text={`Sản xuất - ${param.name}`} />
      <View style={{ alignItems: "center", backgroundColor: colors.backgound }}>
        <FlatList
          contentContainerStyle={{
            paddingBottom: 200,
          }}
          data={task}
          key={task.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                ...defaultStyles.modal,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={() => {
                router.navigate("/QCPage/QCRole");
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: 500, paddingBottom: 10 }}
              >
                {item?.code} - {item?.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ paddingHorizontal: 30 }}>
                  <Text style={{ fontSize: 16, paddingBottom: 5 }}>
                    CC: {item?.cc}
                  </Text>
                  <Text style={{ fontSize: 16, paddingBottom: 5 }}>
                    Model: {item?.model}
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 30 }}>
                  <Text style={{ fontSize: 16, paddingBottom: 5 }}>
                    Mục tiêu: {item?.target}
                  </Text>
                  <Text style={{ fontSize: 16, paddingBottom: 5 }}>
                    Hoàn thành: {item?.done}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};
export default Task;
const styles = StyleSheet.create({});
