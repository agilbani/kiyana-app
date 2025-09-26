import { ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { AttendanceHeaderProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import ILClockIn from "@assets/images/ILClock.svg";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height: windowHeight } = Dimensions.get("window");
const statusBarHeight = StatusBar.currentHeight;

const AttendanceHeaderHost: React.FC<AttendanceHeaderProps> = ({
    clockInTime,
    clockOutTime,
    onClockInPress,
    attendanceData,
    onClickAbsence,
    user,
}) => {
    const getStatusPresensi = (data: any) => {
        let status;
        if (data.clock_in === null && data.clock_out === null) {
            status = "Belum presensi masuk";
        } else if (data.clock_in && data.clock_out === null) {
            status = "Sudah presensi masuk";
        } else {
            status = "Selesai";
        }
        return status;
    };

    const getColorStatus = (data: any) => {
        let color = Color.Base.Black;
        if (data.clock_in === null && data.clock_out === null) {
            color = Color.Base.Black;
        } else if (data.clock_in && data.clock_out === null) {
            color = Color.Yellow[400];
        } else {
            color = Color.Green[500];
        }
        return color;
    };

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
                </View>
                <View
                    style={[
                        styles.card,
                        GlobalStyles.shadow,
                        { width: "92%", alignSelf: "center" },
                    ]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <ThemedText type="SemiBold" size="md">
                            Presensi Hari Ini
                        </ThemedText>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                backgroundColor:
                                    Color.Button["Background-Primary"],
                            }}
                            onPress={onClickAbsence}
                        >
                            <Text style={{ color: Color.Base.White }}>
                                Ajukan Ijin
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ThemedGap height="sm" />
                    <FlatList
                        data={attendanceData ? attendanceData : []}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }): any => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.cards,
                                    { marginTop: index === 0 ? 0 : 15 },
                                ]}
                                onPress={() => onClockInPress(item)}
                            >
                                <View style={styles.item}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>
                                            Waktu Masuk
                                        </Text>
                                        <Text style={styles.label}>:</Text>
                                    </View>
                                    <View style={styles.rowEnd}>
                                        <Text
                                            style={[
                                                styles.value,
                                                {
                                                    color: item.clock_in
                                                        ? Color.Green[500]
                                                        : Color.Base.Black,
                                                },
                                            ]}
                                        >
                                            {item.start_time}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>
                                            Waktu Pulang
                                        </Text>
                                        <Text style={styles.label}>:</Text>
                                    </View>
                                    <View style={styles.rowEnd}>
                                        <Text
                                            style={[
                                                styles.value,
                                                {
                                                    color: item.clock_out
                                                        ? Color.Green[500]
                                                        : Color.Base.Black,
                                                },
                                            ]}
                                        >
                                            {item.end_time}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.item}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Status</Text>
                                        <Text style={styles.label}>:</Text>
                                    </View>
                                    <View style={styles.rowEnd}>
                                        <Text
                                            style={[
                                                styles.value,
                                                {
                                                    color: getColorStatus(item),
                                                },
                                            ]}
                                        >
                                            {getStatusPresensi(item)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <ThemedGap height="sm" />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    rowEnd: {
        width: "70%",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    row: {
        width: "30%",
        // backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    viewTime: {
        width: "100%",
        backgroundColor: Color.Gray[300],
        padding: 10,
        gap: 5,
        borderRadius: 4,
    },
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
    cards: {
        backgroundColor: "#E5E7EB", // gray-200
        padding: 16,
        borderRadius: 12,
    },
    item: {
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 12,
        color: "#4B5563", // gray-600
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
    },
    status: {
        fontSize: 16,
        fontWeight: "500",
        color: "#047857", // green-700
    },
});

export default React.memo(AttendanceHeaderHost);
