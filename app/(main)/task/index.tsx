import { ThemedHeader } from "@/components";
import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const TaskScreen = () => {
  return (
    <View style={styles.page}>
      <ThemedHeader title="Fitur Lainnya" />
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
});
