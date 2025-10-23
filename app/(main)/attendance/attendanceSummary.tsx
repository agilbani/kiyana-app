import { ThemedContainer, ThemedHeader, ThemedLoader } from "@/components";
import AttendanceStatistics from "@/components/screens/Attendance/AttendanceStatistics";
import Color from "@/constants/Color";
import { getMyAttendance } from "@/services/attendanceService";
import { Attendance } from "@/types/attendance";
import { scale, verticalScale } from "@/utils/scaleSize";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

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

const AttendanceSummary = () => {
    const [dataSummary, setDataSummary] = useState<Summary>();
    const [loading, setLoading] = useState<boolean>(false);

    const start = moment().startOf("month").format("YYYY-MM-DD");
    const end = moment().format("YYYY-MM-DD");

    const getData = async () => {
        setLoading(true);
        const res = await getMyAttendance(start, end);
        setLoading(false);
        console.log("my attendance", res);
        if (res.success) {
            // const grouped = groupAttendanceByDate(res.data.histories);
            // console.log("cek grouped", grouped);
            // let finalData = res.data;
            // finalData.histories = grouped;
            setDataSummary(res.data);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    console.log("cek datasummary", dataSummary);

    if (loading) {
        return <ThemedLoader />;
    }

    return (
        <ThemedContainer>
            <ThemedHeader title="Rekap Kehadiran" />
            <View style={{ flex: 1, padding: 16 }}>
                <AttendanceStatistics data={dataSummary?.statistic} />
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

export default AttendanceSummary;
