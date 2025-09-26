import { ThemedButton, ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { AttendanceHeaderProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcClock } from "@assets/icons";
import ILClockIn from "@assets/images/ILClock.svg";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";

const { height: windowHeight } = Dimensions.get("window");
const statusBarHeight = StatusBar.currentHeight;

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
    clockInTime,
    clockOutTime,
    onClockInPress,
    attendanceData,
    onClickAbsence,
    user,
}) => {
    console.log("cek attendanceData shift", attendanceData);

    return (
        <View style={styles.header}>
            <LinearGradient
                colors={[
                    Color.Background.HeaderTopGradient,
                    Color.Background.HeaderBottomGradient,
                ]}
                locations={[0, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.backgroundHeader}
            >
                <View style={styles.headerContent}>
                    <View style={GlobalStyles.rowSpaceBetween}>
                        <View style={styles.headerTextContainer}>
                            <ThemedText
                                type="SemiBold"
                                size="xl"
                                color={Color.Base.White}
                            >
                                Ayo, Catat Kehadiran!
                            </ThemedText>
                            <ThemedText
                                type="Medium"
                                size="md"
                                color={Color.Purple[200]}
                            >
                                Patuhi jadwal yang telah ditentukan.
                            </ThemedText>
                        </View>
                        <ILClockIn width={scale(80)} height={scale(80)} />
                    </View>
                    <ThemedGap height="sm" />
                    <View
                        style={[
                            styles.card,
                            GlobalStyles.shadow,
                            { zIndex: 1 },
                        ]}
                    >
                        <ThemedText type="SemiBold" size="md">
                            Presensi Hari Ini
                        </ThemedText>
                        {/* <ThemedText
                            type="Regular"
                            size="sm"
                            color={Color.Text.Secondary}
                        >
                            Periode: 1 Juni 2025 - 30 Juni 2025
                        </ThemedText> */}
                        <ThemedGap height="sm" />
                        <View style={GlobalStyles.rowCenter}>
                            <View style={styles.cardClock}>
                                <View style={GlobalStyles.rowCenter}>
                                    <IcClock />
                                    <ThemedGap width="xxs" />
                                    <ThemedText
                                        type="Medium"
                                        size="sm"
                                        color={Color.Text.Secondary}
                                        style={GlobalStyles.flex}
                                    >
                                        Waktu Masuk
                                    </ThemedText>
                                </View>
                                <ThemedGap height="xs" />
                                <ThemedText size="xl">
                                    {clockInTime ?? "--:--"}
                                </ThemedText>
                            </View>
                            <ThemedGap width="xs" />
                            <View style={styles.cardClock}>
                                <View style={GlobalStyles.rowCenter}>
                                    <IcClock />
                                    <ThemedGap width="xxs" />
                                    <ThemedText
                                        type="Medium"
                                        size="sm"
                                        color={Color.Text.Secondary}
                                        style={GlobalStyles.flex}
                                    >
                                        Waktu Pulang
                                    </ThemedText>
                                </View>
                                <ThemedGap height="xs" />
                                <ThemedText size="xl">
                                    {clockOutTime ?? "--:--"}
                                </ThemedText>
                            </View>
                        </View>
                        <ThemedGap height="sm" />
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    width: "48%",
                                    height: 50,
                                }}
                            >
                                <ThemedButton
                                    title={
                                        attendanceData === undefined
                                            ? "Absen Masuk"
                                            : "Absen Pulang"
                                    }
                                    onPress={onClockInPress}
                                    disabled={
                                        attendanceData === undefined
                                            ? false
                                            : attendanceData?.lat_in !== null &&
                                              attendanceData?.lat_out !== null
                                    }
                                    style={{ width: "100%" }}
                                />
                            </View>
                            <View
                                style={{
                                    width: "48%",
                                    height: 50,
                                }}
                            >
                                <ThemedButton
                                    title={"Ajukan Ijin"}
                                    onPress={onClickAbsence}
                                    style={{ width: "100%" }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        // height: windowHeight * 0.5,
        // flex: 0.1,
        paddingBottom: 10,
    },
    backgroundHeader: {
        // height: windowHeight * 0.276,
        paddingBottom: 10,
        minHeight: verticalScale(224),
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    headerContent: {
        paddingTop: statusBarHeight
            ? statusBarHeight + verticalScale(12)
            : verticalScale(24),
        paddingHorizontal: scale(12),
    },
    headerTextContainer: {
        flex: 1,
        paddingLeft: scale(16),
    },
    card: {
        backgroundColor: Color.Button["Surface-Primary"],
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(16),
        borderRadius: scale(8),
    },
    cardClock: {
        flex: 1,
        backgroundColor: Color.Gray[100],
        padding: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: Color.Gray[200],
    },
});

export default React.memo(AttendanceHeader);
