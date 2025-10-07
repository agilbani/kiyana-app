import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ClockInIcon, ClockOutIcon } from "@assets/index";
import React from "react";
import { StyleSheet, View } from "react-native";

const AttendanceScedule = () => {
    return (
        <View style={styles.viewInfoAttendance}>
            <ThemedText size="md" type="Medium" color={Color.Green[500]}>
                Jadwal kamu hari ini
            </ThemedText>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 15,
                    marginTop: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <ClockOutIcon width={17} height={17} />
                    <ThemedText size="xxl" color={Color.Green[500]}>
                        08:00
                    </ThemedText>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <ThemedText size="xxl" color={Color.Green[500]}>
                        17:00
                    </ThemedText>
                    <ClockInIcon width={17} height={17} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        paddingVertical: 14,
        justifyContent: "center",
        alignItems: "center",
        borderColor: Color.Gray[300],
        borderWidth: 1,
    },
});

export default AttendanceScedule;
