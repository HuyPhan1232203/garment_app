import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Header } from "./Header";
import { router } from "expo-router";
import { defaultStyles } from "@/styles/default";
import { colors } from "@/constraints/token";
import Paging from "./Paging";
import NoData from "./NoData";
type PageProps = {
  api?: string;
  headerTitle: string;
};
const BlankPage = ({ api, headerTitle }: PageProps) => {
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  useEffect(() => {
    if (!api) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${api}?pageIndex=${pageIndex}&pageSize=10`
        );
        setData(res.data.data.items);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [api, pageIndex]);
  const handlePrev = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };
  const handleNext = () => {
    if (data.length === 0) return;
    setPageIndex(pageIndex + 1);
  };
  return (
    <View>
      <Header text={headerTitle} />
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          height: "90%",
        }}
      >
        {data.length !== 0 ? (
          <FlatList
            data={data}
            key={data.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  ...defaultStyles.modal,
                  paddingHorizontal: 80,
                  paddingVertical: 20,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/taskPage/task",
                    params: { name: item?.name },
                  });
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 32,
                    fontWeight: 500,
                  }}
                >
                  {item?.code} - {item?.name}
                </Text>
                <Text style={{ fontSize: 20 }}>
                  Tổng SL: {item?.numOfStaff}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <NoData />
        )}
        <Paging
          data={data}
          onPrev={handlePrev}
          onNext={handleNext}
          pageIndex={pageIndex}
        />
      </View>
    </View>
  );
};

export default BlankPage;

const styles = StyleSheet.create({});
