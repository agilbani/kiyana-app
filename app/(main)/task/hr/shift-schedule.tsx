import { ThemedGap, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import moment from "moment";
import "moment/locale/id";
import React from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";

// Shift times
const SHIFTS = [
  "06:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 15:00",
  "15:00 - 18:00",
  "18:00 - 21:00",
  "21:00 - 23:59",
  "00:00 - 03:00",
];

// Dummy schedule
const MOCK_SCHEDULE = [
  {
    day: "Minggu",
    date: "2025-06-01",
    shifts: ["Host 1", "Break", "", "", "", "", "", ""],
  },
  {
    day: "Senin",
    date: "2025-06-02",
    shifts: ["", "Break", "", "", "", "", "", ""],
  },
  {
    day: "Rabu",
    date: "2025-06-04",
    shifts: [
      "Host 1",
      "Break",
      "Host 2",
      "Host 3",
      "Host 2",
      "Host 4",
      "Host 3",
      "",
    ],
  },
];

const getShiftColor = (text: string) => {
  if (text === "Break") return Color.Gray[300];
  if (text.startsWith("Host 1")) return Color.Green[200];
  if (text.startsWith("Host 2")) return Color.Gray[200];
  if (text.startsWith("Host 3")) return Color.Yellow[200];
  if (text.startsWith("Host 4")) return Color.Red[200];
  return Color.Gray[100];
};

const statusBarHeight = StatusBar.currentHeight;

const ShiftScheduleScreen = () => {
  const renderItem = ({ item }: { item: (typeof MOCK_SCHEDULE)[0] }) => (
    <View style={styles.card}>
      <ThemedText type="Bold" size="md">
        {item.day} - {moment(item.date).format("DD MMMM YYYY")}
      </ThemedText>
      <ThemedGap height="sm" />
      {item.shifts.map((shift, i) => (
        <View
          key={i}
          style={[styles.shiftItem, { backgroundColor: getShiftColor(shift) }]}
        >
          <ThemedText type="Medium" size="sm" color={Color.Text.Primary}>
            {SHIFTS[i]}
          </ThemedText>
          <ThemedText type="SemiBold" size="sm">
            {shift || "-"}
          </ThemedText>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.page}>
      <ThemedHeader title="Jadwal Shift" />
      <View style={styles.container}>
        <FlatList
          data={MOCK_SCHEDULE}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ShiftScheduleScreen;

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight || scale(46),
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
  container: {
    backgroundColor: Color.Purple[50],
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(4),

    ...GlobalStyles.flex,
  },
  contentContainer: {
    paddingHorizontal: scale(8),
  },
  card: {
    marginBottom: scale(12),
    backgroundColor: Color.Base.White,
    padding: scale(14),
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Color.Gray[200],
    ...GlobalStyles.shadow,
  },
  shiftItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    borderRadius: Radius.xs,
    marginBottom: scale(6),
  },
});
