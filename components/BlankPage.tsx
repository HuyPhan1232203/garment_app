import {
  ActivityIndicator,
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
import NoData from "./NoData";
import Toast from "react-native-toast-message";
type PageProps = {
  api?: string;
  headerTitle: string;
  nextPath: string;
};
const BlankPage = ({ api, headerTitle, nextPath }: PageProps) => {
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pages, setpages] = useState(0);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (!api) return;
    const fetchData = async () => {
      try {
        setloading(true);
        const res = await axios.get(`${api}?pageIndex=1&pageSize=100`);
        setData(res.data.data.items);
        setpages(res.data.data.totalPages);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setloading(false);
      }
    };
    fetchData();
  }, [api, pageIndex]);
  const handlePrev = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };
  const handleNext = () => {
    if (data.length === 0) return;
    if (pageIndex == pages) return;
    setPageIndex(pageIndex + 1);
  };

  const handlePress = (name, id) => {
    router.push({
      pathname: nextPath,
      params: { name: name, id: id },
    });
  };
  return (
    <View>
      <Header text={headerTitle} />
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
            flexDirection: "column",
            alignItems: "center",
            height: "90.5%",
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
                    paddingVertical: 20,
                  }}
                  onPress={() => handlePress(item?.name, item.id)}
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
        </View>
      )}
    </View>
  );
};

export default BlankPage;

const styles = StyleSheet.create({});
