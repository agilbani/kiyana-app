import {
  ThemedBottomSheet,
  ThemedButton,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedText,
  ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";

const AttendanceFormScreen = () => {
  const ref = useRef<ThemedBottomSheet | null>(null);

  const handleRetake = () => {
    router.push(ROUTES.ATTENDANCE_SELFIE);
  };

  const onSubmit = () => {
    ref.current?.show();
  };

  const onClose = () => {};
  return (
    <ThemedContainer>
      <ThemedHeader title="Selfie To Clock In" />
      <View style={styles.container}>
        <View style={styles.card}>
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
              <ThemedGap height="md" />
              <ThemedButton title="Retake Photo" onPress={handleRetake} />
            </View>
          </View>
          <ThemedGap height="sm" />
          <ThemedTextarea label="Keterangan (Optional)" />
        </View>
      </View>
      <View style={styles.footer}>
        <ThemedButton title="Clock In" onPress={onSubmit} />
      </View>

      <ThemedBottomSheet ref={ref} onClose={onClose}>
        <View style={GlobalStyles.center}>
          <ThemedText type="SemiBold" size="lg">
            Clock-In Successful!
          </ThemedText>
          <ThemedGap height="md" />
          <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
            {`You’re all set! Your clock-in was successful. Head\n over to your dashboard to see your assigned tasks.`}
          </ThemedText>
        </View>
        <ThemedGap height="lg" />
        <ThemedButton
          title="Go To Clock In Page"
          onPress={() => router.replace(ROUTES.ATTENDANCE)}
        />
      </ThemedBottomSheet>
    </ThemedContainer>
  );
};

export default AttendanceFormScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Purple[50],
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
    ...GlobalStyles.flex,
  },
  card: {
    backgroundColor: Color.Background.Background,
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(16),
    borderRadius: Radius.xs,
    ...GlobalStyles.flex,
  },
  photoWrapper: {
    position: "relative",
    ...GlobalStyles.flex,
  },
  photo: {
    borderRadius: Radius.sm,
    ...GlobalStyles.flex,
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
