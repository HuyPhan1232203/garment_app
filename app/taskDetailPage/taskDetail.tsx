import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/styles/default";
import axios from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Header } from "@/components/Header";
import Paging from "@/components/Paging";
import NoData from "@/components/NoData";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { storeTaskDetail } from "@/slices/taskDetailSlice";

const taskDetail = () => {
  const [data, setdata] = useState([]);
  const param = useLocalSearchParams();
  const [pages, setpages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://api-xuongmay-dev.lighttail.com/api/taskdetail?pageIndex=${pageIndex}&pageSize=10&searchByTaskProductId=${param.id}`
      );
      setdata(res.data.data.items);
      setpages(res.data.data.totalItems);
    } catch {
      console.error("fetch error ");
    }
  };
  useEffect(() => {
    fetchData();
  }, [pageIndex]);
  const handlePrev = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };
  const handleNext = () => {
    if (data.length === 0) return;
    if (pageIndex == pages) return;
    setPageIndex(pageIndex + 1);
  };
  const dispatch = useDispatch();
  return (
    <View style={defaultStyles.container}>
      <Header text={`${param.code}-${param.name}`} isChild={true} />
      <View style={{ paddingVertical: 30, alignItems: "center" }}>
        <Text style={{ ...defaultStyles.text, fontWeight: 500 }}>
          Danh sách công đoạn
        </Text>
      </View>
      <View style={{ height: "80%", alignItems: "center" }}>
        {data.length !== 0 ? (
          <FlatList
            data={data}
            key={data.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  dispatch(storeTaskDetail(item));
                  router.push({
                    pathname: "/confirmPage/confirm",
                    params: { task: item?.code },
                  });
                }}
              >
                <View
                  style={{
                    ...defaultStyles.modal,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    width: 334,
                  }}
                >
                  <Text style={{ fontWeight: 500, fontSize: 36 }}>
                    {item?.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <NoData />
        )}
        <Paging
          pages={pages}
          data={data}
          onNext={handleNext}
          onPrev={handlePrev}
          pageIndex={pageIndex}
        />
      </View>
    </View>
  );
};

export default taskDetail;

const styles = StyleSheet.create({});
