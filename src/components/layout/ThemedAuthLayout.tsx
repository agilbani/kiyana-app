import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { ThemedAuthLayoutProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import IL1 from "@assets/images/onboarding/ILFirstOnboarding.png";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const ThemedAuthLayout: React.FC<ThemedAuthLayoutProps> = ({ children }) => {
  const slideAnim = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <View style={GlobalStyles.flex}>
      <View style={[styles.illustrationContainer, GlobalStyles.center]}>
        <LinearGradient
          colors={[Color.Purple[500], Color.Background.Background]}
          locations={[0.19, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Image source={IL1} style={styles.illustration} contentFit="contain" />
        <BlurView
          intensity={90}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
      </View>

      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default ThemedAuthLayout;

const styles = StyleSheet.create({
  illustrationContainer: {
    flex: 1,
  },
  illustration: {
    width: "90%",
    height: "90%",
    marginBottom: verticalScale(200),
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: scale(32),
    backgroundColor: Color.Background.Background,
    borderTopLeftRadius: scale(Radius.xl),
    borderTopRightRadius: scale(Radius.xl),
    zIndex: 1,
  },
});
