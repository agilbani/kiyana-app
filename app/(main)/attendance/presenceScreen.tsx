import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { getMyAttendance } from "@/services/attendanceService";
import { Attendance } from "@/types/attendance";
import { getDateRange } from "@/utils/helpher";
import { FontAwesome6 } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface Statistic {
    Hadir: number;
    "Setengah Hari": number;
    Sakit: number;
    Izin: number;
    Cuti: number;
    Alfa: number;
}

interface History {
    data: string;
    items: Attendance[];
}

interface Summary {
    statistic: Statistic;
    histories: Attendance[];
}

const optionType = [
    { name: "Hari Ini", value: "today" },
    { name: "7 hari", value: "weekly" },
    { name: "14 hari", value: "biweekly" },
    { name: "21 hari", value: "threeweeks" },
    { name: "30 hari", value: "month" },
];

const PresenceScreen = () => {
    const [filter, setFilter] = useState<string>("today");
    const [dataSummary, setDataSummary] = useState<Summary>();
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const { startDate, endDate } = getDateRange(filter);
        //   console.log("cek startDate", startDate);
        //   console.log("cek endDate", endDate);
        const res = await getMyAttendance(startDate, endDate);
        //   console.log("res absen", res);

        setLoading(false);
        if (res.success) {
            setDataSummary(res.data);
        }
    };

    useEffect(() => {
        getData();
    }, [filter]);

    return (
        <ThemedContainer>
            <View style={styles.page}>
                <ThemedHeader title="Daftar Kehadiran" />
                <View style={{ flex: 1, padding: 16 }}>
                    <View
                        style={{
                            gap: 12,
                            width: "100%",
                        }}
                    >
                        <ThemedText type="Medium" size="md">
                            Daftar Kehadiran Anda
                        </ThemedText>
                        <FlatList
                            data={optionType}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 10 }}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={{ flexDirection: "row" }}
                                    onPress={() => setFilter(item.value)}
                                >
                                    <View
                                        style={[
                                            styles.itemFilter,
                                            item.value === filter && {
                                                borderColor: Color.Red[500],
                                                backgroundColor: Color.Red[50],
                                            },
                                        ]}
                                    >
                                        <ThemedText size="md" type="Medium">
                                            {item.name}
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {dataSummary?.histories.map((v: any, index: any) => (
                            <TouchableOpacity
                                key={`${v.id}`}
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
                                        <ThemedText
                                            color={Color.Text.Secondary}
                                        >
                                            {moment(v.date).format(
                                                "MMM DD, YYYY",
                                            )}
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
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <FontAwesome6
                                                name="clock-rotate-left"
                                                size={16}
                                                color={Color.Green[500]}
                                            />
                                            <ThemedText>Clock In</ThemedText>
                                        </View>
                                        <ThemedText type="Medium">
                                            {v.clock_in}
                                        </ThemedText>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <FontAwesome6
                                                name="clock"
                                                size={18}
                                                color={Color.Red[500]}
                                            />
                                            <ThemedText>Clock Out</ThemedText>
                                        </View>
                                        <ThemedText type="Medium">
                                            {v.clock_out}
                                        </ThemedText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
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
    itemFilter: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: Color.Gray[300],
        borderWidth: 1,
        borderRadius: 20,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Base.White,
    },
});

export default PresenceScreen;
