import {
    FloatingButton,
    ThemedBadge,
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components/ui";
import Color from "@/constants/Color";
import { TransactionStatus, TransactionStatusColor } from "@/constants/Enum";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { getMyLoans } from "@/services/loanService";
import GlobalStyles from "@/styles/common";
import { LoanSubmission } from "@/types/loan";
import { formatRupiahDisplay } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const TaskItem = React.memo(({ item, onAction }: any) => {
    const { backgroundColor, textColor } = TransactionStatusColor[
        item.status as TransactionStatus
    ] ?? {
        backgroundColor: "#EEEEEE",
        textColor: "#333333",
    };
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onAction}
            style={styles.taskWrapper}
        >
            <View style={GlobalStyles.rowSpaceBetween}>
                <View>
                    <ThemedText type="Medium" size="md">
                        {item.description}
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedBadge
                        text={item.status}
                        textColor={textColor}
                        backgroundColor={backgroundColor}
                    />
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <ThemedText type="SemiBold" size="md">
                        {formatRupiahDisplay(item.nominal)}
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText size="sm" color={Color.Text.Secondary}>
                        {moment(item.submission_date).format("DD MMMM YYYY")}
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const CashFinanceHistory = () => {
    const renderTaskItem = useCallback(
        ({ item }: any) => (
            <TaskItem
                item={item}
                onAction={() =>
                    router.push({
                        pathname: ROUTES.DASHBOARD_DETAIL_CASHADVANCE,
                        params: { id: item.id },
                    })
                }
            />
        ),
        []
    );
    const [listLoan, setListLoan] = useState<LoanSubmission[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getListLoan = async () => {
        setLoading(true);
        const res = await getMyLoans();
        console.log("res loan", res);

        setLoading(false);
        if (res.success) {
            setListLoan(res.data ?? []);
        } else {
            ShowToastMessage(res.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getListLoan();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    return (
        <View style={styles.card}>
            <StatusBar
                translucent
                barStyle="dark-content"
                backgroundColor={Color.Base.White}
            />
            <ThemedHeader title="History Pinjaman" />
            <View
                style={[
                    GlobalStyles.rowSpaceBetween,
                    { marginTop: 25, paddingHorizontal: scale(16) },
                ]}
            >
                <View>
                    <ThemedText type="SemiBold">Riwayat Transaksi</ThemedText>
                    <ThemedGap height="xxs" />
                    <ThemedText size="sm" color={Color.Text.Secondary}>
                        {listLoan.length} data pinjaman terbaru
                    </ThemedText>
                </View>
            </View>
            <ThemedGap height="sm" />
            {loading ? (
                <ThemedLoader />
            ) : (
                <FlatList
                    data={listLoan}
                    renderItem={renderTaskItem}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <ThemedGap height="sm" />}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={10}
                    removeClippedSubviews={Platform.OS === "android"}
                />
            )}
            <FloatingButton
                onPress={() => router.push(ROUTES.DASHBOARD_CASHADVANCE)}
            />
        </View>
    );
};

export default React.memo(CashFinanceHistory);

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
        width: "94%",
        alignSelf: "center",
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
