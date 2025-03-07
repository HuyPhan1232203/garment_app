import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions // Thêm Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import { router } from "expo-router";

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

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

  const handlePress = (id: string, name: string) => {
    router.push({
      pathname: "QA_Task/QATask",
      params: { 
        id: id,
        name: name,
      }
    });
  };

  const RenderItem = ({ item }: { item: { id: string; code: string; name: string } }) => {
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
      <Header text="QA/QC - Danh sách tổ" isChild={true} />
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
    padding: width * 0.05, // 5% chiều rộng thay cho 20
  },
  itemContainer: {
    justifyContent: 'center',
    backgroundColor: "#009DFF80",
    flexDirection: "row",
    padding: width * 0.05, // 5% chiều rộng thay cho 20
    marginVertical: height * 0.01, // 1% chiều cao thay cho 8
    borderRadius: width * 0.025, // 2.5% chiều rộng thay cho 10
    gap: width * 0.025, // 2.5% chiều rộng thay cho 10
  },
  itemText: {
    fontWeight: '500',
    marginRight: width * 0.02, // 2% chiều rộng thay cho 8
    fontSize: width * 0.06, // 6% chiều rộng thay cho 24
    color: '#003366',
  },
});