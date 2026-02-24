import {
    ThemedDropdown,
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { getAbsence } from "@/services/attendanceService";
import GlobalStyles from "@/styles/common";
import { AttendanceDetailAbsence } from "@/types/attendance";
import { scale } from "@/utils/scaleSize";
import { IcCalendar } from "@assets/icons";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const optionType = [
    { label: "Sakit", value: "Sakit" },
    { label: "Izin", value: "Izin" },
    { label: "Cuti", value: "Cuti" },
];

const optionStatus = [
    { label: "Diajukan", value: "Diajukan" },
    { label: "Disetujui", value: "Disetujui" },
    { label: "Ditolak", value: "Ditolak" },
];

const Absence = () => {
    const [historyAbsence, setHistoryAbsence] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [type, setType] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const getColor = (status: string) => {
        let color = "";
        switch (status) {
            case "Disetujui":
                color = Color.Green[500];
                break;
            case "Diajukan":
                color = Color.Yellow[300];
                break;

            default:
                color = Color.Red[500];
                break;
        }
        return color;
    };

    const getDataAbsence = async () => {
        let params = { type_request: "", status: "" };
        if (type) {
            params.type_request = type;
        } else {
            delete (params as any).type_request;
        }
        if (status) {
            params.status = status;
        } else {
            delete (params as any).status;
        }
        setLoading(true);
        const res = await getAbsence(params);
        setLoading(false);
        if (res.success) {
            setHistoryAbsence(res.data);
        }
    };

    useEffect(() => {
        getDataAbsence();
    }, [type, status]);

    return (
        <View style={styles.page}>
            <StatusBar translucent barStyle="dark-content" />
            <ThemedHeader title="Riwayat " />
            <View style={styles.viewRow}>
                <ThemedDropdown
                    label="Tipe pengajuan"
                    value={type}
                    items={optionType}
                    onValueChange={(value) => setType(value)}
                    styleContainer={{ width: "49%" }}
                />
                <ThemedDropdown
                    label="Status pengajuan"
                    value={status}
                    items={optionStatus}
                    onValueChange={(value) => setStatus(value)}
                    styleContainer={{ width: "49%" }}
                />
            </View>
            {loading ? (
                <ThemedLoader />
            ) : (
                <>
                    <ScrollView>
                        {historyAbsence.length > 0 ? (
                            historyAbsence.map(
                                (v: AttendanceDetailAbsence, index) => (
                                    <TouchableOpacity
                                        key={index.toString()}
                                        activeOpacity={0.8}
                                        style={styles.historyCard}
                                        // onPress={() =>
                                        //     router.push(ROUTES.ATTENDANCE_DETAIL(1) as any)
                                        // }
                                    >
                                        <View
                                            style={GlobalStyles.rowSpaceBetween}
                                        >
                                            <ThemedText
                                                type="SemiBold"
                                                size="md"
                                            >
                                                Tanggal Pengajuan
                                            </ThemedText>
                                            <View
                                                style={GlobalStyles.rowCenter}
                                            >
                                                <IcCalendar
                                                    width={16}
                                                    height={16}
                                                    stroke={Color.Purple[500]}
                                                />
                                                <ThemedGap width="xxs" />
                                                <ThemedText
                                                    type="SemiBold"
                                                    size="md"
                                                >
                                                    {moment(v.date).format(
                                                        "DD MMMM YYYY",
                                                    )}
                                                </ThemedText>
                                            </View>
                                        </View>
                                        <ThemedGap height="xs" />
                                        <View
                                            style={GlobalStyles.rowSpaceBetween}
                                        >
                                            <ThemedText
                                                type="SemiBold"
                                                size="md"
                                            >
                                                Alasan Pengajuan
                                            </ThemedText>
                                            <ThemedText>{v.reason}</ThemedText>
                                        </View>
                                        <ThemedGap height="xs" />
                                        <View
                                            style={GlobalStyles.rowSpaceBetween}
                                        >
                                            <ThemedText
                                                type="SemiBold"
                                                size="md"
                                            >
                                                Status Pengajuan
                                            </ThemedText>
                                            <ThemedText
                                                type="SemiBold"
                                                size="md"
                                                color={getColor(v.status ?? "")}
                                            >
                                                {v.status}
                                            </ThemedText>
                                        </View>
                                        {v.rejected_reason && (
                                            <View
                                                style={
                                                    GlobalStyles.rowSpaceBetween
                                                }
                                            >
                                                <ThemedText
                                                    type="SemiBold"
                                                    size="md"
                                                >
                                                    Alasan Penolakan
                                                </ThemedText>
                                                <ThemedText>
                                                    {v.rejected_reason}
                                                </ThemedText>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ),
                            )
                        ) : (
                            <View style={styles.viewEmpty}>
                                <ThemedText>
                                    Belum ada data pengajuan tidak hadir
                                </ThemedText>
                            </View>
                        )}
                    </ScrollView>
                </>
            )}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push(ROUTES.ABSENCE_ADD)}
            >
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    viewEmpty: {
        width: "100%",
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    viewRow: {
        marginTop: 15,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    page: {
        ...GlobalStyles.flex,
        backgroundColor: Color.Base.White,
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    },
    historyCard: {
        backgroundColor: Color.Background.Background,
        paddingVertical: scale(12),
        paddingHorizontal: scale(16),
        borderRadius: scale(8),
        width: "90%",
        alignSelf: "center",
        marginTop: 15,
        ...GlobalStyles.shadow,
    },
    button: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#007AFF",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Absence;
