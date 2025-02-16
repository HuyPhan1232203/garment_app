import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { defaultStyles } from "@/styles/default";
import { Header } from "@/components/Header";
import axios from "axios";

const departmentPage = () => {
  const fetchDepartment = async () => {
    try {
      const res = await axios.get(
        "https://api-xuongmay-dev.lighttail.com/api/department?pageIndex=1&pageSize=10"
      );
      console.log(res.data.data.items);
    } catch {
      console.log("fetch error");
    }
  };
  useEffect(() => {
    fetchDepartment();
  }, []);
  return (
    <View style={defaultStyles.container}>
      <View>
        <Header text="Sản xuất - Danh sách tổ" />
      </View>
    </View>
  );
};

export default departmentPage;

const styles = StyleSheet.create({});
