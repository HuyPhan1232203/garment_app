import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/components/Header";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { defaultStyles } from "@/styles/default";
import Paging from "@/components/Paging";
import NoData from "@/components/NoData";

const Task = () => {
  const param = useLocalSearchParams();
  const [task, setTask] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const fetchTask = async () => {
    console.log(param);
    try {
      const res = await axios.get(
        `https://api-xuongmay-dev.lighttail.com/api/taskproduct?pageIndex=${pageIndex}&pageSize=10&searchByDepartmentId=${param.id}`
      );
      setTask(res.data.data.items);
    } catch {
      console.log("fetch task error");
    }
  };
  useEffect(() => {
    fetchTask();
  }, [pageIndex]);
  const handlePrev = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };
  const handleNext = () => {
    if (task.length === 0) return;
    setPageIndex(pageIndex + 1);
  };
  return (
    <View style={defaultStyles.container}>
      <Header text={`Sản xuất - ${param.name}`} />
      <View
        style={{
          alignItems: "center",
          height: "90%",
        }}
      >
        {task.length !== 0 ? (
          <FlatList
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
        ) : (
          <NoData />
        )}
        <Paging
          data={task}
          onNext={handleNext}
          onPrev={handlePrev}
          pageIndex={pageIndex}
        />
      </View>
    </View>
  );
};
export default Task;
const styles = StyleSheet.create({});
