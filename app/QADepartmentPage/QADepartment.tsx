import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { router } from "expo-router";

const QADepartment = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api-xuongmay-dev.lighttail.com/api/department?pageIndex=1&pageSize=10"
        );
        setData(res.data.data.items);
      } catch (error) {
        console.log("fetch error", error);
      }
    };
    fetchData();
  }, []);

  const handlePress = (id : string, name: string) => {
    router.push({
      pathname: "QA_Task/QATask",
      params: { 
        id: id,
        name: name,
      }
    })
  }

  const RenderItem = ({ item }: { item: { code: string; name: string } }) => {
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => handlePress(item.id, item.name)}  
      >
        <Text style={styles.itemText}>{item.code}</Text>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={defaultStyles.container}>
      <Header text="QA/QC - Danh sách tổ" />
      <FlatList
        data={data}
        renderItem={RenderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default QADepartment;

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    justifyContent: 'center',
    backgroundColor: "#009DFF80",
    flexDirection: "row",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    gap: 10,
  },
  itemText: {
    fontWeight: '500',
        marginRight: 8,
        fontSize: 24,
        color: '#003366',
  },
});