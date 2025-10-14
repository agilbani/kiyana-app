import { ThemedText } from "@/components";
import AttendanceScedule from "@/components/screens/Attendance/AttendanceScheduleCard";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { usePositionBottom } from "@/utils/bottomPosition";
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
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
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
    const { user, updateUser } = useApp();
    const isKartap = user?.type === "TETAP";
    const isHost = user?.is_host;
    const { bottom } = usePositionBottom();
    const menu = [
        {
            icon: LoanIcon,
            title: "Hadir",
            onPress: () => router.push(ROUTES.PRESENCE_SCREEN),
            isShow: true,
        },
        {
            icon: IcBack,
            title: "Rekap Absensi",
            onPress: () => router.push(ROUTES.ATTENDANCE_SUMMARY),
            isShow: true,
        },
        {
            icon: PaperIcon,
            title: "Pengajuan Tukar Jadwal",
            onPress: () => router.push(ROUTES.REQUEST_CHANGE_SHIFT),
            isShow: true,
        },
        {
            icon: HospitalIcon,
            title: "Pengajuan Izin & Sakit",
            onPress: () => router.push(ROUTES.ABSENCE_HISTORY),
            isShow: true,
        },
        {
            icon: IcBack,
            title: "Aktivitas Lembur",
            onPress: () => router.push(ROUTES.OVER_TIME_HISTORY),
            isShow: true,
        },
        {
            icon: GrafikIcon,
            title: "Absensi Karyawan Tidak Tetap",
            onPress: () => router.push(ROUTES.TEMPORARY_EMPLOYEE),
            isShow: isKartap ? false : true,
        },
    ];

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
                <AttendanceScedule />
                {
                    //section info user
                }
                <View style={styles.infoUser}>
                    <View
                        style={{
                            width: "80%",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <View style={styles.roundedPhoto}>
                            <ThemedText>Poto</ThemedText>
                        </View>
                        <View style={{ width: "90%", gap: 6 }}>
                            <ThemedText
                                size="lg"
                                type="Medium"
                                color={Color.Green[500]}
                            >
                                Rahmat demawan
                            </ThemedText>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 4,
                                }}
                            >
                                <FontAwesome name="map-marker" size={20} />
                                <ThemedText size="xs">
                                    Cirebon, Ciwaringin
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            width: "20%",
                            gap: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <FontAwesome
                            name="refresh"
                            size={15}
                            color={Color.Green[500]}
                        />
                        <ThemedText>Aktivitas</ThemedText>
                    </TouchableOpacity>
                </View>
                {
                    //info presensi section
                }
                <View style={styles.viewBgInfo}>
                    <Fontisto name="date" size={18} color={Color.Green[500]} />
                    <ThemedText
                        size="md"
                        type="Medium"
                        color={Color.Green[500]}
                    >
                        Presensi keluar, Rabu 10 Sep 2025 17:00
                    </ThemedText>
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
            </ScrollView>
            <View style={[styles.footer, { bottom }]}>
                <Image source={FaceRecognationIcon} style={styles.imgFace} />
                <ThemedText type="Medium" color={Color.Base.White}>
                    Absen sekarang, Sebelum Telat
                </ThemedText>
            </View>
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
