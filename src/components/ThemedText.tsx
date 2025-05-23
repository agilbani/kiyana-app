import Typography from "@/constants/Typography";
import { FontSize, FontType, ThemedTextProps } from "@/types/components";
import { scaleFont } from "@/utils/scaleSize";
import React, { useMemo } from "react";
import { Text, TextStyle } from "react-native";

const fontFamilyMap: Record<FontType, string> = {
  Regular: Typography.Font.Regular,
  Medium: Typography.Font.Medium,
  SemiBold: Typography.Font.SemiBold,
  Bold: Typography.Font.Bold,
};

const sizeMap: Record<FontSize, number> = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

const ThemedText: React.FC<ThemedTextProps> = ({
  type = "Regular",
  size = "md",
  style,
  children,
  ...rest
}) => {
  const fontSize = useMemo(() => scaleFont(sizeMap[size]), [size]);

  const baseStyle: TextStyle = {
    fontFamily: fontFamilyMap[type],
    fontSize,
    lineHeight: fontSize * 1.4,
    letterSpacing: 0.3,
  };

  return (
    <Text allowFontScaling style={[baseStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

// Custom comparator for memo
const areEqual = (prev: ThemedTextProps, next: ThemedTextProps) => {
  return (
    prev.children === next.children &&
    prev.type === next.type &&
    prev.size === next.size
  );
};

export default React.memo(ThemedText, areEqual);
