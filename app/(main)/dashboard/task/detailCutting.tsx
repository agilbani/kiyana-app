import {
    ThemedButton,
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp as authContext } from "@/context/AppContext";
import { updateStatusFixing } from "@/services/masterService";
import {
    getTaskById,
    GetTaskByIdResult,
    startProcess,
} from "@/services/taskService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { scale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

type Item = {
    id: string;
    qty: string;
    sku: string;
    status: string;
};

type Data = {
    items: Item[];
};

const TaskDetailScreen = () => {
    const { user } = authContext();
    const { bottom } = usePositionBottom();
    const { id } = useLocalSearchParams<{ id: string }>();
    //  console.log("cek code detail", id);

    const [task, setTask] = useState<GetTaskByIdResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStart, setLoadingStart] = useState<boolean>(false);

    async function getDetail() {
        LoadingManager.show();
        //   setLoading(true);
        const result = await getTaskById(id);
        //   setLoading(false);
        LoadingManager.hide();
        if (result.success && result.data) {
            setTask(result);
            // console.log("Task fetched:", result);
        } else {
            // console.warn("Failed:", result.statusCode, result.message);
            Alert.alert(`Failed ${result.statusCode}`, result.message);
        }
    }

    async function handleStartCutting(itemId: any) {
        //   console.log("item id", itemId);

        setLoadingStart(true);
        const res = await startProcess(
            task?.data?.code,
            itemId,
            { cutting_at: moment(new Date()).format("YYYY-MM-DD HH:mm") }
            // task?.data?.product_metadata.id
        );
        //   console.log("res start cuting", res);

        setLoadingStart(false);
        if (res.success) {
            ShowToastMessage(res?.message);
            getDetail();
        } else {
            ShowToastMessage(res?.message);
        }
    }

    const startFixing = async (batch: string) => {
        const payload = {
            batch: batch,
            stage: "cutting",
            status: "Being Repaired",
        };
        LoadingManager.show();
        const res = await updateStatusFixing(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            getDetail();
        } else {
            ShowToastMessage(res.message);
        }
    };

    const endFixing = async (batch: string) => {
        const payload = {
            batch: batch,
            stage: "cutting",
            status: "Finished Repaired",
        };
        LoadingManager.show();
        const res = await updateStatusFixing(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            getDetail();
        } else {
            ShowToastMessage(res.message);
        }
    };

    function checkStatus(data: Data): boolean {
        const allDone = data.items.every(
            (item) => item.status === "Selesai Dipotong"
        );
        return !allDone;
    }

    useEffect(() => {
        if (id) {
            getDetail();
        }
    }, [id]);

    if (!task?.success || !task.data) {
        return (
            <View style={styles.page}>
                <StatusBar translucent barStyle="dark-content" />
                <ThemedHeader title="Detail Tugas" />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ThemedText>Data tidak ditemukan</ThemedText>
                </View>
            </View>
        );
    }
    const t = task.data;

    return (
        <ThemedContainer>
            <ThemedHeader title="Detail Tugas" />
            {loading ? (
                <ThemedLoader />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.viewCard}>
                        <ThemedText type="Bold" size="lg">
                            Info Tugas
                        </ThemedText>
                        <View style={GlobalStyles.rowCenter}>
                            <ThemedText type="SemiBold">Code:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>{t.code}</ThemedText>
                        </View>
                        <View style={GlobalStyles.rowCenter}>
                            <ThemedText type="SemiBold">Status:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>{t.status}</ThemedText>
                        </View>
                        <View style={GlobalStyles.rowCenter}>
                            <ThemedText type="SemiBold">Product:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>{t.product_metadata.name}</ThemedText>
                        </View>
                        <View style={GlobalStyles.rowCenter}>
                            <ThemedText type="SemiBold">Material:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {t.product_metadata.materials[0]?.name}
                            </ThemedText>
                        </View>
                        <View style={GlobalStyles.rowCenter}>
                            <ThemedText type="SemiBold">Cutting By:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {t.cutting_by?.first_name}{" "}
                                {t.cutting_by?.last_name}
                            </ThemedText>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "100%",
                            height: 5,
                            backgroundColor: Color.Gray[300],
                        }}
                    />
                    <View style={styles.viewCard}>
                        <ThemedText type="Bold" size="lg">
                            Info Item:
                        </ThemedText>
                        {t.items.map((v, index) => (
                            <View
                                key={index.toString()}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    paddingVertical: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.Gray[300],
                                }}
                            >
                                <View style={{ width: "65%" }}>
                                    <View style={GlobalStyles.rowCenter}>
                                        <ThemedText type="SemiBold">
                                            SKU:
                                        </ThemedText>
                                        <ThemedGap width="xs" />
                                        <ThemedText>{v.sku}</ThemedText>
                                    </View>
                                    <View style={GlobalStyles.rowCenter}>
                                        <ThemedText type="SemiBold">
                                            Qty:
                                        </ThemedText>
                                        <ThemedGap width="xs" />
                                        <ThemedText>
                                            {v.qty} {v.unit}
                                        </ThemedText>
                                    </View>
                                    <View style={GlobalStyles.rowCenter}>
                                        <ThemedText type="SemiBold">
                                            Size:
                                        </ThemedText>
                                        <ThemedGap width="xs" />
                                        <ThemedText>
                                            {v.qty}{" "}
                                            {v.variant_metadata.size.name}
                                        </ThemedText>
                                    </View>
                                    <View style={GlobalStyles.rowCenter}>
                                        <ThemedText type="SemiBold">
                                            Color:
                                        </ThemedText>
                                        <ThemedGap width="xs" />
                                        <ThemedText>
                                            {v.qty} {v.variant_metadata.color}
                                        </ThemedText>
                                    </View>
                                </View>
                                {v.cutting_approvals.length === 0 ? (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        disabled={
                                            v.status === "Sedang Dipotong"
                                        }
                                        style={[
                                            styles.btnStart,
                                            {
                                                backgroundColor:
                                                    v.status ===
                                                    "Sedang Dipotong"
                                                        ? Color.Gray[300]
                                                        : Color.Green[500],
                                            },
                                        ]}
                                        onPress={() => handleStartCutting(v.id)}
                                    >
                                        <ThemedText color={Color.Base.White}>
                                            Mulai Produksi
                                        </ThemedText>
                                    </TouchableOpacity>
                                ) : v.cutting_approvals.length > 0 &&
                                  v.cutting_approvals[0]?.status ===
                                      "Pending" ? null : (
                                    v.cutting_approvals.length > 0 &&
                                    v.cutting_approvals[0]?.status !==
                                        "Finished Repaired" && (
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            style={[
                                                styles.btnStart,
                                                {
                                                    backgroundColor:
                                                        v.status ===
                                                        "Sedang Dipotong"
                                                            ? Color.Gray[300]
                                                            : Color.Green[500],
                                                },
                                            ]}
                                            onPress={() => {
                                                if (
                                                    v.cutting_approvals[0]
                                                        .status ===
                                                    "Reject (Bisa Diperbaiki)"
                                                ) {
                                                    startFixing(
                                                        v.cutting_approvals[0]
                                                            .batch
                                                    );
                                                } else {
                                                    endFixing(
                                                        v.cutting_approvals[0]
                                                            .batch
                                                    );
                                                }
                                            }}
                                        >
                                            <ThemedText
                                                color={Color.Base.White}
                                            >
                                                {v.cutting_approvals[0]
                                                    .status ===
                                                "Reject (Bisa Diperbaiki)"
                                                    ? "Mulai Perbaiki"
                                                    : "Selesai Perbaikan"}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
            {/* <View style={[styles.footer, { bottom: bottom }]}>
                <View style={{ width: "48%" }}>
                    <ThemedButton
                        title="Mulai Produksi"
                        style={{ marginTop: 10 }}
                        disabled={t.status !== "Planned"}
                        onPress={handleStartCutting}
                        loading={loading}
                    />
                </View>
                <View style={{ width: "48%" }}>
                    <ThemedButton
                        title="Tambah Batch Produksi"
                        style={{ marginTop: 10 }}
                        disabled={t.status === "Planned"}
                        onPress={() =>
                            router.push(ROUTES.DASHBOARD_TASK_DETAIL(id) as any)
                        }
                    />
                </View>
            </View> */}
            {checkStatus(t) && (
                <View style={[styles.footer, { bottom: bottom }]}>
                    {/* <View style={{ width: "48%" }}>
                        <ThemedButton
                            title="Mulai Produksi"
                            style={{ marginTop: 10 }}
                            disabled={t.status !== "Planned"}
                            onPress={handleStartCutting}
                            loading={loading}
                        />
                    </View> */}
                    <View style={{ width: "100%" }}>
                        <ThemedButton
                            title="Tambah Batch Produksi"
                            style={{ marginTop: 10 }}
                            disabled={t.status === "Planned"}
                            onPress={() =>
                                router.push(
                                    ROUTES.DASHBOARD_TASK_DETAIL(id) as any
                                )
                            }
                        />
                    </View>
                </View>
            )}
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    btnStart: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        justifyContent: "center",
        width: "35%",
        borderRadius: 6,
        backgroundColor: Color.Green[500],
    },
    footer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        borderTopColor: Color.Gray[400],
        borderTopWidth: 1,
        paddingHorizontal: 16,
        backgroundColor: Color.Base.White,
    },
    viewCard: {
        width: "100%",
        alignSelf: "center",
        borderRadius: 4,
        padding: 16,
        gap: 10,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Base.White,
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    },
});

export default TaskDetailScreen;
