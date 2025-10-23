import { ThemedBadge, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import {
    getAttendanceButtonType,
    getAttendanceStatus,
    getWorkType,
} from "@/utils/helpher";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const AttendanceScedule = ({
    isHost = false,
    dataShift,
    dataHost,
    setSelectAttendance,
}: any) => {
    return (
        <>
            {isHost ? (
                <CardHost
                    dataHost={dataHost}
                    setSelectAttendance={setSelectAttendance}
                />
            ) : (
                <CardShift dataShift={dataShift} />
            )}
        </>
    );
};

function CardHost({ dataHost, setSelectAttendance }: any) {
    return (
        <View>
            {dataHost.map((v: any, index: any) => (
                <View key={`${index}`} style={styles.viewInfoAttendance}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: Color.Gray[300],
                        }}
                    >
                        <View style={{ gap: 4 }}>
                            <ThemedText
                                size="lg"
                                type="Medium"
                                color={Color.Base.Black}
                            >
                                Schedule {index + 1}
                            </ThemedText>
                            <ThemedText size="sm" color={Color.Text.Secondary}>
                                Jam Kerja {getWorkType(v)}
                            </ThemedText>
                        </View>
                        <ThemedBadge
                            text={getAttendanceStatus(v)}
                            backgroundColor={
                                getAttendanceStatus(v) === "Jadwal mendatang"
                                    ? Color.Yellow[50]
                                    : getAttendanceStatus(v) ===
                                      "Jadwal telah selesai"
                                    ? Color.Gray[50]
                                    : Color.Green[50]
                            }
                            textColor={
                                getAttendanceStatus(v) === "Jadwal mendatang"
                                    ? Color.Yellow[500]
                                    : getAttendanceStatus(v) ===
                                      "Jadwal telah selesai"
                                    ? Color.Gray[500]
                                    : Color.Green[500]
                            }
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <View style={styles.roundedViewIcon}>
                                <FontAwesome6
                                    name="clock"
                                    size={20}
                                    color={Color.Green[500]}
                                />
                            </View>
                            <View style={{ gap: 2 }}>
                                <ThemedText
                                    type="Medium"
                                    color={Color.Text.Primary}
                                >
                                    Clock In
                                </ThemedText>
                                <ThemedText color={Color.Text.Secondary}>
                                    {moment(v.date).format("DD MMMM YYYY")}
                                </ThemedText>
                            </View>
                        </View>
                        <View style={{ gap: 2, alignItems: "flex-end" }}>
                            <ThemedText
                                type="SemiBold"
                                size="lg"
                                color={Color.Text.Primary}
                            >
                                {v.start_time}
                            </ThemedText>
                            {getAttendanceButtonType(v) === "masuk" && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={{
                                        borderRadius: 6,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        backgroundColor: Color.Green[500],
                                    }}
                                    onPress={() => {
                                        setSelectAttendance(v);
                                        setTimeout(() => {
                                            router.push(
                                                ROUTES.ATTENDANCE_CLOCKIN
                                            );
                                        }, 500);
                                    }}
                                >
                                    <ThemedText
                                        type="SemiBold"
                                        size="sm"
                                        color={Color.Base.White}
                                    >
                                        Absen Sekarang
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <View
                                style={[
                                    styles.roundedViewIcon,
                                    {
                                        backgroundColor: Color.Red[50],
                                    },
                                ]}
                            >
                                <FontAwesome6
                                    name="clock"
                                    size={20}
                                    color={Color.Red[500]}
                                />
                            </View>
                            <View style={{ gap: 2 }}>
                                <ThemedText
                                    type="Medium"
                                    color={Color.Text.Primary}
                                >
                                    Clock Out
                                </ThemedText>
                                <ThemedText color={Color.Text.Secondary}>
                                    {moment(v.date).format("DD MMMM YYYY")}
                                </ThemedText>
                            </View>
                        </View>
                        <View style={{ gap: 2, alignItems: "flex-end" }}>
                            <ThemedText
                                type="SemiBold"
                                size="lg"
                                color={Color.Text.Primary}
                            >
                                {v.end_time}
                            </ThemedText>
                            {getAttendanceButtonType(v) === "pulang" && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={{
                                        borderRadius: 6,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        backgroundColor: Color.Green[500],
                                    }}
                                    onPress={() => {
                                        setSelectAttendance(v);
                                        setTimeout(() => {
                                            router.push(
                                                ROUTES.ATTENDANCE_CLOCKIN
                                            );
                                        }, 500);
                                    }}
                                >
                                    <ThemedText
                                        type="SemiBold"
                                        size="sm"
                                        color={Color.Base.White}
                                    >
                                        Absen Sekarang
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

function CardShift({ dataShift }: any) {
    console.log("cek dataShift", dataShift);

    return (
        <View style={styles.viewInfoAttendance}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: Color.Gray[300],
                }}
            >
                <View style={{ gap: 4 }}>
                    <ThemedText
                        size="lg"
                        type="Medium"
                        color={Color.Base.Black}
                    >
                        {dataShift?.name}
                    </ThemedText>
                    <ThemedText size="sm" color={Color.Text.Secondary}>
                        Jam Kerja Regular
                    </ThemedText>
                </View>
                <ThemedBadge
                    text="Aktif"
                    backgroundColor={Color.Green[50]}
                    textColor={Color.Green[500]}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 16,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <View style={styles.roundedViewIcon}>
                        <FontAwesome6
                            name="clock"
                            size={20}
                            color={Color.Green[500]}
                        />
                    </View>
                    <View style={{ gap: 2 }}>
                        <ThemedText type="Medium" color={Color.Text.Primary}>
                            Clock In
                        </ThemedText>
                        <ThemedText color={Color.Text.Secondary}>
                            Schedule Time
                        </ThemedText>
                    </View>
                </View>
                <View style={{ gap: 2, alignItems: "flex-end" }}>
                    <ThemedText
                        type="SemiBold"
                        size="lg"
                        color={Color.Text.Primary}
                    >
                        {dataShift?.start_time}
                    </ThemedText>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 16,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <View
                        style={[
                            styles.roundedViewIcon,
                            {
                                backgroundColor: Color.Red[50],
                            },
                        ]}
                    >
                        <FontAwesome6
                            name="clock"
                            size={20}
                            color={Color.Red[500]}
                        />
                    </View>
                    <View style={{ gap: 2 }}>
                        <ThemedText type="Medium" color={Color.Text.Primary}>
                            Clock Out
                        </ThemedText>
                        <ThemedText color={Color.Text.Secondary}>
                            Schedule Time
                        </ThemedText>
                    </View>
                </View>
                <View style={{ gap: 2, alignItems: "flex-end" }}>
                    <ThemedText
                        type="SemiBold"
                        size="lg"
                        color={Color.Text.Primary}
                    >
                        {dataShift?.end_time}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    roundedViewIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Color.Green[50],
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Color.Base.Black,
    },
    viewInfoAttendance: {
        marginTop: 20,
        backgroundColor: Color.Base.White,
        borderRadius: 12,
        //   padding: 16,
        borderColor: Color.Gray[300],
        borderWidth: 1,
    },
});

export default AttendanceScedule;
