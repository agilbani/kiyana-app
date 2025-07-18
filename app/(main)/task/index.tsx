import { ThemedGap, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import ILAttendance from "@assets/images/tasks/ILAttendance.png";
import ILMagnifyingLens from "@assets/images/tasks/ILMagnifyingLens.png";
import ILPOS from "@assets/images/tasks/ILPOS.png";
import ILSchedule from "@assets/images/tasks/ILSchedule.png";
import ILShoppingCart from "@assets/images/tasks/ILShoppingCart.png";
import ILStockIn from "@assets/images/tasks/ILStockIn.png";
import ILStore from "@assets/images/tasks/ILStore.png";
import ILTablet from "@assets/images/tasks/ILTablet.png";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const MENU_DATA = [
  {
    title: "Gudang",
    data: [
      {
        icon: ILStore,
        name: "Lihat Semua Produk",
        onPress: () => router.push(ROUTES.TASK_LIST_OF_PRODUCTS),
      },
      {
        icon: ILShoppingCart,
        name: "Tambah Produk Baru",
        onPress: () => router.push(ROUTES.TASK_ADD_PRODUCTS),
      },
      {
        icon: ILStockIn,
        name: "Catat Barang Masuk",
        onPress: () => router.push(ROUTES.TASK_STOCK_IN),
      },
      {
        icon: ILStockIn,
        name: "Catat Barang Keluar",
        onPress: () => router.push(ROUTES.TASK_STOCK_OUT),
      },
      {
        icon: ILMagnifyingLens,
        name: "Barang Retur",
        onPress: () => router.push(ROUTES.TASK_RETURN_ITEM),
      },
    ],
  },
  {
    title: "Produk Prioritas",
    data: [
      {
        icon: ILStore,
        name: "Lihat Produk Prioritas",
        onPress: () => router.push(ROUTES.TASK_LIST_OF_PRIORITY_PRODUCTS),
      },
      {
        icon: ILShoppingCart,
        name: "Tambah Produk Prioritas",
        onPress: () => router.push(ROUTES.TASK_ADD_PRIORITY_PRODUCTS),
      },
    ],
  },
  {
    title: "Karyawan",
    data: [
      {
        icon: ILAttendance,
        name: "Perbaiki Data Absensi",
        onPress: () => router.push(ROUTES.TASK_FIX_ATTENDANCE),
      },
      {
        icon: ILSchedule,
        name: "Lihat Jadwal Shift",
        onPress: () => router.push(ROUTES.TASK_SHIFT_SCHEDULE),
      },
      {
        icon: ILTablet,
        name: "Setujui Pengajuan",
        onPress: () => router.push(ROUTES.TASK_APPROVAL_SUBMISSION),
      },
    ],
  },
  {
    title: "Penjualan",
    data: [
      {
        icon: ILPOS,
        name: "Kasir / Transaksi",
        onPress: () => router.push(ROUTES.TASK_POINT_OF_SALE),
      },
    ],
  },
];

const TaskScreen = () => {
  return (
    <View style={styles.page}>
      <ThemedHeader title="Fitur Lainnya" />
      <FlatList
        data={MENU_DATA}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.sectionCard}>
            <ThemedText type="SemiBold" size="md">
              {item.title}
            </ThemedText>
            <ThemedGap height="sm" />
            <FlatList
              horizontal
              data={item.data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `${item.title}-${index}`}
              ItemSeparatorComponent={() => <ThemedGap height="sm" />}
              renderItem={({ item: menuItem }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.menuItem}
                  onPress={menuItem.onPress}
                >
                  <Image source={menuItem.icon} style={styles.icon} />
                  <ThemedGap height="xs" />
                  <ThemedText
                    size="sm"
                    numberOfLines={2}
                    style={GlobalStyles.center}
                  >
                    {menuItem.name}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <ThemedGap height="lg" />}
      />
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight ?? scale(46),
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
  listContainer: {
    padding: scale(16),
  },
  sectionCard: {
    backgroundColor: Color.Background.Background,
    borderRadius: scale(10),
    padding: scale(12),
    ...GlobalStyles.shadow,
  },
  menuItem: {
    width: scale(108),
    padding: scale(8),
    marginRight: scale(4),
    borderRadius: scale(10),
    ...GlobalStyles.center,
  },
  icon: {
    width: scale(48),
    height: scale(48),
  },
});
