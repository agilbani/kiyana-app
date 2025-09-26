import { ThemedGap, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { memo, useCallback } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const DATA = [
  {
    id: "1",
    month: "Januari 2024",
    salary: 10000000,
    paidOn: "30 Januari 2024",
  },
  {
    id: "2",
    month: "Februari 2024",
    salary: 10000000,
    paidOn: "30 Februari 2024",
  },
  {
    id: "3",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "4",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "5",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "6",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "7",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "8",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "9",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "10",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "11",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
  {
    id: "12",
    month: "Maret 2024",
    salary: 10000000,
    tax: "Rp1.000.000",
    paidOn: "30 Februari 2024",
  },
];

const PayrollItem = memo(({ item }: { item: (typeof DATA)[0] }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.card}
    onPress={() => router.push(ROUTES.PROFILE_DETAIL_PAYROLL(1) as any)}
  >
    <ThemedText type="SemiBold" size="md">
      {item.month}
    </ThemedText>
    <ThemedGap height="sm" />
    <View style={styles.innerCard}>
      <View>
        <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
          Diterima
        </ThemedText>
        <ThemedGap height="xxs" />
        <ThemedText type="Medium" size="md" color={Color.Text.Body}>
          {formatRupiahDisplay(item.salary)}
        </ThemedText>
      </View>
      <View>
        <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
          Dibayarkan Pada
        </ThemedText>
        <ThemedGap height="xxs" />
        <ThemedText type="Medium" size="md" color={Color.Text.Body}>
          {item.paidOn}
        </ThemedText>
      </View>
    </View>
  </TouchableOpacity>
));

const PayrollScreen = () => {
  const renderItem = useCallback(
    ({ item }: { item: (typeof DATA)[0] }) => <PayrollItem item={item} />,
    []
  );

  const keyExtractor = useCallback((item: (typeof DATA)[0]) => item.id, []);

  return (
    <View style={styles.page}>
      <ThemedHeader title="Slip Gaji" />
      <View style={styles.container}>
        <FlashList
          data={DATA}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <ThemedGap height="sm" />}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default React.memo(PayrollScreen);

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
  container: {
    backgroundColor: Color.Purple[50],
    paddingHorizontal: scale(4),
    ...GlobalStyles.flex,
  },
  contentContainer: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(8),
    paddingBottom: scale(64),
  },
  card: {
    backgroundColor: Color.Background.Background,
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    ...GlobalStyles.shadow,
  },
  innerCard: {
    backgroundColor: Color.Gray[100],
    borderWidth: 1,
    borderColor: Color.Gray[200],
    padding: scale(12),
    ...GlobalStyles.rowSpaceBetween,
  },
});
