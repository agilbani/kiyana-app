import GlobalStyles from "@/styles/common";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const ThemedLoader = () => {
  return (
    <View style={[GlobalStyles.flex, GlobalStyles.center]}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default ThemedLoader;

const styles = StyleSheet.create({});
