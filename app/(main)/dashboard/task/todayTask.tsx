import {
    CustomDropdown,
    ThemedBadge,
    ThemedGap,
    ThemedHeader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { optionsDate, optionsStatus } from "@/constants/Dummy/Options";
import { MENU_PERMISSION } from "@/constants/Permission";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getTasksByDate } from "@/services/taskService";
import GlobalStyles from "@/styles/common";
import { getColorByDateDifference } from "@/utils/getColorStatus";
import { getDateRange, hasMenuAccess } from "@/utils/helpher";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcActiveCalendar, IcFaster } from "@assets/index";
import { router } from "expo-router";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const getColor = (status: string) => {
    let bgColor = "";
    switch (status) {
        case "Planned":
            bgColor = Color.Yellow[500];
            break;
        case "Processed":
            bgColor = Color.SemanticBlue[500];
            break;
        default:
            bgColor = Color.Green[500];
            break;
    }
    return bgColor;
};

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
                    {`${item.product_metadata?.materials[0]?.name}`}
                </ThemedText>
            </View>
            <ThemedGap height="sm" />
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    alignItems: "center",
                    gap: 6,
                }}
            >
                <ThemedText
                    type="Medium"
                    size="xs"
                    color={Color.Text.Secondary}
                >
                    Status:
                </ThemedText>
                <ThemedBadge
                    text={
                        item.status === "Planned"
                            ? "Terjadwal"
                            : item.status === "Processed"
                              ? "Diproses"
                              : "Selesai"
                    }
                    textColor={Color.Base.White}
                    backgroundColor={getColor(item.status)}
                />
                <ThemedGap height="xs" />
            </View>
            <View style={GlobalStyles.rowSpaceBetween}>
                {item.deadline ? (
                    <View
                        style={[
                            styles.deadlineWrapper,
                            {
                                borderWidth: 1,
                                borderColor: getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD",
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD"),
                                ).color,
                                backgroundColor: getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD",
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD"),
                                ).color,
                            },
                        ]}
                    >
                        <IcActiveCalendar
                            width={16}
                            height={16}
                            //  stroke={Color.Gray[500]}
                            stroke={Color.Base.White}
                        />
                        <ThemedGap width="xxs" />
                        <ThemedText
                            type="Medium"
                            size="xs"
                            color={
                                getColorByDateDifference(
                                    moment(item.deadline * 1000).format(
                                        "YYYY-MM-DD",
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD"),
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
                                        "YYYY-MM-DD",
                                    ),
                                    moment(new Date()).format("YYYY-MM-DD"),
                                ).fontColor
                            }
                        >
                            {moment(item.deadline * 1000).format(
                                "YYYY-MM-DD HH:mm",
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

const TodayTask = () => {
    const { user } = useApp();
    const [status, setStatus] = useState("semua");
    const [loading, setLoading] = useState<boolean>(false);
    const [listTask, setListTask] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [rangeDate, setRangeDate] = useState("today");

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
        [],
    );

    const getTask = async () => {
        setLoading(true);
        const dateRange = getDateRange(rangeDate);
        try {
            const tasks = await getTasksByDate(
                dateRange.startDate,
                dateRange.endDate,
                status === "semua" ? "" : status,
                "productions/plans",
            );
            setLoading(false);
            // console.log("res task", tasks.data);
            setListTask(tasks.data);
            setRefreshing(false);
        } catch (err) {
            setLoading(false);
            setRefreshing(false);
            // console.error("Failed to fetch tasks", err);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing((prev) => !prev);
    }, []);

    useEffect(() => {
        getTask();
    }, [status, rangeDate, refreshing]);

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.TODAY_TASK)) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    //  console.log("listTask", listTask);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.Base.White,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <ThemedHeader title="Produksi Hari ini" />
            <View style={{ padding: 15 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{ width: "49%" }}>
                        <CustomDropdown
                            items={optionsDate}
                            onSelectItem={(item) => setRangeDate(item.value)}
                            value={rangeDate}
                            label="Rentang Tanggal"
                        />
                    </View>
                    <View style={{ width: "49%" }}>
                        <CustomDropdown
                            items={optionsStatus}
                            placeholderText="Pilih status"
                            onSelectItem={(item) => setStatus(item.value)}
                            value={status}
                            label="Status Produksi"
                        />
                    </View>
                </View>
            </View>
            <FlatList
                data={listTask}
                contentContainerStyle={{ padding: 15, gap: 15 }}
                renderItem={renderTaskItem}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <ThemedGap height="sm" />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
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
                                Belum ada jadwal produksi hari ini
                            </ThemedText>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    taskWrapper: {
        backgroundColor: Color.Base.White,
        paddingTop: scale(12),
        paddingHorizontal: scale(12),
        borderWidth: 1,
        borderColor: Color.Gray[200],
        borderRadius: Radius.xs,
        elevation: 2,
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
    page: {
        flex: 1,
        backgroundColor: Color.Gray[50],
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    },
});

export default TodayTask;
