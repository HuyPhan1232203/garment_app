import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "@/components/Header";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { defaultStyles } from "@/styles/default";
import Paging from "@/components/Paging";
import NoData from "@/components/NoData";
import { useDispatch } from "react-redux";
import { storeTask } from "@/slices/taskSlice";

const Task = () => {
  const param = useLocalSearchParams();
  const [task, setTask] = useState([]);
  const [loading, setloading] = useState(false);
  const [pages, setpages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const fetchTask = async () => {
    try {
      setloading(true);
      const res = await axios.get(
        `https://api-xuongmay-dev.lighttail.com/api/taskproduct?pageIndex=1&pageSize=100&searchByDepartmentId=${param.id}`
      );
      setTask(res.data.data.items);
      console.log(res.data.data.totalPages);
      setpages(res.data.data.totalPages);
    } catch {
      console.error("fetch task error");
    } finally {
      setloading(false);
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
    if (pageIndex == pages) return;
    setPageIndex(pageIndex + 1);
  };
  const dispatch = useDispatch();
  return (
    <View style={defaultStyles.container}>
      <Header text={`Sản xuất - ${param.name}`} isChild={true} />
      <View style={{ paddingVertical: 30, alignItems: "center" }}>
        <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
          Danh sách công việc
        </Text>
      </View>
      {loading ? (
        <View
          style={{
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            height: "80%",
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
                    dispatch(storeTask(item));
                    router.push({
                      pathname: "/taskDetailPage/taskDetail",
                      params: {
                        id: item.id,
                        code: item?.code,
                        name: item?.name,
                      },
                    });
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
        </View>
      )}
    </View>
  );
};
export default Task;
const styles = StyleSheet.create({});
