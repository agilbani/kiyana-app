import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { getMyOvertime } from "@/services/overtimeService";
import GlobalStyles from "@/styles/common";
import LoadingManager from "@/utils/LoadingManager";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface Periode {
    start: string;
    end: string;
    start_formatted: string;
    end_formatted: string;
}

interface Totals {
    overtime_amount: number;
    overtime_amount_formatted: string;
    overtime_days: number;
    overtime_hours: number;
}

interface SummaryData {
    overtime_fee_per_hour: string;
    overtime_fee_per_hour_formatted: string;
    period: Periode;
    totals: Totals;
}

interface Summary {
    overtime_data: any;
    summary: SummaryData;
}

const OvertimeHistory = () => {
    const [dataOvertime, setDataOvertime] = useState<Summary>();
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        LoadingManager.show();
        const res = await getMyOvertime();
        LoadingManager.hide();
        console.log("res overtime", res);
        if (res.success) {
            setDataOvertime(res.data);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    console.log("cek detail", dataOvertime);

    return (
        <ThemedContainer>
            <ThemedHeader title="Aktifitas Lembur" />
            <View style={{ flex: 1, padding: 16 }}>
                {/**CARD PERIODE */}
                <View style={styles.cardRounded}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <View style={styles.roundedIcon}>
                            <MaterialIcons
                                size={20}
                                name="date-range"
                                color="blue"
                            />
                        </View>
                        <ThemedText size="lg" type="Bold">
                            Periode
                        </ThemedText>
                    </View>
                    <View style={styles.rowDate}>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Text.Secondary}
                        >
                            Start Date
                        </ThemedText>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Text.Primary}
                        >
                            {dataOvertime?.summary?.period?.start_formatted}
                        </ThemedText>
                    </View>
                    <View style={styles.rowDate}>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Text.Secondary}
                        >
                            End Date
                        </ThemedText>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Text.Primary}
                        >
                            {dataOvertime?.summary?.period?.end_formatted}
                        </ThemedText>
                    </View>
                    <View style={styles.rowDate}>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Text.Secondary}
                        >
                            Pendapatan Perjam
                        </ThemedText>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Text.Primary}
                        >
                            {
                                dataOvertime?.summary
                                    ?.overtime_fee_per_hour_formatted
                            }
                        </ThemedText>
                    </View>
                </View>

                {/** Card Overtime */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                >
                    {/**CARD PERIODE */}
                    <View style={styles.cardAmount}>
                        <View style={{ gap: 12 }}>
                            <ThemedText color={Color.Base.White}>
                                Total Pendapatan
                            </ThemedText>
                            <ThemedText
                                size="lg"
                                type="SemiBold"
                                color={Color.Base.White}
                            >
                                {
                                    dataOvertime?.summary?.totals
                                        ?.overtime_amount_formatted
                                }
                            </ThemedText>
                        </View>
                        <View style={styles.roundIconMoney}>
                            <FontAwesome6
                                name="money-bill-1-wave"
                                color={Color.Base.White}
                                size={18}
                            />
                        </View>
                    </View>
                    {/** Info Overtime */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={styles.cardInfo}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <View
                                    style={[
                                        styles.roundedIcon,
                                        {
                                            backgroundColor: Color.Purple[200],
                                        },
                                    ]}
                                >
                                    <FontAwesome5
                                        name="clock"
                                        size={18}
                                        color={Color.Purple[500]}
                                    />
                                </View>
                                <ThemedText color={Color.Base.Black}>
                                    Total Jam
                                </ThemedText>
                            </View>
                            <ThemedText type="SemiBold" size="lg">
                                {dataOvertime?.summary?.totals.overtime_hours}{" "}
                                Jam
                            </ThemedText>
                        </View>
                        <View style={styles.cardInfo}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <View
                                    style={[
                                        styles.roundedIcon,
                                        {
                                            backgroundColor: Color.Purple[200],
                                        },
                                    ]}
                                >
                                    <FontAwesome5
                                        name="calendar-check"
                                        size={18}
                                        color={Color.Purple[500]}
                                    />
                                </View>
                                <ThemedText color={Color.Base.Black}>
                                    Total Hari
                                </ThemedText>
                            </View>
                            <ThemedText type="SemiBold" size="lg">
                                {dataOvertime?.summary?.totals.overtime_days}{" "}
                                Hari
                            </ThemedText>
                        </View>
                    </View>
                    {dataOvertime?.overtime_data.map((v: any, index: any) => (
                        <TouchableOpacity
                            key={`${index}`}
                            activeOpacity={1}
                            style={[styles.cardItem, { marginTop: 12 }]}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingBottom: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.Gray[200],
                                }}
                            >
                                <View style={{ gap: 4 }}>
                                    <ThemedText type="SemiBold">
                                        {moment(v.date).format("dddd")}
                                    </ThemedText>
                                    <ThemedText color={Color.Text.Secondary}>
                                        {moment(v.date).format("MMM DD, YYYY")}
                                    </ThemedText>
                                </View>
                                <ThemedText color={Color.Green[500]}>
                                    {v.status}
                                </ThemedText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: 12,
                                }}
                            >
                                <ThemedText
                                    color={Color.Text.Secondary}
                                    type="Medium"
                                >
                                    Total Durasi Lembur
                                </ThemedText>
                                <ThemedText
                                    color={Color.Text.Primary}
                                    type="Medium"
                                >
                                    {v.overtime_hours} Jam
                                </ThemedText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    cardItem: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Color.Gray[200],
        padding: 16,
        elevation: 2,
        backgroundColor: Color.Base.White,
    },
    roundIconMoney: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    cardInfo: {
        width: "49%",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        padding: 16,
        gap: 12,
    },
    cardAmount: {
        borderRadius: 12,
        backgroundColor: Color.Green[500],
        padding: 16,
        marginVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowDate: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Color.Gray[200],
    },
    cardRounded: {
        width: "100%",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        backgroundColor: Color.Base.White,
        ...GlobalStyles.shadow,
    },
    roundedIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.SemanticBlue[200],
    },
});

export default OvertimeHistory;
