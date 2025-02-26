import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/styles/default";
import axios from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";

const operation = () => {
  const [data, setdata] = useState([]);
  const param = useLocalSearchParams();
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://api-xuongmay-dev.lighttail.com/api/departmentoperation?pageIndex=1&pageSize=10&searchByDepartmentId=${param.id}`
      );
      setdata(res.data.data.items);
    } catch {
      console.error("fetch error ");
    }
  };
  return (
    <View style={defaultStyles.container}>
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

export default operation;

const styles = StyleSheet.create({});
