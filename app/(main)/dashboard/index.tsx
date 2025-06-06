import { ThemedGap } from "@/components";
import DashboardAnnouncement from "@/components/screens/Dashboard/DashboardAnnouncement";
import DashboardCard from "@/components/screens/Dashboard/DashboardCard";
import DashboardFinanceHistory from "@/components/screens/Dashboard/DashboardFinanceHistory";
import DashboardHeader from "@/components/screens/Dashboard/DashboardHeader";
import DashboardTodayTask from "@/components/screens/Dashboard/DashboardTodayTask";
import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const statusBarHeight = StatusBar.currentHeight;

const HomeScreen = () => {
  return (
    <View style={styles.page}>
      <StatusBar translucent barStyle="dark-content" />
      <DashboardHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <DashboardCard />
        <ThemedGap height="md" />
        <DashboardAnnouncement text="Diberitahukan untuk Semua karyawan agar tidak terlambat melakukan absensi" />
        <ThemedGap height="md" />
        <DashboardTodayTask />
        <ThemedGap height="md" />
        <DashboardFinanceHistory />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
  container: {
    backgroundColor: Color.Purple[50],
  },
  contentContainer: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
  },
});
