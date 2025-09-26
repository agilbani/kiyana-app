import {
    CustomDropdown,
    ThemedBadge,
    ThemedGap,
    ThemedInput,
    ThemedLoader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { getListProduction, getTasksByDate } from "@/services/taskService";
import GlobalStyles from "@/styles/common";
import { User } from "@/types/auth";
import { getColorByDateDifference } from "@/utils/getColorStatus";
import { getStatusBatch } from "@/utils/getStatusBatch";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcActiveCalendar, IcFaster, IcScan } from "@assets/icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const optionStatus = [
    { name: "Terjadwal", value: "Planned" },
    { name: "Dalam Proses", value: "Processed" },
    { name: "Selesai", value: "Finished" },
];

const Item: any = Picker.Item;

interface DashboardTodayTaskProps {
    user: User | null;
    refresh: boolean;
}

const TaskItem = React.memo(({ item, onPress }: any) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.taskWrapper}
            onPress={onPress}
        >
            <View style={GlobalStyles.rowCenter}>
                <IcFaster />
                <ThemedGap width="xs" />
                <ThemedText type="Medium" size="md" style={GlobalStyles.flex}>
                    {/* {`${item.orderName} (${item.quantity} pcs)`} */}
                    {`${item.product_metadata?.name}`} -{" "}
                    {`${item.product_metadata?.material?.name}`}
                </ThemedText>
            </View>
            <ThemedGap height="sm" />
            <ThemedText type="Medium" size="xs" color={Color.Text.Secondary}>
                Status: {item.status}
            </ThemedText>
            <ThemedGap height="xs" />
            <View style={GlobalStyles.rowSpaceBetween}>
                {item.deadline ? (
                    <View
                        style={[
                            styles.deadlineWrapper,
                            {
                                borderWidth: 1,
                                borderColor: getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD"
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD")
                                ).color,
                                backgroundColor: getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD"
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD")
                                ).color,
                            },
                        ]}
                    >
                        <IcActiveCalendar
                            width={16}
                            height={16}
                            stroke={Color.Gray[500]}
                        />
                        <ThemedGap width="xxs" />
                        <ThemedText
                            type="Medium"
                            size="xs"
                            color={
                                getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD"
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD")
                                ).fontColor
                            }
                        >
                            Deadline:
                        </ThemedText>
                        <ThemedGap width="xs" />
                        <ThemedText
                            type="SemiBold"
                            size="xs"
                            color={
                                getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD"
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD")
                                ).fontColor
                            }
                        >
                            {moment(item.deadline * 1000).format(
                                "YYYY-MM-DD HH:mm"
                            )}
                        </ThemedText>
                    </View>
                ) : (
                    <View />
                )}
                <ThemedBadge
                    text={item.product_metadata?.level}
                    backgroundColor={
                        item.product_metadata?.level === "SULIT"
                            ? Color.Red[500]
                            : Color.Green[500]
                    }
                    textColor={Color.Base.White}
                />
            </View>
        </TouchableOpacity>
    );
});

