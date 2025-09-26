import { ThemedBadge, ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { TransactionStatus, TransactionStatusColor } from "@/constants/Enum";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import moment from "moment";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

const TaskItem = React.memo(({ item }: any) => {
    const { backgroundColor, textColor } = TransactionStatusColor[
        item.paid_at === null ? "Diproses" : ("Selesai" as TransactionStatus)
    ] ?? {
        backgroundColor: "#EEEEEE",
        textColor: "#333333",
    };
    return (
        <View style={[styles.taskWrapper, { marginTop: 15 }]}>
            <View style={GlobalStyles.rowSpaceBetween}>
                <View>
                    <ThemedText type="Medium" size="md">
                        Ambil Uang
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText size="sm" color={Color.Text.Secondary}>
                        Status
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText size="sm" color={Color.Text.Secondary}>
                        Diajukan pada
                    </ThemedText>
                </View>
                <View
                    style={{
                        alignItems: "flex-end",
                    }}
                >
                    <ThemedText type="SemiBold" size="md">
                        {formatRupiahDisplay(item.nominal)}
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <View style={{ alignSelf: "flex-end" }}>
                        <ThemedBadge
                            text={
                                item.paid_at === null ? "Diproses" : "Selesai"
                            }
                            textColor={textColor}
                            backgroundColor={backgroundColor}
                        />
                    </View>
                    <ThemedGap height="xs" />
                    <ThemedText size="sm" color={Color.Text.Secondary}>
                        {`${moment(item.created_at).format(
                            "DD MMMM YYYY HH:mm"
                        )} WIB`}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
});

const DashboardFinanceHistory = ({ data }: any) => {
    const renderTaskItem = useCallback(
        ({ item }: any) => <TaskItem item={item} />,
        []
    );

    return (
        <View style={styles.card}>
            <ThemedGap height="sm" />
            {data.map((item: any, index: any) => (
                <TaskItem key={`${index}`} item={item} />
            ))}
            {/* <FlatList
                data={MOCK_TRANSACTIONS}
                renderItem={renderTaskItem}
                nestedScrollEnabled
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <ThemedGap height="sm" />}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={10}
                removeClippedSubviews={Platform.OS === "android"}
            /> */}
        </View>
    );
};

export default React.memo(DashboardFinanceHistory);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Color.Base.White,
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        borderRadius: Radius.xs,
        // ...GlobalStyles.shadow,
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
