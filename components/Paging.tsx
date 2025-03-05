import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "@/constraints/token";
import { defaultStyles } from "@/styles/default";
type PagingProps = {
  data: any[];
  pageIndex: number;
  onPrev: () => void;
  onNext: () => void;
  pages: number;
};

const Paging = ({ data, pageIndex, onPrev, onNext, pages }: PagingProps) => {
  return (
    <View
      style={{
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={pageIndex === 1 ? styles.buttonDisabled : styles.buttonContainer}
      >
        <Text style={styles.button} onPress={onPrev}>
          Previus
        </Text>
      </TouchableOpacity>
      <View>
        <Text>
          Page {pageIndex} of {pages}
        </Text>
      </View>
      <TouchableOpacity
        style={
          pageIndex == pages ? styles.buttonDisabled : styles.buttonContainer
        }
      >
        <Text style={styles.button} onPress={onNext}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Paging;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    alignItems: "center",
  },
  button: {
    ...defaultStyles.headerText,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
    borderRadius: 30,
    alignItems: "center",
  },
});
