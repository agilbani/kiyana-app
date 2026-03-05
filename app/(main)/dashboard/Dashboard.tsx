import { ThemedText } from "@/components";
import DashboardCardSection from "@/components/card/DashboardCardSection";
import ModalRequest from "@/components/modal/ModalRequest";
import DashboardAmountCard from "@/components/screens/Dashboard/DashboardAmountCard";
import DashboardScanCard from "@/components/screens/Dashboard/DashboardScanCard";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getProfile } from "@/services/authService";
import { hasMenuAccess } from "@/utils/helpher";
import { scale } from "@/utils/scaleSize";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
    console.log("cek user", user);

    const [refreshing, setRefreshing] = useState(false);
    const [modalRequest, setModalRequest] = useState(false);
    const [showCardScan, setShowCardScan] = useState(true);
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
                {
                    icon: require("@assets/icons/ApprovalIcon.png"),
                    label: "Request Bahan",
                    action: () => setModalRequest(true),
                    // router.push(ROUTES.DASHBOARD_REQUEST_MATERIAL),
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
                //  {
                //      icon: require("@assets/icons/ApprovalIcon.png"),
                //      label: "Tambah Data",
                //      action: () =>
                //          router.push(ROUTES.DASHBOARD_CREATE_PRODUCT_PRIORITAS),
                //  },
                {
                    icon: require("@assets/icons/ApprovalIcon.png"),
                    label: "Tambah Data",
                    action: () =>
                        router.push(
                            ROUTES.DASHBOARD_CREATE_MASSIVE_PRODUCT_PRIORITAS,
                        ),
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
                    label: "Tambah Stok",
                    action: () => router.push(ROUTES.TASK_ADD_STOCK),
                },
                {
                    icon: require("@assets/icons/scaner.png"),
                    label: "Hitung Stok",
                    action: () => router.push(ROUTES.TASK_CALCULATE_STOCK),
                },
                {
                    icon: require("@assets/icons/benang.png"),
                    label: "Tambah Bahan",
                    action: () => router.push(ROUTES.BAHAN),
                },
                {
                    icon: require("@assets/icons/tailor.png"),
                    label: "Aksesoris",
                    action: () => router.push(ROUTES.AKSESORIS),
                },
                {
                    icon: require("@assets/icons/database.png"),
                    label: "Produk",
                    action: () => router.push(ROUTES.PRODUK),
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
                    action: () => router.push(ROUTES.DASHBOARD_APPROVAL),
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

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.SHOW_SCAN_BATCH)) {
            setShowCardScan(false);
        } else {
            setShowCardScan(true);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getUser();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, []),
    );
    //  console.log("cek user", user);

    return (
        <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle={"light-content"} />
            <DashboardCardSection
                onPressNotif={() => router.push(ROUTES.NOTIFICATION)}
                user={user}
            />
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
                        router.push(ROUTES.DASHBOARD_HISTORY_WITHDRAWAL)
                    }
                    onPressHistory={() =>
                        router.push(ROUTES.DASHBOARD_TRANSFER_HISTORY)
                    }
                    onPressSend={() => router.push(ROUTES.DASHBOARD_TRANSFER)}
                    user={user}
                />
                {showCardScan && <DashboardScanCard user={user} />}
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
                                    style={[
                                        styles.btnMenu,
                                        {
                                            width:
                                                v.data.length > 3
                                                    ? "21%"
                                                    : "23%",
                                        },
                                    ]}
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
            <ModalRequest
                visible={modalRequest}
                onClose={() => setModalRequest(false)}
                onPressMats={() => {
                    setModalRequest(false);
                    router.push(ROUTES.DASHBOARD_REQUEST_MATERIAL);
                }}
                onPressAcc={() => {
                    setModalRequest(false);
                    router.push(ROUTES.DASHBOARD_REQUEST_ACCESSORIES);
                }}
            />
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
        width: "21%",
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
