import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { OnboardingDotsProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import React from "react";
import { Animated, StyleSheet, View } from "react-native";

const OnboardingDots = React.memo(
  ({ slidesLength, translateX }: OnboardingDotsProps) => (
    <View style={GlobalStyles.center}>
      <View
        style={[styles.dotsContainer, GlobalStyles.rowCenter]}
        pointerEvents="none"
      >
        {Array.from({ length: slidesLength }).map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
        <Animated.View
          style={[
            styles.dotActive,
            { position: "absolute", transform: [{ translateX }] },
          ]}
        />
      </View>
    </View>
  )
);

const styles = StyleSheet.create({
  dotsContainer: {
    gap: scale(2),
  },
  dot: {
    width: scale(20),
    height: verticalScale(4),
    borderRadius: scale(8),
    backgroundColor: Color.Purple[100],
  },
  dotActive: {
    width: scale(20),
    height: verticalScale(4),
    borderRadius: scale(8),
    backgroundColor: Color.Purple[500],
  },
});

export default React.memo(OnboardingDots);
