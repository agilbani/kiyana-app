import {
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedDropdown,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedModal,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { useApp } from "@/context/AppContext";
import { createLoan } from "@/services/loanService";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay, formatRupiahInput } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";

const SALDO = 100000;

type FormValues = {
    reason: string;
    amount: string;
    submission_date: string;
    tenor: string;
};

const Row = ({
    label,
    value,
    bold = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="Regular" color={Color.Text.Secondary}>
            {label}
        </ThemedText>
        <ThemedText type={bold ? "Bold" : "Medium"}>{value}</ThemedText>
    </View>
);

const schema = yup.object().shape({
    reason: yup.string().required("Alasan harus diisi"),
    amount: yup
        .string()
        .required("Jumlah harus diisi")
        .matches(/^[0-9.]+$/, "Jumlah harus berupa angka"),
    submission_date: yup.string().required("Tanggal pengajuan harus diisi"),
    tenor: yup.string().required("Tempo tenor harus diisi"),
});

const CashAdvanceScreen = () => {
    const { user } = useApp();
    const confirmModalRef = useRef<ThemedModal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmedRecipientName, setConfirmedRecipientName] = useState("");

    const optionTenor = [
        {
            label: "Bayar di gajian mendatang",
            value: "1",
        },
        {
            label: "Dipotong 2 kali setiap gajian",
            value: "2",
        },
    ];

    const { control, handleSubmit, reset, setError, getValues } =
        useForm<FormValues>({
            defaultValues: {
                reason: "",
                amount: "",
                submission_date: "",
                tenor: "",
            },
            resolver: yupResolver(schema),
        });

    const onSubmit = (data: FormValues) => {
        confirmModalRef.current?.show();
        // const numericAmount = Number(data.amount.replace(/\./g, ""));

        // if (numericAmount > SALDO) {
        //   setError("amount", { message: "Saldo tidak cukup" });
        //   return;
        // }
    };

    const confirmTransfer = async () => {
        confirmModalRef.current?.hide();
        const data = getValues();
        const numericAmount = Number(data.amount.replace(/\./g, ""));
        setIsLoading(true);
        const body = {
            submission_date: data.submission_date,
            nominal: numericAmount,
            tenor: Number(data.tenor),
            description: data.reason,
        };
        const res = await createLoan(body);
        setIsLoading(false);
        if (res.success) {
            ShowToastMessage(res.message);
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
    };

    return (
        <ThemedContainer>
            <ThemedHeader title="Ajukan Kasbon" />
            <View style={styles.container}>
                <View style={styles.amountWrapper}>
                    <ThemedText size="md" color={Color.Text.Secondary}>
                        Saldo Anda
                    </ThemedText>
                    <ThemedGap height="xxs" />
                    <ThemedText type="Medium" size="lg">
                        {formatRupiahDisplay(`${user?.balance}`)}
                    </ThemedText>
                </View>
                <ThemedGap height="xl" />
                <Controller
                    name="submission_date"
                    control={control}
                    render={({ field, fieldState }) => (
                        <ThemedDatePicker
                            label="Pilih tanggal pengajuan"
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            minimumDate="today"
                        />
                    )}
                />
                <ThemedGap height="md" />
                <Controller
                    name="tenor"
                    control={control}
                    render={({ field, fieldState }) => (
                        <ThemedDropdown
                            items={optionTenor}
                            value={field.value}
                            label="Pilih tempo pembayaran"
                            placeholder="Pilih tempo pembayaran"
                            onValueChange={field.onChange}
                        />
                    )}
                />
                <ThemedGap height="md" />
                <Controller
                    name="reason"
                    control={control}
                    render={({ field, fieldState }) => (
                        <ThemedTextarea
                            label="Alasan"
                            placeholder="Contoh: Uang makan siang"
                            value={field.value}
                            onChangeText={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <ThemedGap height="md" />
                <Controller
                    name="amount"
                    control={control}
                    render={({ field, fieldState }) => (
                        <ThemedInput
                            label="Jumlah"
                            placeholder="Contoh: 100.000"
                            keyboardType="numeric"
                            value={field.value}
                            onChangeText={(text) =>
                                field.onChange(formatRupiahInput(text))
                            }
                            error={fieldState.error?.message}
                            style={{ height: 45 }}
                        />
                    )}
                />
            </View>

            <View style={styles.footer}>
                <ThemedButton
                    title="Ajukan"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </View>

            {/* Modal Konfirmasi */}
            <ThemedModal
                ref={confirmModalRef}
                onClose={() => confirmModalRef.current?.hide()}
            >
                <ThemedText size="lg" type="Medium">
                    Konfirmasi
                </ThemedText>
                <ThemedGap height="xl" />

                <View style={{ gap: 8 }}>
                    <Row label="Alasan" value={getValues("reason")} />
                    <Row
                        label="Jumlah"
                        value={formatRupiahDisplay(getValues("amount"))}
                    />
                </View>
                <ThemedGap height="xxl" />
                <View style={GlobalStyles.rowCenter}>
                    <View style={GlobalStyles.flex}>
                        <ThemedButton
                            variant="outline"
                            title="Batal"
                            onPress={() => confirmModalRef.current?.hide()}
                        />
                    </View>
                    <ThemedGap width="md" />
                    <View style={GlobalStyles.flex}>
                        <ThemedButton
                            title="Konfirmasi"
                            onPress={confirmTransfer}
                        />
                    </View>
                </View>
            </ThemedModal>
        </ThemedContainer>
    );
};

export default CashAdvanceScreen;

const styles = StyleSheet.create({
    container: {
        padding: scale(20),
        ...GlobalStyles.flex,
    },
    amountWrapper: {
        backgroundColor: Color.Background.Background,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderRadius: Radius.sm,
        ...GlobalStyles.shadow,
    },
    footer: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
