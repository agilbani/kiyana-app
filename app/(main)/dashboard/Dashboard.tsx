import { ThemedText } from "@/components";
import DashboardCardSection from "@/components/card/DashboardCardSection";
import DashboardAmountCard from "@/components/screens/Dashboard/DashboardAmountCard";
import DashboardScanCard from "@/components/screens/Dashboard/DashboardScanCard";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getProfile } from "@/services/authService";
import { scale } from "@/utils/scaleSize";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const Dashboard = () => {
    const { user, updateUser } = useApp();
    const [refreshing, setRefreshing] = useState(false);
    const MenuOptions = [
        {
            label: "Produksi",
            data: [
                {
                    icon: require("@assets/icons/TodayTaskIcon.png"),
                    label: "Tugas Hari Ini",
                    action: () =>
                        user?.role?.name === "Tukang Potong"
                            ? router.push(ROUTES.DASHBOARD_ALL_TASK_TODAY)
                            : router.push(ROUTES.DASHBOARD_ALL_TASK_PRODUCTION),
                },
                {
                    icon: require("@assets/icons/CreateProductIcon.png"),
                    label: "Rencana Produksi",
                    action: () =>
                        router.push(ROUTES.DASHBOARD_CREATE_PLAN_PRODUCTION),
                },
                {
                    icon: require("@assets/icons/CuttingIcon.png"),
                    label: "Monitoring Produksi",
                    action: () =>
                        router.push(ROUTES.DASHBOARD_MONITORING_PRODUCTION),
                },
            ],
        },
        {
            label: "Produk Prioritas",
            data: [
                {
                    icon: require("@assets/icons/TodayTaskIcon.png"),
                    label: "Daftar Produk",
                    action: () =>
                        router.push(ROUTES.DASHBOARD_ALL_TASKPRIORITY),
                },
                {
                    icon: require("@assets/icons/ApprovalIcon.png"),
                    label: "Tambah Data",
                    action: () =>
                        router.push(ROUTES.DASHBOARD_CREATE_PRODUCT_PRIORITAS),
                },
            ],
        },
        {
            label: "Produk Baru",
            data: [
                {
                    icon: require("@assets/icons/PlanProduct.png"),
                    label: "Produk Plan",
                    action: () => router.push(ROUTES.TASK_LIST_OF_PRODUCTS),
                },
                {
                    icon: require("@assets/icons/ApprovalIcon.png"),
                    label: "Tambah Produk",
                    action: () => router.push(ROUTES.TASK_ADD_DATA_PRODUCTS),
                },
                // {
                //     icon: require("@assets/icons/ProductionListIcon.png"),
                //     label: "Persetujuan",
                //     action: () => console.log("task cutting"),
                // },
            ],
        },
        {
            label: "Gudang",
            data: [
                {
                    icon: require("@assets/icons/StockIcon.png"),
                    label: "Daftar Stok",
                    action: () => router.push(ROUTES.TASK_LIST_PRODUCT_VARIANT),
                },
                {
                    icon: require("@assets/icons/NewStockIcon.png"),
                    label: "Stok Baru",
                    action: () => console.log("task cutting"),
                },
            ],
        },
        {
            label: "Penjualan",
            data: [
                {
                    icon: require("@assets/icons/CasheerIcon.png"),
                    label: "Kasir",
                    action: () => router.push(ROUTES.TASK_POINT_OF_SALE_V2),
                },
                {
                    icon: require("@assets/icons/DataCustomerIcon.png"),
                    label: "Data Pembeli",
                    action: () => router.push(ROUTES.TASK_LIST_CUSTOMER),
                },
                {
                    icon: require("@assets/icons/SellingReportIcon.png"),
                    label: "Laporan Penjualan",
                    action: () => router.push(ROUTES.TASK_LIST_SALE),
                },
            ],
        },
        {
            label: "HR",
            data: [
                {
                    icon: require("@assets/icons/ProductionListIcon.png"),
                    label: "Persetujuan",
                    action: () => console.log("task cutting"),
                },
                {
                    icon: require("@assets/icons/EditAttendanceIcon.png"),
                    label: "Perbaikan Absensi",
                    action: () => router.push(ROUTES.EDIT_ATTENDANCE),
                },
                //  {
                //      icon: require("@assets/icons/NoteIcon.png"),
                //      label: "Perhitungan Gaji",
                //      action: () => console.log("task cutting"),
                //  },
            ],
        },
    ];

    const getUser = async () => {
        const res = await getProfile();
        setRefreshing((prev) => false);
        updateUser(res.data);
    };

    const onRefresh = useCallback(() => {
        setRefreshing((prev) => !prev);
        getUser();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getUser();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    return (
        <View style={styles.page}>
            <StatusBar
                translucent
                backgroundColor={Color.Base.White}
                barStyle="dark-content"
            />
            <DashboardCardSection />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <DashboardAmountCard
                    onPressLoan={() =>
                        router.push(ROUTES.DASHBOARD_HISTORYCASHADVANCE)
                    }
                    onPressWithdraw={() =>
                        router.push(ROUTES.DASHBOARD_WITHDRAWAL)
                    }
                    onPressHistory={() =>
                        router.push(ROUTES.DASHBOARD_HISTORY_TRANSACTION)
                    }
                    user={user}
                />
                <DashboardScanCard user={user} />
                {MenuOptions.map((v: any, index: any) => (
                    <View key={`${index}`} style={styles.card}>
                        <ThemedText
                            size="lg"
                            type="SemiBold"
                            style={{ marginTop: 16, marginHorizontal: 16 }}
                        >
                            {v.label}
                        </ThemedText>
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                                gap: 15,
                                paddingHorizontal: 12,
                            }}
                        >
                            {v.data.map((k: any, index: any) => (
                                <TouchableOpacity
                                    key={`${index}`}
                                    activeOpacity={0.9}
                                    onPress={k.action}
                                    style={styles.btnMenu}
                                >
                                    <Image
                                        source={k.icon}
                                        style={styles.iconMenu}
                                    />
                                    <ThemedText
                                        size="sm"
                                        type="Medium"
                                        style={{ textAlign: "center" }}
                                    >
                                        {k.label}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scroll: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 100,
        gap: 15,
    },
    iconMenu: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        resizeMode: "contain",
    },
    btnMenu: {
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
        gap: 4,
    },
    card: {
        width: "100%",
        borderRadius: 6,
        paddingBottom: 16,
        backgroundColor: Color.Base.White,
        gap: 15,
    },
    header: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: Color.Base.White,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Gray[200],
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    },
});

export default Dashboard;
