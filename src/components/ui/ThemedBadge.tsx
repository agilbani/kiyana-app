import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { ThemedBadgeProps } from "@/types/components";
import { scale } from "@/utils/scaleSize";
import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedGap from "./ThemedGap";
import ThemedText from "./ThemedText";

const ThemedBadge: React.FC<ThemedBadgeProps> = ({
  icon,
  text,
  backgroundColor = Color.Gray[200],
  textColor = Color.Gray[600],
}) => {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      {icon && (
        <>
          {icon}
          <ThemedGap width="xs" />
        </>
      )}
      <ThemedText type="SemiBold" size="xs" color={textColor}>
        {text}
      </ThemedText>
    </View>
  );
};

export default ThemedBadge;

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: Radius.rounded,
    ...GlobalStyles.rowCenter,
  },
});
