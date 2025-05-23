import React from "react";
import { TextProps, TextStyle } from "react-native";

export type FontType = "Regular" | "Medium" | "SemiBold" | "Bold";
export type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface ThemedTextProps extends TextProps {
  type?: FontType;
  size?: FontSize;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}
