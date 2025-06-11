import { ThemedGap, ThemedText } from "@/components";
import AttendanceHeader from "@/components/screens/Attendance/AttendanceHeader";
import AttendanceStatistics from "@/components/screens/Attendance/AttendanceStatistics";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcCalendar } from "@assets/icons";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const initialAttendanceData = {
  clockInTime: null,
  clockOutTime: null,
};

const renderHistoryListItem: ListRenderItem<any> = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.historyCard}
      onPress={() => router.push(ROUTES.ATTENDANCE_DETAIL(1) as any)}
    >
      <View style={GlobalStyles.rowCenter}>
        <IcCalendar width={16} height={16} stroke={Color.Purple[500]} />
        <ThemedGap width="xxs" />
        <ThemedText type="SemiBold" size="md">
          27 September 2024
        </ThemedText>
      </View>
      <ThemedGap height="xs" />
      <View style={styles.historyCardClockDetail}>
        <View style={GlobalStyles.flex}>
          <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
            Total Hours
          </ThemedText>
          <ThemedText type="Medium" size="md" color={Color.Text.Body}>
            08:00:00 hrs
          </ThemedText>
        </View>
        <View style={GlobalStyles.flex}>
          <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
            Clock in & Out
          </ThemedText>
          <ThemedText type="Medium" size="md" color={Color.Text.Body}>
            09:00 AM — 05:00 PM
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderHistoryHeader = () => {
  return (
    <View>
      <ThemedText type="SemiBold" size="md">
        Riyawat Absensi
      </ThemedText>
      <ThemedGap height="sm" />
    </View>
  );
};

const HistoryItemSeparator = () => <ThemedGap height="md" />;

const AttendanceScreen = () => {
  const handleClockIn = useCallback(async () => {
    router.push(ROUTES.ATTENDANCE_CLOCKIN);
  }, []);

  return (
    <View style={styles.page}>
      <AttendanceHeader
        clockInTime={initialAttendanceData.clockInTime}
        clockOutTime={initialAttendanceData.clockOutTime}
        onClockInPress={handleClockIn}
      />
      <ScrollView>
        <AttendanceStatistics />
        <FlashList
          scrollEnabled={false}
          data={[0, 1, 2, 3, 4, 5]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderHistoryListItem}
          estimatedItemSize={130}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={HistoryItemSeparator}
          ListHeaderComponent={renderHistoryHeader}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
  contentContainer: {
    paddingBottom: verticalScale(24),
    paddingHorizontal: scale(12),
  },
  historyCard: {
    backgroundColor: Color.Background.Background,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    ...GlobalStyles.shadow,
  },
  historyCardClockDetail: {
    ...GlobalStyles.rowCenter,
    backgroundColor: Color.Gray[100],
    padding: scale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: Color.Gray[200],
  },
});

export default AttendanceScreen;
