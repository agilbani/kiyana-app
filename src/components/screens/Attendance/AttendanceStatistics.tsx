import { ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { AttendanceStatisticProps } from "@/types/attendance";
import { scale, verticalScale } from "@/utils/scaleSize";
import React from "react";
import { StyleSheet, View } from "react-native";

const AttendanceStatistics: React.FC<AttendanceStatisticProps> = ({ data }) => {
    console.log("cek statistic", data);

    return (
        <View style={[styles.card, GlobalStyles.shadow]}>
            <ThemedText type="SemiBold" size="md">
                Statistik Kehadiran
            </ThemedText>
            <ThemedGap height="sm" />
            <View style={GlobalStyles.rowCenter}>
                <View
                    style={[
                        styles.cardClock,
                        {
                            backgroundColor: Color.Purple[50],
                            borderColor: Color.Purple[400],
                        },
                    ]}
                >
                    <ThemedText type="Bold" size="md">
                        Hadir
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText type="Bold" size="lg" color={Color.Purple[400]}>
                        {data?.Hadir}
                    </ThemedText>
                </View>
                <ThemedGap width="xs" />
                <View
                    style={[
                        styles.cardClock,
                        {
                            backgroundColor: Color.Yellow[50],
                            borderColor: Color.Yellow[400],
                        },
                    ]}
                >
                    <ThemedText type="Bold" size="md">
                        Sakit
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText type="Bold" size="lg" color={Color.Yellow[400]}>
                        {data?.Sakit}
                    </ThemedText>
                </View>
            </View>
            <ThemedGap height="sm" />
            <View style={GlobalStyles.rowCenter}>
                <View
                    style={[
                        styles.cardClock,
                        {
                            backgroundColor: Color.Gray[50],
                            borderColor: Color.Gray[400],
                        },
                    ]}
                >
                    <ThemedText type="Bold" size="md">
                        Izin
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText type="Bold" size="lg" color={Color.Gray[400]}>
                        {data?.Izin}
                    </ThemedText>
                </View>
                <ThemedGap width="xs" />
                <View
                    style={[
                        styles.cardClock,
                        {
                            backgroundColor: Color.Red[50],
                            borderColor: Color.Red[400],
                        },
                    ]}
                >
                    <ThemedText type="Bold" size="md">
                        Alfa
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText type="Bold" size="lg" color={Color.Red[400]}>
                        {data?.Alfa}
                    </ThemedText>
                </View>
            </View>
            <ThemedGap height="sm" />
            <View style={GlobalStyles.rowCenter}>
                <View
                    style={[
                        styles.cardClock,
                        {
                            backgroundColor: Color.Yellow[50],
                            borderColor: Color.Yellow[400],
                        },
                    ]}
                >
                    <ThemedText type="Bold" size="md">
                        Cuti
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText type="Bold" size="lg" color={Color.Red[400]}>
                        {data?.Cuti}
                    </ThemedText>
                </View>
                <ThemedGap width="xs" />
                <View
                    style={[
                        styles.cardClock,
                        {
                            backgroundColor: Color.Red[50],
                            borderColor: Color.Red[400],
                        },
                    ]}
                >
                    <ThemedText type="Bold" size="md">
                        Setengah Hari
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText type="Bold" size="lg" color={Color.Red[400]}>
                        {data?.["Setengah Hari"]}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Color.Button["Surface-Primary"],
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(16),
        borderRadius: scale(8),
        marginHorizontal: scale(12),
        marginBottom: scale(16),
    },
    cardClock: {
        flex: 1,
        padding: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
    },
});

export default React.memo(AttendanceStatistics);
