import { ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import {
    getCurrentAttendance,
    getMyAttendance,
} from "@/services/attendanceService";
import GlobalStyles from "@/styles/common";
import { Attendance } from "@/types/attendance";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { IcCalendar } from "@assets/icons";
import { ListRenderItem } from "@shopify/flash-list";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AttendancePage from "./attendanceScreen";

const renderHistoryListItem: ListRenderItem<any> = ({ item }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.historyCard}
            onPress={() =>
                router.push(ROUTES.ATTENDANCE_DETAIL(item.id) as any)
            }
        >
            <View style={GlobalStyles.rowCenter}>
                <IcCalendar width={16} height={16} stroke={Color.Purple[500]} />
                <ThemedGap width="xxs" />
                <ThemedText type="SemiBold" size="md">
                    {moment(item?.date).format("DD MMMM YYYY")}
                </ThemedText>
            </View>
            <ThemedGap height="xs" />
            <View style={styles.historyCardClockDetail}>
                <View style={GlobalStyles.flex}>
                    <ThemedText
                        type="Medium"
                        size="sm"
                        color={Color.Text.Secondary}
                    >
                        Status
                    </ThemedText>
                    <ThemedText type="Medium" size="md" color={Color.Text.Body}>
                        {item.status}
                    </ThemedText>
                </View>
                <View style={GlobalStyles.flex}>
                    <ThemedText
                        type="Medium"
                        size="sm"
                        color={Color.Text.Secondary}
                    >
                        Clock in & Out
                    </ThemedText>
                    <ThemedText type="Medium" size="md" color={Color.Text.Body}>
                        {item.clock_in} — {item.clock_out ?? "--:--"}
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const renderHistoryHeader = () => {
    return (
        <View>
            <ThemedText type="SemiBold" size="md">
                Riyawat Absensi
            </ThemedText>
            <ThemedGap height="sm" />
        </View>
    );
};

const HistoryItemSeparator = () => <ThemedGap height="md" />;

const AttendanceScreen = () => {
    const { saveAttendance, user, setSelectAttendance, attendance } = useApp();
    const [statistic, setStatistic] = useState<any>(null);
    const [histories, setHistories] = useState<any[]>([]);
    const [dataAttendance, setDataAttendence] = useState<Attendance>();
    const [loadingStatistic, setLoadingStatistic] = useState<boolean>(false);

    const start = moment().startOf("month").format("YYYY-MM-DD");
    const end = moment().format("YYYY-MM-DD");

    const handleClockIn = useCallback(async (data: any) => {
        setSelectAttendance(data);
        router.push(ROUTES.ATTENDANCE_CLOCKIN);
    }, []);
    const handleAbsence = () => {
        router.push(ROUTES.ABSENCE_HISTORY);
    };

    const getDataAttendence = async () => {
        let res = null;
        if (user?.is_host) {
            res = await getCurrentAttendance("host");
        } else {
            res = await getCurrentAttendance("shifted");
        }
        //   console.log("res attendance", res);
        if (res) {
            if (res.success && res?.data) {
                setDataAttendence(res.data);
                saveAttendance(res.data);
            } else {
                ShowToastMessage(res.message);
            }
        }
    };

    const getHistoryAttendance = async () => {
        setLoadingStatistic(true);
        const res = await getMyAttendance(start, end);
        //   console.log("cek my attendance", res);
        setLoadingStatistic(false);
        if (res.success) {
            setStatistic(res.data.statistic);
            setHistories(res.data.histories);
        } else {
            ShowToastMessage(res.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            // getDataAttendence();
            // getHistoryAttendance();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    return (
        <AttendancePage />
        //   <View style={styles.page}>
        //       {user?.is_host ? (
        //           <AttendanceHeaderHost
        //               clockInTime={dataAttendance?.start_time}
        //               clockOutTime={dataAttendance?.end_time}
        //               onClockInPress={(data: any) => handleClockIn(data)}
        //               attendanceData={dataAttendance}
        //               onClickAbsence={handleAbsence}
        //               user={user ? user : undefined}
        //           />
        //       ) : (
        //           <AttendanceHeader
        //               clockInTime={user?.shift?.start_time}
        //               clockOutTime={user?.shift?.end_time}
        //               onClockInPress={handleClockIn}
        //               attendanceData={dataAttendance}
        //               onClickAbsence={handleAbsence}
        //               user={user ? user : undefined}
        //           />
        //       )}
        //       {loadingStatistic ? (
        //           <ThemedLoader />
        //       ) : (
        //           <ScrollView>
        //               <AttendanceStatistics data={statistic} />
        //               <FlashList
        //                   scrollEnabled={false}
        //                   data={histories}
        //                   keyExtractor={(_, index) => index.toString()}
        //                   renderItem={renderHistoryListItem}
        //                   estimatedItemSize={130}
        //                   contentContainerStyle={styles.contentContainer}
        //                   ItemSeparatorComponent={HistoryItemSeparator}
        //                   ListHeaderComponent={renderHistoryHeader}
        //               />
        //           </ScrollView>
        //       )}
        //   </View>
    );
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.flex,
    },
    contentContainer: {
        paddingBottom: verticalScale(24),
        paddingHorizontal: scale(12),
    },
    historyCard: {
        backgroundColor: Color.Background.Background,
        paddingVertical: scale(12),
        paddingHorizontal: scale(16),
        borderRadius: scale(8),
        ...GlobalStyles.shadow,
    },
    historyCardClockDetail: {
        ...GlobalStyles.rowCenter,
        backgroundColor: Color.Gray[100],
        padding: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: Color.Gray[200],
    },
});

export default AttendanceScreen;
