import {
    ThemedButton,
    ThemedGap,
    ThemedHeader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { getDetailDataPayroll } from "@/services/masterService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcClock } from "@assets/icons";
import { useLocalSearchParams } from "expo-router";
import { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

/* =======================
 * Reusable Row Component
 * ======================= */
const PayrollRow = memo(
    ({
        label,
        value,
        color,
    }: {
        label: string;
        value: string;
        color?: string;
    }) => (
        <View style={GlobalStyles.rowSpaceBetween}>
            <ThemedText type="Medium" size="sm" color={Color.Text.Secondary}>
                {label}
            </ThemedText>
            <ThemedText
                type="Medium"
                size="md"
                color={color || Color.Text.Body}
            >
                {value || "-"}
            </ThemedText>
        </View>
    ),
);

/* =======================
 * Screen
 * ======================= */
const DetailPayrollScreen = () => {
    const { bottom } = usePositionBottom();
    const { id, salaryId } = useLocalSearchParams();

    const [detail, setDetail] = useState(null);

    const getData = async () => {
        LoadingManager.show();
        const res = await getDetailDataPayroll(id, salaryId);
        LoadingManager.hide();

        if (res?.success) {
            setDetail(res.data);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const salary = detail?.salary || {};
    const salaryDetail = salary?.salary_detail || {};
    const allowances = salary?.allowances || [];
    const deductions = salary?.deductions || [];

    return (
        <View style={{ flex: 1 }}>
            <ThemedHeader title="Slip Gaji" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <View style={styles.container}>
                    {/* ======================
                     * Ringkasan Jam Kerja
                     * ====================== */}
                    <View style={styles.content}>
                        <ThemedText type="Medium" size="md">
                            Total Jam Kerja
                        </ThemedText>
                        <ThemedText
                            type="Regular"
                            size="sm"
                            color={Color.Gray[500]}
                        >
                            Periode Pembayaran
                        </ThemedText>

                        <ThemedGap height="sm" />

                        <View style={GlobalStyles.rowCenter}>
                            <View style={styles.cardClock}>
                                <View style={GlobalStyles.rowCenter}>
                                    <IcClock />
                                    <ThemedGap width="xxs" />
                                    <ThemedText
                                        type="Medium"
                                        size="sm"
                                        color={Color.Text.Secondary}
                                        style={GlobalStyles.flex}
                                    >
                                        Lembur
                                    </ThemedText>
                                </View>
                                <ThemedGap height="xs" />
                                <ThemedText size="xl">
                                    {salaryDetail.total_overtime_formatted ||
                                        "Rp. 0"}
                                </ThemedText>
                            </View>

                            <ThemedGap width="xs" />

                            <View style={styles.cardClock}>
                                <View style={GlobalStyles.rowCenter}>
                                    <IcClock />
                                    <ThemedGap width="xxs" />
                                    <ThemedText
                                        type="Medium"
                                        size="sm"
                                        color={Color.Text.Secondary}
                                        style={GlobalStyles.flex}
                                    >
                                        Gaji Pokok
                                    </ThemedText>
                                </View>
                                <ThemedGap height="xs" />
                                <ThemedText size="xl">
                                    {salaryDetail.basic_salary_formatted ||
                                        "Rp. 0"}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    <ThemedGap height="md" />

                    {/* ======================
                     * Rincian Gaji
                     * ====================== */}
                    <View style={styles.content}>
                        <ThemedText type="Medium" size="md">
                            Rincian Gaji
                        </ThemedText>
                        <ThemedText
                            type="Regular"
                            size="sm"
                            color={Color.Gray[500]}
                        >
                            Detail lengkap slip gaji
                        </ThemedText>

                        <ThemedGap height="sm" />
                        <View style={styles.divider} />
                        <ThemedGap height="sm" />

                        <PayrollRow
                            label="Gaji Pokok"
                            value={salaryDetail.basic_salary_formatted}
                        />

                        <ThemedGap height="sm" />
                        <PayrollRow
                            label="Total Lembur"
                            value={salaryDetail.total_overtime_formatted}
                            color={Color.Green[500]}
                        />

                        <ThemedGap height="sm" />
                        <PayrollRow
                            label="Total Tunjangan"
                            value={salaryDetail.total_allowance_formatted}
                            color={Color.Green[500]}
                        />

                        {/* ======================
                         * Allowances
                         * ====================== */}
                        {allowances.length > 0 && (
                            <>
                                <ThemedGap height="sm" />
                                <View style={styles.divider} />
                                <ThemedGap height="sm" />

                                <ThemedText type="Medium" size="sm">
                                    Tunjangan
                                </ThemedText>

                                <ThemedGap height="xs" />

                                {allowances.map((item: any, idx: any) => (
                                    <View key={idx}>
                                        <PayrollRow
                                            label={item.name}
                                            value={`+${item.amount_formatted}`}
                                            color={Color.Green[500]}
                                        />
                                        <ThemedGap height="xs" />
                                    </View>
                                ))}
                            </>
                        )}

                        {/* ======================
                         * Deductions
                         * ====================== */}
                        {deductions.length > 0 && (
                            <>
                                <ThemedGap height="sm" />
                                <View style={styles.divider} />
                                <ThemedGap height="sm" />

                                <ThemedText type="Medium" size="sm">
                                    Potongan
                                </ThemedText>

                                <ThemedGap height="xs" />

                                {deductions.map((item: any, idx: any) => (
                                    <View key={idx}>
                                        <PayrollRow
                                            label={item.name}
                                            value={`-${item.amount_formatted}`}
                                            color={Color.Red[500]}
                                        />
                                        <ThemedGap height="xs" />
                                    </View>
                                ))}
                            </>
                        )}

                        <ThemedGap height="sm" />
                        <View style={styles.divider} />
                        <ThemedGap height="sm" />

                        <PayrollRow
                            label="Gaji Bruto"
                            value={salaryDetail.bruto_formatted}
                        />

                        <ThemedGap height="sm" />
                        <PayrollRow
                            label="Total Potongan"
                            value={salaryDetail.total_deduction_formatted}
                            color={Color.Red[500]}
                        />

                        <ThemedGap height="sm" />
                        <View style={styles.divider} />
                        <ThemedGap height="sm" />

                        <PayrollRow
                            label="Gaji Bersih"
                            value={salaryDetail.neto_formatted}
                            color={Color.brand.default}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.footer, { bottom }]}>
                <ThemedButton title="Simpan Slip Gaji" />
            </View>
        </View>
    );
};

export default DetailPayrollScreen;

/* =======================
 * Styles
 * ======================= */
const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.Purple[50],
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(12),
        flex: 1,
    },
    content: {
        backgroundColor: Color.Background.Background,
        padding: scale(16),
        borderRadius: Radius.xs,
    },
    cardClock: {
        flex: 1,
        backgroundColor: Color.Gray[100],
        padding: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: Color.Gray[200],
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: Color.Gray[200],
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
