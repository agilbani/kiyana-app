import { ThemedText } from "@/components";
import AttendanceScedule from "@/components/screens/Attendance/AttendanceScheduleCard";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getCurrentAttendance } from "@/services/attendanceService";
import { getAllSettings } from "@/services/settingService";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { scale } from "@/utils/scaleSize";
import {
    FaceRecognationIcon,
    GrafikIcon,
    HospitalIcon,
    IcBack,
    IcBell,
    LoanIcon,
    PaperIcon,
} from "@assets/index";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const AttendanceScreen = () => {
    const { user, saveDataSetting, saveAttendance, setSelectAttendance } =
        useApp();
    const isKartap = user?.type === "TETAP";
    const isHost = user?.is_host;
    const { bottom } = usePositionBottom();
    const [dataHost, setDataHost] = useState<any>([]);
    const [dataShift, setDataShift] = useState<any>({});
    const menu = [
        {
            icon: LoanIcon,
            title: "Hadir",
            onPress: () => router.push(ROUTES.PRESENCE_SCREEN),
            isShow: isKartap ? true : false,
        },
        {
            icon: IcBack,
            title: "Rekap Absensi",
            onPress: () => router.push(ROUTES.ATTENDANCE_SUMMARY),
            isShow: isKartap ? true : false,
        },
        {
            icon: PaperIcon,
            title: "Pengajuan Tukar Jadwal",
            onPress: () => router.push(ROUTES.REQUEST_CHANGE_SHIFT),
            isShow: isKartap ? true : false,
        },
        {
            icon: HospitalIcon,
            title: "Pengajuan Izin & Sakit",
            onPress: () => router.push(ROUTES.ABSENCE_HISTORY),
            isShow: isKartap ? true : false,
        },
        {
            icon: IcBack,
            title: "Aktivitas Lembur",
            onPress: () => router.push(ROUTES.OVER_TIME_HISTORY),
            isShow: isKartap ? true : false,
        },
        {
            icon: GrafikIcon,
            title: "Absensi Karyawan Tidak Tetap",
            onPress: () => router.push(ROUTES.TEMPORARY_EMPLOYEE),
            isShow: isKartap ? false : true,
        },
    ];

    const getData = async () => {
        LoadingManager.show();
        const res = await getCurrentAttendance(isHost ? "host" : "shifted");
        LoadingManager.hide();
        console.log("res att", res);
        if (isHost && res.data) {
            setDataHost(res.data);
        } else {
            if (res.success) {
                setDataShift(res.data);
                saveAttendance(res.data);
            }
        }
    };

    const getListSetting = async () => {
        const res = await getAllSettings();
        if (res.success && res.data) {
            saveDataSetting(res.data);
        }
    };

    useEffect(() => {
        getData();
        getListSetting();
    }, []);

    return (
        <View style={styles.page}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            width: "90%",
                            flexDirection: "row",
                        }}
                    >
                        <View
                            style={{
                                width: "25%",
                                borderWidth: 0.6,
                                borderColor: Color.Base.Black,
                                borderRadius: 6,
                            }}
                        >
                            <Image
                                source={require("@assets/images/adaptive-icon.png")}
                                style={{
                                    width: "100%",
                                    height: 100,
                                    resizeMode: "cover",
                                }}
                            />
                        </View>
                        <View style={{ width: "75%", padding: 10 }}>
                            <ThemedText type="SemiBold" size="lg">
                                Kiyana Fashion Indonesia
                            </ThemedText>
                            <ThemedText size="sm">
                                Jika gagal hari ini, coba lagi besok, Semangat!
                            </ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.viewBell}
                    >
                        <IcBell
                            width={27}
                            height={27}
                            color={Color.Yellow[500]}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={menu}
                    keyExtractor={(v, i) => `${i}`}
                    numColumns={3}
                    nestedScrollEnabled
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => {
                        if (item.isShow) {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={[styles.cardItem, { marginTop: 15 }]}
                                    onPress={item.onPress}
                                >
                                    <Image
                                        source={item.icon}
                                        style={{
                                            width: "40%",
                                            height: undefined,
                                            aspectRatio: 1,
                                            resizeMode: "contain",
                                        }}
                                    />
                                    <View
                                        style={{
                                            minHeight: 34,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ThemedText
                                            size="xs"
                                            numberOfLines={2}
                                            style={{
                                                textAlign: "center",
                                                flexWrap: "wrap",
                                                lineHeight: 16,
                                            }}
                                        >
                                            {item.title}
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>
                            );
                        } else {
                            if (isKartap) {
                                return <View style={{ width: "30%" }} />;
                            }
                        }
                    }}
                />
                <AttendanceScedule
                    isHost={isHost ?? false}
                    dataHost={dataHost}
                    dataShift={user?.shift}
                    setSelectAttendance={(data: any) =>
                        setSelectAttendance(data)
                    }
                />
            </ScrollView>
            {isKartap && !isHost && (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push(ROUTES.ATTENDANCE_CLOCKIN)}
                    style={[styles.footer, { bottom }]}
                >
                    <Image
                        source={FaceRecognationIcon}
                        style={styles.imgFace}
                    />
                    <ThemedText type="Medium" color={Color.Base.White}>
                        {dataShift?.clock_in
                            ? "Absen Pulang"
                            : "Absen sekarang, Sebelum Telat"}
                    </ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imgFace: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        tintColor: Color.Base.White,
    },
    footer: {
        position: "absolute",
        width: "100%",
        alignSelf: "center",
        borderRadius: 22,
        backgroundColor: Color.Green[500],
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    cardItem: {
        flexBasis: "30%", // tiga kolom
        aspectRatio: 1, // tinggi = lebar
        marginBottom: 5,
        borderRadius: 12,
        backgroundColor: Color.Base.White,
        justifyContent: "center",
        alignItems: "center",
        //   paddingHorizontal: 6,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    viewBgInfo: {
        marginTop: 20,
        borderRadius: 6,
        backgroundColor: Color.Base.White,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        flexDirection: "row",
        gap: 8,
    },
    infoUser: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    roundedPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Color.Base.White,
        justifyContent: "center",
        alignItems: "center",
    },
    viewBell: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        borderWidth: 2,
        borderColor: Color.Purple[300],
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.Base.White,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Gray[200],
        paddingTop: statusBarHeight ? statusBarHeight + 15 : scale(46),
        paddingHorizontal: 10,
    },
});

export default AttendanceScreen;
