import { ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
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
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const MENU_GUDANG = [
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
                onPress: () => router.push(ROUTES.TASK_ADD_DATA_PRODUCTS),
            },
            {
                icon: ILStore,
                name: "Produk Variant",
                onPress: () => router.push(ROUTES.TASK_LIST_PRODUCT_VARIANT),
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
];

const MENU_PRODUK = [
    {
        title: "Produk Prioritas",
        data: [
            {
                icon: ILStore,
                name: "Lihat Produk Prioritas",
                onPress: () =>
                    router.push(ROUTES.TASK_LIST_OF_PRIORITY_PRODUCTS),
            },
            {
                icon: ILShoppingCart,
                name: "Tambah Produk Prioritas",
                onPress: () => router.push(ROUTES.TASK_ADD_PRIORITY_PRODUCTS),
            },
        ],
    },
];

const MENU_HR = [
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
];

const MENU_PENJUALAN = [
    {
        title: "Penjualan",
        data: [
            {
                icon: ILPOS,
                name: "Kasir / Transaksi",
                onPress: () => router.push(ROUTES.TASK_LIST_SALE),
            },
            {
                icon: ILTablet,
                name: "Tambah Customer Baru",
                onPress: () => router.push(ROUTES.TASK_LIST_CUSTOMER),
            },
        ],
    },
];

const TaskScreen = () => {
    const { user } = useApp();
    const [listMenu, setListMenu] = useState<any>([]);
    const menu = [
        MENU_GUDANG[0],
        MENU_HR[0],
        MENU_PENJUALAN[0],
        MENU_PRODUK[0],
    ];
    console.log("cek menu", menu);

    const checkPermission = () => {
        switch (user?.role?.name) {
            case "Spv Gudang":
            case "Staff Gudang":
                setListMenu(MENU_GUDANG);
                break;
            case "Staff Produksi":
            case "Spv Produksi":
                const arr = [MENU_GUDANG, MENU_PRODUK];
                setListMenu(arr);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        checkPermission();
    }, []);

    return (
        <View style={styles.sectionCard}>
            {menu.map((item, index) => (
                <View
                    key={`${index}`}
                    style={{
                        flexDirection: "column",
                        marginTop: 20,
                    }}
                >
                    <ThemedText type="SemiBold" size="md">
                        {item.title}
                    </ThemedText>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {item.data.map((v, index) => (
                            <TouchableOpacity
                                key={`${index}`}
                                activeOpacity={0.8}
                                style={styles.menuItem}
                                onPress={v.onPress}
                            >
                                <Image source={v.icon} style={styles.icon} />
                                <ThemedGap height="xs" />
                                <ThemedText
                                    size="xs"
                                    numberOfLines={2}
                                    style={GlobalStyles.center}
                                >
                                    {v.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
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
        width: "30%",
        padding: scale(8),
        marginLeft: 10,
        marginTop: 10,
        borderRadius: scale(10),
        ...GlobalStyles.center,
    },
    icon: {
        width: scale(38),
        height: scale(38),
    },
});
