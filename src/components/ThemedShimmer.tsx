import Color from "@/constants/Color";
import { ThemedShimmerProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

const ThemedShimmer: React.FC<ThemedShimmerProps> = React.memo(
  ({ type = "default", width = 200, height = 100, borderRadius }) => {
    const translateX = useSharedValue(-screenWidth);

    useEffect(() => {
      translateX.value = withRepeat(
        withTiming(screenWidth, {
          duration: 1600,
          easing: Easing.linear,
        }),
        -1,
        true
      );
    }, [translateX]);

    const shimmerStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const scaledWidth = useMemo(() => scale(width), [width]);
    const scaledHeight = useMemo(() => verticalScale(height), [height]);
    const calculatedRadius = useMemo(
      () => Math.min(scaledWidth, scaledHeight) * 0.08,
      [scaledWidth, scaledHeight]
    );

    const resolvedBorderRadius = useMemo(
      () =>
        borderRadius !== undefined ? scale(borderRadius) : calculatedRadius,
      [borderRadius, calculatedRadius]
    );

    const iconSize = useMemo(
      () => Math.min(scale(width), verticalScale(height)) * 0.5,
      [width, height]
    );

    return (
      <View
        style={[
          styles.container,
          {
            width: scaledWidth,
            height: scaledHeight,
            borderRadius: resolvedBorderRadius,
          },
        ]}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: Color.Gray[300] },
          ]}
        />

        {/* Shimmer effect */}
        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
          <LinearGradient
            colors={["transparent", Color.Gray[200], "transparent"]}
            locations={[0.35, 0.5, 0.65]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>

        {type === "image" && (
          <View
            style={[
              styles.imagePlaceholder,
              {
                width: iconSize,
                height: iconSize,
                borderRadius: iconSize * 0.2,
                top: "50%",
                transform: [{ translateY: -iconSize / 2 }],
              },
            ]}
          >
            <MaterialIcons
              name="image"
              size={iconSize * 0.5}
              color={Color.Gray[500]}
            />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: Color.Gray[300],
    position: "relative",
  },
  gradient: {
    width: "250%",
    height: "100%",
  },
  imagePlaceholder: {
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
});

export default ThemedShimmer;
