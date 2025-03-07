import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import BlankPage from "@/components/BlankPage";
import { defaultStyles } from "@/styles/default";
import { screenPadding } from "@/constraints/token";

const departmentPage = () => {
  return (
    <View style={[defaultStyles.container, {}]}>
      <BlankPage
        api="https://api-xuongmay-dev.lighttail.com/api/department"
        headerTitle="Sản xuất - Danh sách tổ"
        nextPath="/taskPage/task"
      />
    </View>
  );
};
export default departmentPage;

const styles = StyleSheet.create({});
