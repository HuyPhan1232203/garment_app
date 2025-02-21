import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import axios from "axios";
import { defaultStyles } from "@/styles/default";
import { Header } from "./Header";
type pageProps = {
  api?: string;
  headerTitle: string;
};
const BlankPage = ({ api, headerTitle }: pageProps) => {
  if (api) {
    const fetchData = async () => {
      try {
        const res = await axios.get(api);
        console.log(res.data);
      } catch {
        console.log("fetch error");
      }
    };
    useEffect(() => {
      fetchData();
    }, []);
  }
  return (
    <View style={defaultStyles.container}>
      <View>
        <Header text={headerTitle} />
      </View>
    </View>
  );
};

export default BlankPage;

const styles = StyleSheet.create({});
