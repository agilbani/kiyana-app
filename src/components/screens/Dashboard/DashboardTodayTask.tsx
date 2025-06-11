import { ThemedBadge, ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { MOCK_TASKS } from "@/constants/Dummy/Task";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcActiveCalendar, IcFaster } from "@assets/icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const TaskItem = React.memo(({ item }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.taskWrapper}
      onPress={() => router.push(ROUTES.DASHBOARD_TASK_DETAIL(1) as any)}
    >
      <View style={GlobalStyles.rowCenter}>
        <IcFaster />
        <ThemedGap width="xs" />
        <ThemedText type="Medium" size="md" style={GlobalStyles.flex}>
          {`${item.orderName} (${item.quantity} pcs)`}
        </ThemedText>
      </View>
      <ThemedGap height="sm" />
      <ThemedText type="Medium" size="xs" color={Color.Text.Secondary}>
        Status: {item.status}
      </ThemedText>
      <ThemedGap height="xs" />
      <View style={GlobalStyles.rowSpaceBetween}>
        <View style={styles.deadlineWrapper}>
          <IcActiveCalendar width={16} height={16} stroke={Color.Gray[500]} />
          <ThemedGap width="xxs" />
          <ThemedText type="Medium" size="xs" color={Color.Text.Secondary}>
            Deadline:
          </ThemedText>
          <ThemedGap width="xs" />
          <ThemedText type="SemiBold" size="xs" color={Color.Text.Primary}>
            {item.deadline}
          </ThemedText>
        </View>
        <ThemedBadge
          text={item.priorityText}
          backgroundColor={item.priorityBgColor}
          textColor={Color.Base.White}
        />
      </View>
    </TouchableOpacity>
  );
});

const DashboardTodayTask = () => {
  const renderTaskItem = useCallback(
    ({ item }: any) => <TaskItem item={item} />,
    []
  );

  return (
    <View style={styles.card}>
      <View style={GlobalStyles.rowCenter}>
        <ThemedText type="SemiBold">Tugas hari ini</ThemedText>
        <ThemedGap width="xxs" />
        <View style={styles.countWrapper}>
          <ThemedText type="SemiBold" size="sm" color={Color.Purple[500]}>
            {MOCK_TASKS.length}
          </ThemedText>
        </View>
      </View>
      <ThemedGap height="xxs" />
      <ThemedText size="sm" color={Color.Text.Secondary}>
        Daftar tugas Anda untuk hari ini
      </ThemedText>
      <ThemedGap height="sm" />
      <FlatList
        data={MOCK_TASKS}
        renderItem={renderTaskItem}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <ThemedGap height="sm" />}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"}
      />
    </View>
  );
};

export default React.memo(DashboardTodayTask);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.Base.White,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: Radius.xs,
    ...GlobalStyles.shadow,
  },
  countWrapper: {
    minWidth: scale(20),
    height: scale(20),
    paddingHorizontal: scale(4),
    backgroundColor: Color.Purple[50],
    borderRadius: Radius.xs,
    ...GlobalStyles.center,
  },
  taskWrapper: {
    backgroundColor: Color.Gray[50],
    paddingTop: scale(12),
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderColor: Color.Gray[200],
    borderRadius: Radius.xs,
  },
  deadlineWrapper: {
    backgroundColor: Color.Base.White,
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(10),
    borderRadius: Radius.rounded,
    ...GlobalStyles.rowCenter,
    borderWidth: 1,
    borderColor: Color.Gray[300],
  },
});
