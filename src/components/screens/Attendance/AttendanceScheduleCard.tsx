import { ThemedBadge, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const AttendanceScedule = ({ isHost = false, dataShift, dataHost }: any) => {
    return <>{isHost ? <CardHost /> : <CardShift dataShift={dataShift} />}</>;
};

function CardHost() {
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
                        Schedule 1
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
                        08:00
                    </ThemedText>
                    <ThemedText color={Color.Text.Secondary}>
                        Belum Absensi
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
                        08:00
                    </ThemedText>
                    <ThemedText color={Color.Text.Secondary}>
                        Belum Waktunya Absensi
                    </ThemedText>
                </View>
            </View>
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
