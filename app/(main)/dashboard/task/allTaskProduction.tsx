import {
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getListProduction } from "@/services/taskService";
import GlobalStyles from "@/styles/common";
import { getStatusBatch } from "@/utils/getStatusBatch";
import { hasMenuAccess } from "@/utils/helpher";
import { scale } from "@/utils/scaleSize";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const sewnOption = [
    //  { name: "Semua", value: "all" },
    { name: "Harus Dijahit", value: "needSewn" },
    { name: "Sedang Dijahit", value: "beingSewn" },
    { name: "Selesai Dijahit", value: "finishSewn" },
    { name: "Ditolak (Perbaikan)", value: "rejectRepairedSewn" },
    { name: "Ditolak (Tidak Bisa Diperbaiki)", value: "rejectNotrepairedSewn" },
];

const finishOption = [
    { name: "Harus Diselesaikan", value: "needFinishing" },
    { name: "Sedang Diselesaikan", value: "beingFinishing" },
    { name: "Proses Finishing selesai", value: "finishFinishing" },
    { name: "Ditolak (Perbaikan)", value: "rejectRepairedFinishing" },
    {
        name: "Ditolak (Tidak Bisa Diperbaiki)",
        value: "rejectNotrepairedFinishing",
    },
];

const AllTaskProduction = () => {
    const { user } = useApp();
    const [listData, setListData] = useState<any>([]);
    const [status, setStatus] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const renderProductionItem = useCallback(({ item }: any) => {
        const type = user?.role?.name === "Penjahit" ? "sewn" : "finishing";

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.cardProduction}
                onPress={() => {
                    router.push({
                        pathname: ROUTES.DASHBOARD_DETAIL_PRODUCTION,
                        params: { id: item?.batch },
                    });
                }}
            >
                <View style={styles.rowBetween}>
                    <ThemedText size="md" type="Medium">
                        Nama produksi
                    </ThemedText>
                    <ThemedText>
                        {item?.item?.variant_metadata?.product?.name}
                    </ThemedText>
                </View>
                <View style={styles.rowBetween}>
                    <ThemedText size="md" type="Medium">
                        Nomor Batch
                    </ThemedText>
                    <ThemedText>{item?.batch}</ThemedText>
                </View>
                <View style={styles.rowBetween}>
                    <ThemedText size="md" type="Medium">
                        Jumlah produksi
                    </ThemedText>
                    <ThemedText>{`${item.qty} ${
                        item.item.material_details !== null
                            ? item.item.material_details[0]?.unit
                            : ""
                    }`}</ThemedText>
                </View>
                <View style={styles.rowBetween}>
                    <ThemedText size="md" type="Medium">
                        Warna bahan
                    </ThemedText>
                    <ThemedText>{`${item?.item?.variant_metadata?.color} - ${item?.item?.variant_metadata?.size?.name}`}</ThemedText>
                </View>
                <View style={styles.rowBetween}>
                    <ThemedText size="md" type="Medium">
                        Status Batch
                    </ThemedText>
                    <ThemedText>{getStatusBatch(item, type)}</ThemedText>
                </View>
            </TouchableOpacity>
        );
    }, []);

    const getPayload = () => {
        let payload = {
            stage: user?.role?.name === "Penjahit" ? "sewing" : "finishing",
        };
        if (user?.role?.name === "Penjahit") {
            payload[status] = true;
            payload.sewing_by = user?.id;
        } else {
            payload[status] = true;
            payload.finishing_by = user?.id;
        }
        //   console.log("cek payload", payload);

        return payload;
    };

    const getProductionList = async () => {
        setLoading(true);
        try {
            const tasks = await getListProduction(getPayload());
            setLoading(false);
            setListData(tasks);
        } catch (err) {
            setLoading(false);
            console.error("Failed to fetch tasks", err);
        }
    };

    const getStatusProduction = () => {
        let wording = "";
        switch (status) {
            case "all":
                wording = "Tidak ada jadwal produksi hari ini";
            case "needSewn":
                wording = "Tidak ada jadwal produksi hari ini";
                break;
            case "beingSewn":
                wording = "Tidak ada produksi yang sedang dijahit";
                break;
            case "finishSewn":
                wording = "Tidak ada produksi yang selesai dijahit";
                break;
            case "needFinishing":
                wording = "Tidak ada jadwal produksi hari ini";
                break;
            case "beingFinishing":
                wording = "Tidak ada produksi yang sedang difinishing";
                break;
            case "finishFinishing":
                wording = "Tidak ada produksi yang selesai difinishing";
                break;
            default:
                wording = "Tidak ada produksi yang ditolak";
                break;
        }
        return wording;
    };

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.PRODUCTION_TASK)) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (status) {
                getProductionList();
            } else {
                if (user?.role?.name === "Penjahit") {
                    setStatus("needSewn");
                } else {
                    setStatus("needFinishing");
                }
            }
        }, [status]),
    );

    return (
        <View style={styles.page}>
            <StatusBar translucent barStyle="light-content" />
            <ThemedHeader title="Tugas Produksi" />
            <ThemedText
                type="SemiBold"
                size="md"
                style={{ marginHorizontal: 16, marginTop: 16 }}
            >
                Jumlah Tugas Hari ini: {listData.length}
            </ThemedText>
            <View style={{ width: "100%", height: scale(60) }}>
                <FlatList
                    data={
                        user?.role?.name === "Penjahit"
                            ? sewnOption
                            : finishOption
                    }
                    showsVerticalScrollIndicator={false}
                    horizontal
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => setStatus(item.value)}
                            style={{
                                marginTop: 15,
                                marginHorizontal: 5,
                                height: 45,
                            }}
                        >
                            <View
                                style={[
                                    styles.viewFilter,
                                    {
                                        backgroundColor:
                                            status === item.value
                                                ? Color.Green[50]
                                                : Color.Base.White,
                                        borderColor:
                                            status === item.value
                                                ? Color.Green[500]
                                                : Color.Gray[300],
                                    },
                                ]}
                            >
                                <ThemedText
                                    size="sm"
                                    type="Medium"
                                    color={
                                        status === item.value
                                            ? Color.Green[500]
                                            : Color.Base.Black
                                    }
                                >
                                    {item.name}
                                </ThemedText>
                            </View>
                        </Pressable>
                    )}
                />
            </View>
            {loading ? (
                <View style={styles.viewLoading}>
                    <ThemedLoader />
                </View>
            ) : (
                <FlatList
                    data={listData}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 100,
                        gap: 15,
                    }}
                    renderItem={renderProductionItem}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <ThemedGap height="sm" />}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    // maxToRenderPerBatch={5}
                    windowSize={10}
                    removeClippedSubviews={Platform.OS === "android"}
                    ListEmptyComponent={() => {
                        return (
                            <View
                                style={{
                                    height: 100,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ThemedText
                                    style={{
                                        alignSelf: "center",
                                    }}
                                >
                                    {getStatusProduction()}
                                </ThemedText>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    viewLoading: {
        flex: 0.6,
        justifyContent: "center",
        alignItems: "center",
    },
    viewFilter: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    cardProduction: {
        backgroundColor: Color.Base.White,
        borderRadius: 8,
        padding: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: Color.Gray[300],
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    page: {
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.flex,
    },
});

export default AllTaskProduction;
