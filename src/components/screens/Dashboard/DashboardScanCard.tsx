import { ThemedInput, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { IcScan } from "@assets/index";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const DashboardScanCard = ({ user }: any) => {
    const [batchNumber, setBatchNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function checkBatchNumber() {
        router.push({
            pathname: ROUTES.DASHBOARD_DETAIL_PRODUCTION,
            params: { id: batchNumber },
        });
    }
    return (
        <View
            style={{
                flexDirection: "column",
                gap: 8,
                backgroundColor: Color.Base.White,
                padding: 16,
                borderRadius: 8,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ width: "65%" }}>
                    <ThemedInput
                        icon={<IcScan />}
                        label="Nomor Batch"
                        placeholder="Masukkan Nomor Batch"
                        value={batchNumber}
                        onChangeText={(text) => setBatchNumber(text)}
                        style={{
                            height: 45,
                            width: "100%",
                        }}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.btnCheck]}
                    onPress={checkBatchNumber}
                >
                    <ThemedText size="sm" color={Color.Base.White}>
                        Mulai Produksi
                    </ThemedText>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btnScan}
                onPress={() => router.push(ROUTES.DASHBOARD_SCAN_BATCH)}
            >
                <IcScan />
                <ThemedText size="md">Scan untuk memulai tugas anda</ThemedText>
            </TouchableOpacity>
            {user?.role?.name === "Spv Gudang" ||
                (user?.role?.name === "Staff Gudang" && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnScan}
                        onPress={() =>
                            router.push(ROUTES.DASHBOARD_ASSIGN_SEWN)
                        }
                    >
                        <IcScan />
                        <ThemedText size="md">
                            Tambahkan tugas untuk penjahit
                        </ThemedText>
                    </TouchableOpacity>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    btnScan: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Color.Border.Purple,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    btnCheck: {
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: Color.Green[500],
    },
});

export default DashboardScanCard;
