import DashboardFinanceHistory from "@/components/screens/Dashboard/DashboardFinanceHistory";
import {
    FloatingButton,
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components/ui";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { getPayouts } from "@/services/payoutService";
import GlobalStyles from "@/styles/common";
import { Payout } from "@/types/payout";
import { scale, verticalScale } from "@/utils/scaleSize";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const Withdraw = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [listData, setListData] = useState<Payout[]>([]);

    const getHistory = async () => {
        setLoading(true);
        const res = await getPayouts();
        setLoading(false);
        console.log("res history", res);
        if (res) {
            setListData(res.data);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getHistory();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    return (
        <View style={styles.card}>
            <StatusBar translucent barStyle="dark-content" />
            <ThemedHeader title="History Penarikan" />
            <View
                style={[
                    GlobalStyles.rowSpaceBetween,
                    { paddingHorizontal: 15, paddingTop: 15 },
                ]}
            >
                <View>
                    <ThemedText type="SemiBold">Riwayat Transaksi</ThemedText>
                    <ThemedGap height="xxs" />
                    {listData.length > 0 ? (
                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            {listData.length} transaksi terbaru
                        </ThemedText>
                    ) : (
                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            Belum ada transaksi terbaru
                        </ThemedText>
                    )}
                </View>
                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        router.push(ROUTES.DASHBOARD_HISTORY_TRANSACTION)
                    }
                >
                    <ThemedText size="sm" color={Color.Purple[500]}>
                        Lihat semua
                    </ThemedText>
                </TouchableOpacity> */}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ThemedLoader />
                ) : (
                    <DashboardFinanceHistory data={listData} />
                )}
            </ScrollView>
            <FloatingButton
                onPress={() => router.push(ROUTES.DASHBOARD_WITHDRAWAL)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Color.Base.White,
        paddingVertical: scale(12),
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
        flex: 1,
        ...GlobalStyles.shadow,
    },
    countWrapper: {
        minWidth: scale(20),
        height: scale(20),
        paddingHorizontal: scale(4),
        backgroundColor: Color.Purple[50],
        borderRadius: Radius.xs,
        ...GlobalStyles.center,
    },
    taskWrapper: {
        backgroundColor: Color.Gray[50],
        padding: scale(12),
        borderWidth: 1,
        borderColor: Color.Gray[200],
        borderRadius: Radius.xs,
    },
    deadlineWrapper: {
        backgroundColor: Color.Base.White,
        paddingVertical: verticalScale(6),
        paddingHorizontal: scale(10),
        borderRadius: Radius.rounded,
        ...GlobalStyles.rowCenter,
        borderWidth: 1,
        borderColor: Color.Gray[300],
    },
});

export default Withdraw;
