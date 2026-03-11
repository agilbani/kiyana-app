import { ThemedButton, ThemedGap, ThemedImage, ThemedText } from "@/components";
import { OfficeStaticMap } from "@/components/screens/Attendance/MapStatis";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { useCheckRadius } from "@/hooks/useCheckRadius";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import GlobalStyles from "@/styles/common";
import { getPositionBottom } from "@/utils/bottomPosition";
import { formatDate } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcArrowLeft, IcMarker } from "@assets/icons";
import ILClockIn from "@assets/images/ILClock.svg";
import ILLocation from "@assets/images/permissions/ILocation.png";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const AttendanceClockInScreen = () => {
    const { attendance, user, dataSetting, setCoords, dataSelectedAttendance } =
        useApp();

    const [refresh, setRefresh] = useState(false);

    //  console.log("attendance clockin", attendance);
    //  console.log("clockin user", user);
    //  console.log("dataSelectedAttendance", dataSelectedAttendance);

    const officeCoordinate = dataSetting.find(
        (s) => s.key === "OFFICE_COORDINATE",
    )?.value;
    const dataOfficeCoordinate = officeCoordinate
        ? JSON.parse(officeCoordinate)
        : null;

    const { requestPermission } = useLocationPermission();
    const { isWithinRadius, distance, coords, loading, checkLocation } =
        useCheckRadius();

    useEffect(() => {
        const init = async () => {
            const perm = await Location.getForegroundPermissionsAsync();
            let granted = perm.status === "granted";

            if (!granted) {
                granted = await requestPermission();
            }

            if (!granted) {
                Alert.alert(
                    "Error Lokasi",
                    "Izin lokasi diperlukan untuk fitur ini.",
                );
                return;
            }

            checkLocation().catch(() =>
                Alert.alert("Error Lokasi", "Gagal mendapatkan lokasi."),
            );
            setRefresh(false);
        };

        init();
    }, [refresh]);

    const markers = coords
        ? [
              {
                  coordinates: {
                      latitude: coords.latitude,
                      longitude: coords.longitude,
                  },
                  icon: ILLocation,
              },
          ]
        : [];

    const handleSelfieClockIn = () => {
        setCoords(coords);
        router.push({
            pathname: ROUTES.ATTENDANCE_SELFIE,
            params: {
                data: JSON.stringify(coords),
            },
        });
    };

    return (
        <View style={styles.page}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                style={[styles.backButton, GlobalStyles.center]}
            >
                <IcArrowLeft width={24} height={24} />
            </TouchableOpacity>
            <OfficeStaticMap
                officeCoordinate={dataOfficeCoordinate}
                radius={100}
                userCoordinate={{
                    latitude: coords?.latitude,
                    longitude: coords?.longitude,
                }}
                userInsideRadius={isWithinRadius}
            />

            <View
                style={[
                    styles.controlsContainer,
                    { bottom: getPositionBottom().bottom },
                ]}
            >
                <LinearGradient
                    colors={[
                        Color.Background.HeaderTopGradient,
                        Color.Background.HeaderBottomGradient,
                    ]}
                    locations={[0, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.locationStatusContainer}
                >
                    <View style={GlobalStyles.flex}>
                        {loading ? (
                            <ThemedText
                                type="SemiBold"
                                size="md"
                                color={Color.Background.Background}
                            >
                                Sedang memeriksa lokasi...
                            </ThemedText>
                        ) : isWithinRadius ? (
                            <>
                                <ThemedText
                                    type="SemiBold"
                                    size="md"
                                    color={Color.Background.Background}
                                >
                                    Anda Berada di Area Absensi!
                                </ThemedText>
                                <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Gray[200]}
                                >
                                    Silakan lanjutkan untuk Absensi.
                                </ThemedText>
                            </>
                        ) : (
                            <>
                                <ThemedText
                                    type="SemiBold"
                                    size="md"
                                    color={Color.Red[500]}
                                >
                                    Anda di Luar Area Absensi!
                                </ThemedText>
                                <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Red[200]}
                                >
                                    Jarak: {distance?.toFixed(0)} m
                                </ThemedText>
                            </>
                        )}
                    </View>
                    <ILClockIn width={scale(64)} height={scale(64)} />
                </LinearGradient>
                <ThemedGap height="md" />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <ThemedText type="Medium" size="sm">
                        PROFIL SAYA
                    </ThemedText>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setRefresh(true)}
                            activeOpacity={0.9}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <FontAwesome name="refresh" size={18} />
                            <ThemedText type="Medium">
                                Perbaharui Lokasi
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
                <ThemedGap height="xs" />
                <View style={styles.cardProfile}>
                    <ThemedImage
                        source={{ uri: "https://picsum.photos/200" }}
                        width={64}
                        height={64}
                        style={styles.profile}
                    />
                    <ThemedGap width="sm" />
                    <View style={GlobalStyles.flex}>
                        <ThemedText type="Medium" size="md">
                            {user?.first_name} {user?.last_name}
                        </ThemedText>
                        <ThemedText
                            type="Medium"
                            size="sm"
                            color={Color.Purple[500]}
                        >
                            {formatDate(new Date())}
                        </ThemedText>
                        <ThemedGap height="xs" />
                        <View style={GlobalStyles.rowCenter}>
                            <IcMarker />
                            <ThemedGap width="xxs" />
                            {coords ? (
                                <ThemedText
                                    type="Medium"
                                    size="xs"
                                    color={Color.Gray[600]}
                                >
                                    Lat: {coords.latitude.toFixed(7)}, Long:{" "}
                                    {coords.longitude.toFixed(7)}
                                </ThemedText>
                            ) : (
                                <ThemedText
                                    type="Medium"
                                    size="xs"
                                    color={Color.Gray[600]}
                                >
                                    Koordinat belum tersedia.
                                </ThemedText>
                            )}
                        </View>
                    </View>
                </View>
                <ThemedGap height="md" />
                <ThemedText type="Medium" size="sm">
                    JADWAL HARI INI
                </ThemedText>
                <ThemedGap height="xs" />
                <View style={GlobalStyles.rowCenter}>
                    <View style={styles.cardClock}>
                        <ThemedText
                            type="Medium"
                            size="sm"
                            color={Color.Gray[600]}
                        >
                            MASUK
                        </ThemedText>
                        <ThemedText type="SemiBold" size="xl">
                            {user?.is_host
                                ? dataSelectedAttendance.start_time
                                : attendance
                                  ? attendance?.start_time
                                  : user?.shift?.start_time}
                        </ThemedText>
                    </View>
                    <ThemedGap width="xs" />
                    <View style={styles.cardClock}>
                        <ThemedText
                            type="Medium"
                            size="sm"
                            color={Color.Gray[600]}
                        >
                            PULANG
                        </ThemedText>
                        <ThemedText type="SemiBold" size="xl">
                            {user?.is_host
                                ? dataSelectedAttendance.end_time
                                : attendance
                                  ? attendance?.end_time
                                  : user?.shift?.end_time}
                        </ThemedText>
                    </View>
                </View>
                <ThemedGap height="xl" />
                <ThemedButton
                    title="Ambil Selfie & Absensi Sekarang"
                    onPress={handleSelfieClockIn}
                    disabled={!isWithinRadius}
                    style={{ marginBottom: 20 }}
                />
            </View>
        </View>
    );
};

export default AttendanceClockInScreen;

const styles = StyleSheet.create({
    page: {
        ...GlobalStyles.flex,
        backgroundColor: Color.Base.White,
    },
    backButton: {
        position: "absolute",
        top: statusBarHeight ? statusBarHeight + scale(12) : scale(46),
        left: scale(24),
        width: scale(32),
        height: verticalScale(32),
        borderRadius: Radius.rounded,
        backgroundColor: Color.Purple[50],
        zIndex: 1,
        ...GlobalStyles.shadow,
    },
    map: {
        flex: 0.45,
    },
    controlsContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        padding: scale(16),
        backgroundColor: Color.Base.White,
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        ...GlobalStyles.shadow,
    },
    locationStatusContainer: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderRadius: scale(12),
        ...GlobalStyles.rowSpaceBetween,
    },
    cardProfile: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: Color.Gray[200],
        ...GlobalStyles.rowCenter,
    },
    profile: {
        borderRadius: scale(10),
    },
    cardClock: {
        flex: 1,
        backgroundColor: Color.Gray[50],
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: Color.Gray[200],
        ...GlobalStyles.center,
    },
});
