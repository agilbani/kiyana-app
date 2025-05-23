import React from "react";
import { TextProps, TextStyle, ViewStyle } from "react-native";

export type FontType = "Regular" | "Medium" | "SemiBold" | "Bold";
export type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface ThemedTextProps extends TextProps {
  type?: FontType;
  size?: FontSize;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export interface ThemedImageProps {
  source: { uri: string } | number;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  placeholderColor?: string;
  borderRadius?: number;
  delayBeforeLoad?: number;
  onLoadEnd?: () => void;
}

export interface ThemedShimmerProps {
  type?: "image" | "default";
  width?: number;
  height?: number;
  borderRadius?: number;
}

export type ThemedGapProps = {
  width?: number;
  height?: number;
};
