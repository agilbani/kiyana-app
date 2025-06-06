import { ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { useAuth } from "@/hooks/useAuth";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcBell } from "@assets/icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const DashboardHeader = () => {
  const { user } = useAuth();

  return (
    <View style={styles.header}>
      <View style={GlobalStyles.rowCenter}>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.profile}
          contentFit="cover"
        />
        <ThemedGap width="xs" />
        <View>
          <ThemedText type="Medium">Tonald Drump</ThemedText>
          <ThemedText type="Medium" size="sm" color={Color.Purple[600]}>
            Junior Full Stack Developer
          </ThemedText>
        </View>
      </View>
      <View style={styles.iconWrapper}>
        <IcBell />
      </View>
    </View>
  );
};

export default React.memo(DashboardHeader);

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.Background.Background,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderColor: Color.Gray[200],
    ...GlobalStyles.rowSpaceBetween,
  },
  profile: {
    width: scale(44),
    height: scale(44),
    borderRadius: Radius.rounded,
  },
  iconWrapper: {
    backgroundColor: Color.Purple[50],
    width: scale(40),
    height: scale(40),
    borderRadius: Radius.rounded,
    ...GlobalStyles.center,
  },
});
