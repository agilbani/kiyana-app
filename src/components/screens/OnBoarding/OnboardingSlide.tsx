import { ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { OnboardingSlideProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { height, width } = Dimensions.get("window");

const OnboardingSlide = React.memo(
  ({ image, title, description }: OnboardingSlideProps) => (
    <View style={{ width, height: height * 0.625 }}>
      <View style={[styles.illustrationContainer, GlobalStyles.center]}>
        <LinearGradient
          colors={[Color.Purple[500], Color.Background.Background]}
          locations={[0.19, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={image}
          style={styles.illustration}
          contentFit="contain"
        />
      </View>
      <ThemedGap height="xxxl" />
      <View style={[styles.spacing, GlobalStyles.center]}>
        <ThemedText type="SemiBold" size="xl">
          {title}
        </ThemedText>
        <ThemedGap height="sm" />
        <ThemedText
          type="Regular"
          size="sm"
          color={Color.Text.Secondary}
          style={GlobalStyles.center}
        >
          {description}
        </ThemedText>
      </View>
    </View>
  )
);

const styles = StyleSheet.create({
  illustrationContainer: {
    position: "relative",
    height: height * 0.6,
  },
  illustration: {
    width: "90%",
    height: "90%",
    marginTop: verticalScale(64),
  },
  spacing: {
    paddingHorizontal: scale(32),
  },
});

export default React.memo(OnboardingSlide);
