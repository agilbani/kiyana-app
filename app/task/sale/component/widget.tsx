import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import { formatRupiahDisplay } from "@/utils/currency";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

const Widget = ({ data }: any) => {
    return (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
            <View style={styles.card}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <ThemedText size="md" type="Medium" color={Color.Gray[500]}>
                        Total Penjualan
                    </ThemedText>
                    <FontAwesome6
                        name="money-bill-wave"
                        color={Color.Green[500]}
                    />
                </View>
                <ThemedText size="xl" type="Medium" color={Color.Gray[500]}>
                    {formatRupiahDisplay(Number(data?.total_penjualan))}
                </ThemedText>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View style={[styles.card, { width: "49%" }]}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ThemedText
                            size="sm"
                            type="Medium"
                            color={Color.Gray[500]}
                        >
                            Transaksi Selesai
                        </ThemedText>
                        {/* <Feather
                            name="check-circle"
                            size={17}
                            color={Color.Green[500]}
                        /> */}
                    </View>
                    <ThemedText size="xl" type="Medium" color={Color.Gray[500]}>
                        {data?.total_transaksi_completed}
                    </ThemedText>
                </View>
                <View style={[styles.card, { width: "49%" }]}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ThemedText
                            size="sm"
                            type="Medium"
                            color={Color.Gray[500]}
                            style={{ width: "90%" }}
                        >
                            Transaksi Dibatalkan
                        </ThemedText>
                        {/* <Ionicons
                            name="close-circle"
                            size={16}
                            color={Color.Red[500]}
                        /> */}
                    </View>
                    <ThemedText size="xl" type="Medium" color={Color.Gray[500]}>
                        {data?.total_transaksi_cancelled}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        alignSelf: "center",
        borderRadius: 8,
        padding: 16,
        backgroundColor: Color.Base.White,
        gap: 8,
        borderWidth: 1,
        borderColor: Color.Gray[300],
    },
});

export default Widget;
