import { ThemedBadge, ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { MOCK_TRANSACTIONS } from "@/constants/Dummy/Transaction";
import { TransactionStatus, TransactionStatusColor } from "@/constants/Enum";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
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
  const { backgroundColor, textColor } = TransactionStatusColor[
    item.status as TransactionStatus
  ] ?? {
    backgroundColor: "#EEEEEE",
    textColor: "#333333",
  };
  return (
    <View style={styles.taskWrapper}>
      <View style={GlobalStyles.rowSpaceBetween}>
        <View>
          <ThemedText type="Medium" size="md">
            {item.name}
          </ThemedText>
          <ThemedGap height="xs" />
          <ThemedBadge
            text={item.status}
            textColor={textColor}
            backgroundColor={backgroundColor}
          />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <ThemedText type="SemiBold" size="md">
            {formatRupiahDisplay(100000)}
          </ThemedText>
          <ThemedGap height="xs" />
          <ThemedText size="sm" color={Color.Text.Secondary}>
            17 Juni 2025 20:32 WIB
          </ThemedText>
        </View>
      </View>
    </View>
  );
});

const DashboardFinanceHistory = () => {
  const renderTaskItem = useCallback(
    ({ item }: any) => <TaskItem item={item} />,
    []
  );

  return (
    <View style={styles.card}>
      <View style={GlobalStyles.rowSpaceBetween}>
        <View>
          <ThemedText type="SemiBold">Riwayat Transaksi</ThemedText>
          <ThemedGap height="xxs" />
          <ThemedText size="sm" color={Color.Text.Secondary}>
            5 transaksi terbaru
          </ThemedText>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push(ROUTES.DASHBOARD_HISTORY_TRANSACTION)}
        >
          <ThemedText size="sm" color={Color.Purple[500]}>
            Lihat semua
          </ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedGap height="sm" />
      <FlatList
        data={MOCK_TRANSACTIONS}
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

export default React.memo(DashboardFinanceHistory);

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
    padding: scale(12),
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
