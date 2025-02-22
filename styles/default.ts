import { colors, fontSize } from "@/constraints/token";
import { StyleSheet } from "react-native";

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgound,
  },
  text: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: fontSize.lg,
    color: colors.headerText,
    fontWeight: 500,
  },
  modal: {
    backgroundColor: "#009DFF80",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
export const utilsStyles = StyleSheet.create({
  itemSeparator: {
    borderColor: colors.textMuted,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  emptyContentText: {
    ...defaultStyles.text,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 20,
  },
  slider: {
    height: 7,
    borderRadius: 16,
  },
});
