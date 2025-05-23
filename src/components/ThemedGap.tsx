import { ThemedGapProps } from "@/types/components";
import React from "react";
import { View } from "react-native";

const ThemedGap: React.FC<ThemedGapProps> = ({ width, height }) => {
  return <View style={{ width: width, height: height }} />;
};

export default ThemedGap;
