import { ThemedButton, ThemedGap, ThemedText } from "@/components";
import { ThemedContainer } from "@/components/layout";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { PermissionScreenProps } from "@/types/components";
import { scale } from "@/utils/scaleSize";
import { Image } from "expo-image";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const PermissionScreen = ({
  icon,
  title,
  description,
  onAllow,
  onMaybeLater,
}: PermissionScreenProps) => {
  return (
    <ThemedContainer>
      <View
        style={[GlobalStyles.flex, GlobalStyles.spaceBetween, styles.container]}
      >
        <View style={[GlobalStyles.flex, GlobalStyles.center]}>
          <View
            style={[styles.iconWrapper, GlobalStyles.center]}
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
          >
            <Image
              source={icon}
              style={styles.icon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </View>
          <ThemedGap height="xl" />
          <ThemedText type="SemiBold" size="xl">
            {title}
          </ThemedText>
          <ThemedGap height="md" />
          <ThemedText
            type="Regular"
            size="md"
            color={Color.Text.Secondary}
            style={GlobalStyles.center}
          >
            {description}
          </ThemedText>
        </View>

        <View style={styles.buttonWrapper}>
          <ThemedButton variant="primary" title="Allow" onPress={onAllow} />
          {onMaybeLater && (
            <>
              <ThemedGap height="md" />
              <ThemedButton
                variant="outline"
                title="Maybe later"
                onPress={onMaybeLater}
              />
            </>
          )}
        </View>
      </View>
    </ThemedContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(24),
    backgroundColor: Color.Background.Background,
  },
  iconWrapper: {
    width: scale(200),
    height: scale(200),
    borderRadius: Radius.rounded,
    backgroundColor: Color.Purple[100],
  },
  icon: {
    width: "50%",
    height: "50%",
  },
  buttonWrapper: {
    marginTop: scale(32),
  },
});

export default memo(PermissionScreen);
