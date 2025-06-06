import {
  ThemedBadge,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { TransactionStatus, TransactionStatusColor } from "@/constants/Enum";
import GlobalStyles from "@/styles/common";
import { formatDate, formatRupiahDisplay } from "@/utils/currency";
import { scale } from "@/utils/scaleSize";
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

const DATA = [
  {
    title: "Tarik Tunai",
    status: TransactionStatus.SUCCESS,
    amount: "100000",
    date: "2025-06-05T20:32:00",
  },
  {
    title: "Transfer Bank",
    status: TransactionStatus.PROCESSING,
    amount: "250000",
    date: "2025-06-03T19:10:00",
  },
  {
    title: "Gagal Transfer",
    status: TransactionStatus.FAILED,
    amount: "150000",
    date: "2025-06-01T10:20:00",
  },
];

type ItemProps = (typeof DATA)[number];

const TransactionItem = memo(({ item }: { item: ItemProps }) => {
  const { backgroundColor, textColor } = TransactionStatusColor[
    item.status as TransactionStatus
  ] ?? {
    backgroundColor: "#EEEEEE",
    textColor: "#333333",
  };
  return (
    <View style={[styles.item, GlobalStyles.rowSpaceBetween]}>
      <View style={GlobalStyles.flex}>
        <ThemedText type="Medium">{item.title}</ThemedText>
        <ThemedGap height="xs" />
        <ThemedBadge
          text={item.status}
          backgroundColor={backgroundColor}
          textColor={textColor}
        />
      </View>
      <View style={styles.right}>
        <ThemedText type="SemiBold" size="md">
          {formatRupiahDisplay(item.amount)}
        </ThemedText>
        <ThemedGap height="xs" />
        <ThemedText size="sm" color={Color.Text.Secondary}>
          {formatDate(item.date)}
        </ThemedText>
      </View>
    </View>
  );
});

const HistoryTransactionScreen = () => {
  const renderItem = useCallback(
    ({ item }: { item: ItemProps }) => <TransactionItem item={item} />,
    []
  );

  return (
    <ThemedContainer>
      <ThemedHeader title="Riwayat Transaksi" />
      <FlashList
        data={DATA}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={renderItem}
        estimatedItemSize={72}
        removeClippedSubviews
        contentContainerStyle={styles.container}
      />
    </ThemedContainer>
  );
};

export default HistoryTransactionScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(20),
  },
  item: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Color.Gray[200],
  },
  right: {
    alignItems: "flex-end",
  },
});
