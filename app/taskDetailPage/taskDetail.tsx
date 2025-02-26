import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/styles/default";
import axios from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Header } from "@/components/Header";

const taskDetail = () => {
  const [data, setdata] = useState([]);
  const param = useLocalSearchParams();
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://api-xuongmay-dev.lighttail.com/api/taskdetail?pageIndex=1&pageSize=10&searchByTaskProductId=${param.id}`
      );
      setdata(res.data.data.items);
    } catch {
      console.error("fetch error ");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={defaultStyles.container}>
      <Header text={`${param.code}-${param.name}`} isChild={true} />
      <View>
        <FlatList
          data={data}
          key={data.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item?.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default taskDetail;

const styles = StyleSheet.create({});
