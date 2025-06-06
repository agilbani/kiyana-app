import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { ThemedContainerProps } from "@/types/components";
import { scale } from "@/utils/scaleSize";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import ThemedKeyboardAvoiding from "./ThemedKeyboardAvoiding";

const statusBarHeight = StatusBar.currentHeight;

const ThemedContainer: React.FC<ThemedContainerProps> = ({
  children,
  backgroundColor = Color.Background.Background,
  statusBarStyle = "dark-content",
}) => {
  return (
    <View style={[styles.page, { backgroundColor }]}>
      <StatusBar translucent barStyle={statusBarStyle} />
      <ThemedKeyboardAvoiding backgroundColor={backgroundColor}>
        {children}
      </ThemedKeyboardAvoiding>
    </View>
  );
};

export default React.memo(ThemedContainer);

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    ...GlobalStyles.flex,
  },
});
