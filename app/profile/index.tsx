import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcArrowLeft } from "@assets/icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const ProfileScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.backgroundHeader}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IcArrowLeft width={16} height={16} />
        </TouchableOpacity>
        <ThemedText
          type="SemiBold"
          size="lg"
          color={Color.Background.Background}
          style={GlobalStyles.center}
        >
          My Profile
        </ThemedText>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  page: {
    ...GlobalStyles.flex,
    backgroundColor: Color.Base.White,
  },
  backgroundHeader: {
    backgroundColor: Color.Background.HeaderTopGradient,
    height: Dimensions.get("window").height * 0.276,
    minHeight: verticalScale(224),
    paddingTop: statusBarHeight ? statusBarHeight + scale(12) : scale(46),
  },
  backButton: {
    position: "absolute",
    top: statusBarHeight ? statusBarHeight + scale(8) : scale(46),
    left: 14,
    width: scale(32),
    height: scale(32),
    backgroundColor: Color.Background.Background,
    borderRadius: Radius.rounded,
    zIndex: 1,
    ...GlobalStyles.center,
  },
});
