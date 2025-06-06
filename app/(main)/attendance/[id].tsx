import {
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcCalendar } from "@assets/icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const AttendanceDetailScreen = () => {
  return (
    <ThemedContainer>
      <ThemedHeader title="Detail" />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={GlobalStyles.rowCenter}>
            <IcCalendar width={16} height={16} stroke={Color.Purple[500]} />
            <ThemedGap width="xxs" />
            <ThemedText type="SemiBold" size="md">
              27 September 2024
            </ThemedText>
          </View>
          <ThemedGap height="xl" />
          <View style={styles.content}>
            <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
              Selfie Clock In
            </ThemedText>
            <ThemedGap height="xxs" />
            <View style={styles.photoWrapper}>
              <Image
                source={{ uri: "https://picsum.photos/300" }}
                style={styles.photo}
                contentFit="cover"
              />
              <View style={styles.photoContent}>
                <ThemedText type="Medium" size="sm" color={Color.Base.White}>
                  Lat : 45.43534
                </ThemedText>
                <ThemedGap height="xxs" />
                <ThemedText type="Medium" size="sm" color={Color.Base.White}>
                  Long : 97897.576
                </ThemedText>
                <ThemedGap height="xxs" />
                <ThemedText type="Medium" size="sm" color={Color.Base.White}>
                  11/10/24 09:00
                </ThemedText>
              </View>
            </View>
            <ThemedGap height="sm" />
            <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
              Clock-In Notes
            </ThemedText>
            <ThemedGap height="xxs" />
            <ThemedText type="Medium" size="md" color={Color.Text.Body}>
              Tidak ada
            </ThemedText>
            <ThemedGap height="sm" />
            <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
              Clock in & Out
            </ThemedText>
            <ThemedGap height="xxs" />
            <ThemedText type="Medium" size="md" color={Color.Text.Body}>
              09:00 AM — 05:00 PM
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedContainer>
  );
};

export default AttendanceDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Purple[50],
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
    ...GlobalStyles.flex,
  },
  card: {
    flex: 0.9,
    backgroundColor: Color.Background.Background,
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(16),
    borderRadius: Radius.xs,
  },
  content: {
    backgroundColor: Color.Gray[100],
    borderWidth: 1,
    borderColor: Color.Gray[200],
    padding: scale(12),
    borderRadius: Radius.sm,
    ...GlobalStyles.flex,
  },
  photoWrapper: {
    position: "relative",
    ...GlobalStyles.flex,
  },
  photo: {
    ...GlobalStyles.flex,
    borderRadius: Radius.sm,
  },
  photoContent: {
    position: "absolute",
    left: scale(16),
    right: scale(16),
    bottom: scale(16),
  },
  footer: {
    backgroundColor: Color.Background.Background,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(14),
    borderTopWidth: 1,
    borderColor: Color.Gray[200],
  },
});
