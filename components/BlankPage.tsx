import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "./Header";
import { router } from "expo-router";
import { defaultStyles } from "@/styles/default";

type PageProps = {
  api?: string;
  headerTitle: string;
};

const BlankPage = ({ api, headerTitle }: PageProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!api) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(api);
        setData(res.data.data.items);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [api]);

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
              <Text style={{ fontSize: 20 }}>Tổng SL: {item?.numOfStaff}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default BlankPage;

const styles = StyleSheet.create({});
