import Color from "@/constants/Color";
import { formatRupiahDisplay } from "@/utils/currency";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui";

const DashboardCard = ({ onPressLoan, onPressWithdraw, user }: any) => {
    console.log("cek user", user);

    return (
        <LinearGradient
            colors={["#E8EBFF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
        >
            <View style={styles.header}>
                <ThemedText size="md" type="SemiBold" color={Color.Base.Black}>
                    Saldo Anda Hari Ini
                </ThemedText>
                {/* <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View style={styles.viewHistory}>
                        <ThemedText
                            size="md"
                            type="Medium"
                            color={Color.Base.Black}
                        >
                            Lihat Riwayat
                        </ThemedText>
                    </View>
                </TouchableOpacity> */}
            </View>
            <View
                style={{
                    flexDirection: "row",
                    marginTop: 10,
                }}
            >
                <View style={{ width: "60%" }}>
                    <ThemedText
                        type="SemiBold"
                        size="xl"
                        color={Color.Base.Black}
                    >
                        {formatRupiahDisplay(user?.balance ?? 0)}
                    </ThemedText>
                </View>
                <View
                    style={{
                        width: "40%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity
                        style={{ width: "49%", gap: 4 }}
                        activeOpacity={0.9}
                        onPress={onPressLoan}
                    >
                        <Image
                            source={require("@assets/icons/LoanIcon.png")}
                            style={{
                                width: "100%",
                                height: 30,
                                resizeMode: "contain",
                            }}
                        />
                        <ThemedText
                            size="xs"
                            type="Medium"
                            style={{ textAlign: "center" }}
                        >
                            Pinjaman
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: "49%", gap: 4 }}
                        activeOpacity={0.9}
                        onPress={onPressWithdraw}
                    >
                        <Image
                            source={require("@assets/icons/PayoutIcon.png")}
                            style={{
                                width: "100%",
                                height: 30,
                                resizeMode: "contain",
                            }}
                        />
                        <ThemedText
                            size="xs"
                            type="Medium"
                            style={{ textAlign: "center" }}
                        >
                            Tarik Saldo
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    viewHistory: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Color.Gray[100],
        elevation: 2,
        borderRadius: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        margin: 12,
        //   shadowColor: "#000",
        //   shadowOpacity: 0.1,
        //   shadowOffset: { width: 0, height: 2 },
        //   shadowRadius: 6,
        //   elevation: 2,
    },
});

export default DashboardCard;
