import {
    ThemedButton,
    ThemedContainer,
    ThemedHeader,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import {
    getAttendanceTemporaryEmployee,
    patchAttendanceTemporary,
} from "@/services/attendanceService";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, View } from "react-native";

const TemporaryEmployee = () => {
    const { bottom } = usePositionBottom();
    const [attendance, setAttendance] = useState<boolean>(false);
    const [sickLeave, setSickLeave] = useState<boolean>(false);
    const [permit, setPermit] = useState<boolean>(false);
    const [reason, setReason] = useState("");
    const [todayAttendance, setTodayAttendance] = useState<any>({});

    // 🔹 Handler toggle agar hanya satu switch aktif
    const handleToggle = (type: "attendance" | "sick" | "permit") => {
        setAttendance(type === "attendance");
        setSickLeave(type === "sick");
        setPermit(type === "permit");
    };

    // 🔹 Validasi tombol submit (aktif jika sudah pilih salah satu & isi alasan)
    const isSubmitDisabled = useMemo(() => {
        const selected = attendance || sickLeave || permit;
        return !(selected && reason.trim().length > 0);
    }, [attendance, sickLeave, permit, reason]);

    const getAttendance = async () => {
        LoadingManager.show();
        const res = await getAttendanceTemporaryEmployee();
        LoadingManager.hide();
        if (res.success) {
            setTodayAttendance(res.data?.attendance);
        }
    };

    const submitAttendance = async () => {
        const payload = {
            attendance_id: todayAttendance?.id,
            status: attendance ? "Hadir" : sickLeave ? "Sakit" : "Izin",
            reason: reason,
        };
        LoadingManager.show();
        const res = await patchAttendanceTemporary(payload);
        LoadingManager.hide();
        if (res.success) {
            Alert.alert("Absensi Berhasil", "Absensi anda telah dikirimkam", [
                {
                    text: "Oke",
                    onPress: () => router.back(),
                },
            ]);
        } else {
            Alert.alert(
                "Absensi gagal",
                "Absensi anda gagal dikirimkam, silahkan hubungi admin",
                [
                    {
                        text: "Oke",
                        onPress: () => router.back(),
                    },
                ]
            );
        }
    };

    useEffect(() => {
        getAttendance();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Absensi anda" />
            <View style={{ flex: 1, padding: 16 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedText>
                        Silahkan perbaharui kehadiran anda untuk hari ini
                    </ThemedText>
                    <View style={styles.rowBetween}>
                        <ThemedText size="lg" type="Medium">
                            Hadir
                        </ThemedText>
                        <Switch
                            value={attendance}
                            onValueChange={() => handleToggle("attendance")}
                        />
                    </View>
                    <View style={styles.rowBetween}>
                        <ThemedText size="lg" type="Medium">
                            Sakit
                        </ThemedText>
                        <Switch
                            value={sickLeave}
                            onValueChange={() => handleToggle("sick")}
                        />
                    </View>
                    <View style={[styles.rowBetween, { marginBottom: 15 }]}>
                        <ThemedText size="lg" type="Medium">
                            Izin
                        </ThemedText>
                        <Switch
                            value={permit}
                            onValueChange={() => handleToggle("permit")}
                        />
                    </View>
                    <ThemedTextarea
                        placeholder="Masukkan alasan"
                        value={reason}
                        label="Tambahkan Catatan"
                        onChangeText={(text: string) => setReason(text)}
                    />
                </ScrollView>
            </View>
            <View style={[styles.footer, { bottom }]}>
                <ThemedButton
                    disabled={isSubmitDisabled}
                    textColor={Color.Base.White}
                    title="Submit"
                    onPress={submitAttendance}
                />
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 16,
        backgroundColor: Color.Base.White,
        paddingVertical: 10,
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },
});

export default TemporaryEmployee;
