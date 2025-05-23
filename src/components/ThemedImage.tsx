import Color from "@/constants/Color";
import { ThemedImageProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import ThemedShimmer from "./ThemedShimmer";

const ThemedImage: React.FC<ThemedImageProps> = ({
  source,
  style,
  width = 200,
  height = 100,
  placeholderColor = Color.Gray[300],
  borderRadius = 12,
  delayBeforeLoad,
  onLoadEnd,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const iconSize = useMemo(
    () => Math.min(scale(width), verticalScale(height)) * 0.5,
    [width, height]
  );

  const overlayOpacity = useRef(new Animated.Value(1)).current;

  const handleLoadEnd = useCallback(() => {
    const delay = delayBeforeLoad || 0;
    setTimeout(() => {
      setLoading(false);
      onLoadEnd?.();

      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, delay);
  }, [delayBeforeLoad, onLoadEnd, overlayOpacity]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Image
        source={source}
        style={[styles.image, { borderRadius }]}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        contentFit="cover"
        transition={0}
        cachePolicy="memory-disk"
      />

      {!error && (
        <Animated.View
          pointerEvents="none"
          style={[styles.overlay, { borderRadius, opacity: overlayOpacity }]}
        />
      )}

      {loading && !error && (
        <ThemedShimmer
          type="image"
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      )}

      {error && (
        <View
          style={[
            styles.placeholder,
            { backgroundColor: placeholderColor, borderRadius },
          ]}
        >
          <MaterialIcons
            name="broken-image"
            size={iconSize * 0.5}
            color={Color.Gray[500]}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(ThemedImage);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: Color.Gray[300],
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
