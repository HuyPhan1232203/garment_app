import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import BlankPage from "@/components/BlankPage";

const departmentPage = () => {
  return (
    <BlankPage
      api="https://api-xuongmay-dev.lighttail.com/api/department?pageIndex=1&pageSize=10"
      headerTitle="Sản xuất - Danh sách tổ"
    />
  );
};

export default departmentPage;

const styles = StyleSheet.create({});
