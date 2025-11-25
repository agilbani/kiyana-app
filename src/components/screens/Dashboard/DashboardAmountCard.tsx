import { ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { getAllSettings } from "@/services/settingService";
import { formatRupiahDisplay } from "@/utils/currency";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import RunningText from "./RunningText";

const DashboardAmountCard = ({
    user,
    onPressLoan,
    onPressWithdraw,
    onPressHistory,
}: any) => {
    const [showAmount, setShowAmount] = useState(true);
    const [announcement, setAnnouncement] = useState<any>([]);
    const menu = [
        {
            icon: require("@assets/icons/LoanIcon.png"),
            label: "Pinjaman",
            onPress: () => onPressLoan(),
        },
        {
            icon: require("@assets/icons/IcBack.png"),
            label: "History",
            onPress: () => onPressHistory(),
        },
        {
            icon: require("@assets/icons/PayoutIcon.png"),
            label: "Tarik Saldo",
            onPress: () => onPressWithdraw(),
        },
    ];

    const getData = async () => {
        const res = await getAllSettings();
        //   console.log("all setting", res);
        if (res.success) {
            const getAnnouncement = res.data?.find((v: any) => {
                return v.key === "ANNOUNCEMENT";
            });
            console.log("getAnnouncement", getAnnouncement);
            setAnnouncement(JSON.parse(getAnnouncement.value));
        }
    };

    useFocusEffect(
        useCallback(() => {
            getData();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );
    //  console.log("cek", announcement);

    return (
        <View style={styles.content}>
            <ThemedText
                type="Medium"
                color={Color.Base.White}
                style={{ alignSelf: "center" }}
            >
                Saldo Aktif
            </ThemedText>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                }}
            >
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    color={Color.Base.White}
                    style={{ alignSelf: "center" }}
                >
                    {showAmount
                        ? formatRupiahDisplay(user?.balance)
                        : "********"}
                </ThemedText>
                <TouchableOpacity
                    onPress={() => setShowAmount((prev) => !prev)}
                    activeOpacity={0.9}
                >
                    <Entypo
                        name={showAmount ? "eye" : "eye-with-line"}
                        color={Color.Base.White}
                        size={18}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    marginTop: 12,
                    gap: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {menu.map((v: any, index: any) => (
                    <View
                        key={`${index}`}
                        style={{
                            gap: 8,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={v.onPress}
                        >
                            <Image
                                source={v.icon}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    resizeMode: "contain",
                                }}
                            />
                        </TouchableOpacity>
                        <ThemedText
                            size="xs"
                            type="Medium"
                            color={Color.Base.White}
                            style={{ textAlign: "center" }}
                        >
                            {v.label}
                        </ThemedText>
                    </View>
                ))}
            </View>
            <View style={{ gap: 8, marginTop: 15 }}>
                <ThemedText color={Color.Base.White} size="md" type="Medium">
                    Pengumuman
                </ThemedText>
                <RunningText
                    texts={announcement}
                    duration={5000} // opsional
                    textStyle={{ color: "purple", fontSize: 18 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: Color.Green[600],
    },
});

export default DashboardAmountCard;