const DashboardTodayTask: React.FC<DashboardTodayTaskProps> = ({
    user,
    refresh,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [listTask, setListTask] = useState<any>([]);
    const [listProduction, setListProduction] = useState<any>([]);
    const [loadingStartTask, setLoadingStartTask] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [batchNumber, setBatchNumber] = useState<string>("");
    const [showPicker, setShowPicker] = useState(false);

    const renderTaskItem = useCallback(
        ({ item }: any) => (
            <TaskItem
                item={item}
                onPress={() => {
                    router.push({
                        pathname: ROUTES.DASHBOARD_DETAIL_TASK,
                        params: { id: item.code },
                    });
                }}
            />
        ),
        []
    );

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
                        Jumlah produksi
                    </ThemedText>
                    <ThemedText>{`${item.qty} ${item.item.unit}`}</ThemedText>
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

    async function getTask() {
        setStatus("Planned");
        setLoading(true);
        try {
            const tasks = await getTasksByDate(
                moment(new Date()).format("YYYY-MM-DD"),
                moment(new Date()).format("YYYY-MM-DD"),
                status ?? "Planned"
            );
            setLoading(false);
            console.log("res task", tasks);
            setListTask(tasks);
        } catch (err) {
            setLoading(false);
            console.error("Failed to fetch tasks", err);
        }
    }

    const getProductionList = async () => {
        setLoading(true);
        let payload = {};
        try {
            if (user?.role?.name === "Penjahit") {
                payload.needSewn = true;
            } else {
                payload.needFinishing = true;
            }
            const tasks = await getListProduction(payload);
            setLoading(false);
            console.log("res production", tasks);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            let filter = tasks.filter((item) => {
                const cuttingDate = new Date(item.cutting_at);
                return cuttingDate >= yesterday;
            });
            console.log("data filtered", filter);
            setListProduction(filter);
        } catch (err) {
            setLoading(false);
            console.error("Failed to fetch tasks", err);
        }
    };

    async function checkBatchNumber() {
        router.push({
            pathname: ROUTES.DASHBOARD_DETAIL_PRODUCTION,
            params: { id: batchNumber },
        });
    }

    useEffect(() => {
        if (user?.role?.name == "Tukang Potong") {
            getTask();
        } else {
            getProductionList();
        }
    }, [status, refresh]);

    return (
        <>
            <View style={styles.card}>
                {loadingStartTask && <ThemedLoader />}
                {user?.role?.name !== "Tukang Potong" && (
                    <View style={{ flexDirection: "column", gap: 8 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                                justifyContent: "space-between",
                            }}
                        >
                            <View style={{ width: "65%" }}>
                                <ThemedInput
                                    icon={<IcScan />}
                                    label="Nomor Batch"
                                    placeholder="Masukkan Nomor Batch"
                                    value={batchNumber}
                                    onChangeText={(text) =>
                                        setBatchNumber(text)
                                    }
                                    editable={!loading}
                                    style={{
                                        height: 45,
                                        width: "100%",
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.btnCheck,
                                    loading && {
                                        backgroundColor: Color.Gray[300],
                                    },
                                ]}
                                onPress={checkBatchNumber}
                            >
                                <ThemedText size="sm" color={Color.Base.White}>
                                    Mulai Produksi
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btnScan}
                            onPress={() =>
                                router.push(ROUTES.DASHBOARD_SCAN_BATCH)
                            }
                        >
                            <IcScan />
                            <ThemedText size="md">
                                Scan untuk memulai tugas anda
                            </ThemedText>
                        </TouchableOpacity>
                        {user?.role?.name === "Spv Gudang" ||
                            (user?.role?.name === "Staff Gudang" && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btnScan}
                                    onPress={() =>
                                        router.push(
                                            ROUTES.DASHBOARD_ASSIGN_SEWN
                                        )
                                    }
                                >
                                    <IcScan />
                                    <ThemedText size="md">
                                        Tambahkan tugas untuk penjahit
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                    </View>
                )}
                {user?.role?.name !== "Spv Gudang" &&
                    user?.role?.name !== "Staff Gudang" && (
                        <>
                            <ThemedGap height="xxl" />
                            <View style={GlobalStyles.rowSpaceBetween}>
                                <View style={GlobalStyles.rowCenter}>
                                    <ThemedText type="SemiBold">
                                        Tugas hari ini
                                    </ThemedText>
                                    <ThemedGap width="xxs" />
                                    <View style={styles.countWrapper}>
                                        <ThemedText
                                            type="SemiBold"
                                            size="sm"
                                            color={Color.Purple[500]}
                                        >
                                            {listTask.length}
                                        </ThemedText>
                                    </View>
                                </View>
                                {user?.role?.name !== "Tukang Potong" && (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() =>
                                            router.push(
                                                ROUTES.DASHBOARD_ALL_TASK_PRODUCTION
                                            )
                                        }
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Color.Yellow[200],
                                            borderRadius: 6,
                                            paddingVertical: 4,
                                            paddingHorizontal: 8,
                                            backgroundColor: Color.Yellow[200],
                                        }}
                                    >
                                        <ThemedText
                                            size="md"
                                            type="SemiBold"
                                            color={Color.Text.Action}
                                        >
                                            Lihat semua tugas
                                        </ThemedText>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {user?.role?.name === "Tukang Potong" && (
                                <CustomDropdown
                                    label="Status Produksi"
                                    value={status}
                                    items={optionStatus}
                                    onSelectItem={(value: any) =>
                                        setStatus(value.value)
                                    }
                                />
                            )}
                            <ThemedGap height="md" />
                            {loading ? (
                                <ThemedLoader />
                            ) : (
                                <FlatList
                                    data={
                                        user?.role?.name === "Tukang Potong"
                                            ? listTask
                                            : listProduction
                                    }
                                    renderItem={
                                        user?.role?.name === "Tukang Potong"
                                            ? renderTaskItem
                                            : renderProductionItem
                                    }
                                    scrollEnabled={false}
                                    keyExtractor={(item, index) =>
                                        index.toString()
                                    }
                                    ItemSeparatorComponent={() => (
                                        <ThemedGap height="sm" />
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    // maxToRenderPerBatch={1}
                                    // windowSize={10}
                                    removeClippedSubviews={
                                        Platform.OS === "android"
                                    }
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
                                                    Belum ada jadwal produksi
                                                    hari ini
                                                </ThemedText>
                                            </View>
                                        );
                                    }}
                                />
                            )}
                        </>
                    )}
            </View>
        </>
    );
};

export default React.memo(DashboardTodayTask);

const styles = StyleSheet.create({
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
    btnCheck: {
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: Color.Green[500],
    },
    container: {
        margin: 16,
    },
    iconWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
    },
    selectedText: {
        fontSize: 16,
        color: "#333",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    pickerWrapper: {
        backgroundColor: "#fff",
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    card: {
        //   minHeight: Dimensions.get("window").height * 0.35,
        backgroundColor: Color.Base.White,
        paddingHorizontal: scale(16),
        paddingVertical: scale(15),
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
    btnScan: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.Border.Purple,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
});
