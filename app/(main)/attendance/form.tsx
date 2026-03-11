import {
    ThemedBottomSheet,
    ThemedButton,
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedImage,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { clockIn, clockOut } from "@/services/attendanceService";
import { deleteItem } from "@/store/asyncStore";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";

const AttendanceFormScreen = () => {
    const {
        attendance,
        dataCoords,
        user,
        dataSelectedAttendance,
        setLateScheduleId,
        savedIdLateSchedule,
    } = useApp();
    //  console.log("cek attendance form", attendance);
    //  console.log("cek dataSelectedAttendance form", dataSelectedAttendance);
    //  console.log("cek user form", user);

    const [loading, setLoading] = useState(false);
    const { data } = useLocalSearchParams<{ data: string }>();
    const photo = data ? JSON.parse(data) : null;

    const ref = useRef<ThemedBottomSheet | null>(null);

    const handleRetake = () => {
        router.push(ROUTES.ATTENDANCE_SELFIE);
    };

    const onSubmit = async () => {
        const objPhoto = { ...photo };
        delete objPhoto.coords;
        const dataClockin = {
            time: `${moment().unix()}`,
            lat_in: dataCoords?.latitude,
            lng_in: dataCoords?.longitude,
            image_in: objPhoto,
        };

        setLoading(true);
        let res = null;
        if (savedIdLateSchedule) {
            // console.log("res clock out1111");
            const resp = await clockOut(
                savedIdLateSchedule,
                dataClockin,
                "host",
            );
            // console.log("res clock out", resp);
            setLoading(false);
            if (resp.success) {
                setLateScheduleId(null);
                Alert.alert("Absen pulang berhasil", "Selamat istirahat", [
                    {
                        text: "Kembali",
                        onPress: () => router.replace(ROUTES.ATTENDANCE),
                    },
                ]);
            } else {
                Alert.alert("Absen pulang gagal", resp.message, [
                    {
                        text: "Kembali",
                        onPress: () => router.replace(ROUTES.ATTENDANCE),
                    },
                ]);
            }
        } else {
            if (
                user?.is_host
                    ? dataSelectedAttendance.lat_in === null
                    : attendance?.lat_in === null
            ) {
                //  console.log("clock in", user);
                if (
                    user?.is_host &&
                    dataSelectedAttendance.start_time === "21:00"
                ) {
                    setLateScheduleId(dataSelectedAttendance?.id);
                }
                res = await clockIn(
                    user?.is_host ? dataSelectedAttendance.id : user?.shift?.id,
                    dataClockin,
                    user?.is_host ? "host" : "shifted",
                );
            } else {
                //  console.log("clock out");
                res = await clockOut(
                    user?.is_host ? dataSelectedAttendance.id : attendance?.id,
                    dataClockin,
                    user?.is_host ? "host" : "shifted",
                );
                setLateScheduleId(null);
                await deleteItem("savedIdLateSchedule");
            }
            setLoading(false);
            // console.log("res absen", res);

            if (res.success) {
                ref.current?.show();
            } else {
                ShowToastMessage(res.message);
            }
        }
    };

    const onClose = () => {};
    return (
        <ThemedContainer>
            <ThemedHeader
                title={
                    user?.is_host
                        ? dataSelectedAttendance.lat_in === null
                            ? "Clock In"
                            : "Clock Out"
                        : attendance?.lat_in === null
                          ? "Clock In"
                          : "Clock Out"
                }
            />
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.photoWrapper}>
                        <ThemedImage
                            source={{
                                uri: photo?.uri,
                            }}
                            width={Dimensions.get("window").width * 0.85}
                            height={Dimensions.get("window").height * 0.5}
                            style={styles.photo}
                        />
                        <View style={styles.photoContent}>
                            <ThemedText
                                type="Medium"
                                size="sm"
                                color={Color.Base.White}
                            >
                                Lat : {dataCoords.latitude}
                            </ThemedText>
                            <ThemedGap height="xxs" />
                            <ThemedText
                                type="Medium"
                                size="sm"
                                color={Color.Base.White}
                            >
                                Long : {dataCoords.longitude}
                            </ThemedText>
                            <ThemedGap height="xxs" />
                            <ThemedText
                                type="Medium"
                                size="sm"
                                color={Color.Base.White}
                            >
                                {moment(new Date()).format("DD/MM/YYYY HH:mm")}
                            </ThemedText>
                            <ThemedGap height="md" />
                            <ThemedButton
                                title="Retake Photo"
                                onPress={handleRetake}
                            />
                        </View>
                    </View>
                    <ThemedGap height="sm" />
                </View>
            </View>
            <View style={styles.footer}>
                <ThemedButton
                    //   title={
                    //       attendance?.lat_in === null ? "Clock In" : "Clock Out"
                    //   }
                    title={
                        user?.is_host
                            ? dataSelectedAttendance.lat_in === null
                                ? "Clock In"
                                : "Clock Out"
                            : attendance?.lat_in === null
                              ? "Clock In"
                              : "Clock Out"
                    }
                    onPress={onSubmit}
                    loading={loading}
                />
            </View>

            <ThemedBottomSheet ref={ref} onClose={onClose}>
                <View style={GlobalStyles.center}>
                    <ThemedText type="SemiBold" size="lg">
                        {/* {attendance?.lat_in === null ? "Clock-In" : "Clock-Out"}{" "} */}
                        {user?.is_host
                            ? dataSelectedAttendance.lat_in === null
                                ? "Clock In"
                                : "Clock Out"
                            : attendance?.lat_in === null
                              ? "Clock In"
                              : "Clock Out"}{" "}
                        Absensi Berhasil!
                    </ThemedText>
                    <ThemedGap height="md" />
                    <ThemedText
                        type="Medium"
                        size="sm"
                        color={Color.Text.Secondary}
                    >
                        {user?.is_host
                            ? dataSelectedAttendance.lat_in === null
                                ? "Jadwal absensi mu telah disimpan, selamat bekerja"
                                : "Jadwal absensi mu telah disimpan, selamat istirahat"
                            : attendance?.lat_in === null
                              ? "Jadwal absensi mu telah disimpan, selamat bekerja"
                              : "Jadwal absensi mu telah disimpan, selamat istirahat"}
                    </ThemedText>
                </View>
                <ThemedGap height="lg" />
                <ThemedButton
                    title="Kembali ke halaman Utama"
                    onPress={() => router.replace(ROUTES.ATTENDANCE)}
                />
            </ThemedBottomSheet>
        </ThemedContainer>
    );
};

export default AttendanceFormScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.Purple[50],
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(12),
        ...GlobalStyles.flex,
    },
    card: {
        backgroundColor: Color.Background.Background,
        paddingVertical: verticalScale(24),
        paddingHorizontal: scale(16),
        borderRadius: Radius.xs,
        ...GlobalStyles.flex,
    },
    photoWrapper: {
        position: "relative",
        ...GlobalStyles.flex,
    },
    photo: {
        borderRadius: Radius.sm,
        ...GlobalStyles.flex,
    },
    photoContent: {
        position: "absolute",
        left: scale(16),
        right: scale(16),
        bottom: scale(16),
    },
    footer: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
        paddingBottom: 30,
    },
});
