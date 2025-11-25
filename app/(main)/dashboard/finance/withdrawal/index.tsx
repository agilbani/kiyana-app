import {
    ThemedButton,
    ThemedDatePicker,
    ThemedDropdown,
    ThemedErrorMessage,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedModal,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import { BANKS } from "@/constants/Dummy/Bank";
import Radius from "@/constants/Radius";
import { useApp } from "@/context/AppContext";
import { postPayout } from "@/services/payoutService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import { formatRupiahDisplay, formatRupiahInput } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import * as yup from "yup";

const SALDO = 100000;

type FormValues = {
    accountOwner: string;
    bank: string;
    accountNumber: string;
    amount: string;
    note: string;
    date: string;
    type: string;
};

const optionsType = [
    {
        label: "Cash",
        value: "cash",
    },
    {
        label: "Transfer",
        value: "transfer",
    },
];

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

const WithdrawalScreen = () => {
    const { user } = useApp();
    const { bottom } = usePositionBottom();
    const schema = yup.object().shape({
        //   accountOwner: yup
        //       .string()
        //       .required("Nama pemilik rekening harus diisi")
        //       .min(5, "Nama pemilik rekening minimal 5 karakter"),
        accountOwner: yup.string().optional(),
        bank: yup.string().required("Pilih bank tujuan"),
        accountNumber: yup.string().required("Nomor rekening harus diisi"),
        date: yup.string().required("Tanggal penarikan harus diisi"),
        amount: yup
            .string()
            .required("Jumlah harus diisi")
            .test("is-valid", "Jumlah harus lebih dari 0", (value) => {
                const numeric = Number(value?.replace(/\./g, ""));
                return numeric > 0;
            })
            .test("is-saldo", "Saldo tidak cukup", (value) => {
                const numeric = Number(value?.replace(/\./g, ""));
                return numeric <= user?.balance;
            }),
        note: yup.string().default(""),
        type: yup.string().required("Silahkan pilih metode pembayaran"),
    });

    const confirmModalRef = useRef<ThemedModal | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [optionsTransfer, setOptionsTransfer] = useState<any>([]);

    const { control, handleSubmit, setError, clearErrors, reset, getValues } =
        useForm<FormValues>({
            defaultValues: {
                accountOwner: "",
                bank: "",
                accountNumber: "",
                amount: "",
                date: "",
                type: "",
            },
            resolver: yupResolver(schema),
        });

    const typePayment = useWatch({ control, name: "type" });

    const onSubmit = (data: FormValues) => {
        clearErrors();
        let hasError = false;

        const numericAmount = Number(data.amount.replace(/\./g, ""));

        if (!data.accountOwner) {
            setError("accountOwner", {
                message: "Nama pemilik rekening harus diisi",
            });
            hasError = true;
        } else if (data.accountOwner.length < 5) {
            setError("accountOwner", {
                message: "Nama pemilik rekening minimal 5 karakter",
            });
            hasError = true;
        }

        if (!data.bank) {
            setError("bank", {
                message: "Pilih bank tujuan",
            });
            hasError = true;
        }

        if (!data.accountNumber) {
            setError("accountNumber", {
                message: "Nomor rekening harus diisi",
            });
            hasError = true;
        }

        if (!data.amount) {
            setError("amount", {
                message: "Jumlah harus diisi",
            });
            hasError = true;
        } else if (isNaN(numericAmount) || numericAmount <= 0) {
            setError("amount", {
                message: "Jumlah harus lebih dari 0",
            });
            hasError = true;
        } else if (numericAmount > SALDO) {
            setError("amount", {
                message: "Saldo tidak cukup",
            });
            hasError = true;
        }

        if (hasError) return;

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            confirmModalRef.current?.show();
        }, 1000);
    };

    const confirmTransfer = async () => {
        confirmModalRef.current?.hide();
        const dataForm = getValues();
        //   console.log("cek dataForm", dataForm);

        setIsLoading(true);
        const res = await postPayout({
            number: dataForm?.accountNumber,
            employee_id: user?.id,
            date: moment(dataForm.date, "DD-MM-YYYY").format("YYYY-MM-DD"),
            nominal: Number(dataForm.amount.replace(/\./g, "")),
        });
        setIsLoading(false);
        //   console.log("res payout", res);

        if (res.success) {
            ShowToastMessage("Pengajuan anda berhasil dikirim");
            router.back();
        } else {
            ShowToastMessage(
                res.message ??
                    "Payout untuk karyawan tersebut sudah dibuat pada tanggal tersebut"
            );
        }
    };

    const getOptionTransfer = () => {
        let opt = [];
        for (let i = 0; i < BANKS.length; i++) {
            opt.push({
                label: BANKS[i].key,
                value: BANKS[i].value,
            });
        }
        setOptionsTransfer(opt);
    };

    useEffect(() => {
        getOptionTransfer();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.Base.White,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <StatusBar barStyle={"light-content"} />
            <ThemedHeader title="Ambil Uang" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
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
                        <ThemedGap height="md" />
                        <Controller
                            name="type"
                            control={control}
                            render={({ field, fieldState }) => (
                                <View>
                                    <ThemedDropdown
                                        items={optionsType}
                                        value={field.value}
                                        label="Pilih metode pembayaran"
                                        placeholder="Pilih metode pembayaran"
                                        onValueChange={field.onChange}
                                    />
                                    <ThemedErrorMessage
                                        message={fieldState.error?.message}
                                    />
                                </View>
                            )}
                        />
                        {typePayment === "transfer" && (
                            <>
                                <ThemedGap height="md" />
                                <Controller
                                    name="bank"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <View>
                                            <ThemedDropdown
                                                items={optionsTransfer}
                                                value={field.value}
                                                label="Pilih tujuan transfer"
                                                placeholder="Pilih tujuan transfer"
                                                onValueChange={field.onChange}
                                            />
                                            <ThemedErrorMessage
                                                message={
                                                    fieldState.error?.message
                                                }
                                            />
                                        </View>
                                    )}
                                />
                                <ThemedGap height="xl" />
                                <Controller
                                    control={control}
                                    name="accountOwner"
                                    render={({ field, fieldState }) => (
                                        <ThemedInput
                                            label="Nama Pemilik Rekening"
                                            placeholder="Masukkan nama sesuai rekening"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            error={fieldState.error?.message}
                                            style={{ height: 45 }}
                                        />
                                    )}
                                />
                                <ThemedGap height="md" />
                                <Controller
                                    control={control}
                                    name="accountNumber"
                                    render={({ field, fieldState }) => (
                                        <ThemedInput
                                            label="Nomor Rekening"
                                            placeholder="Masukkan nomor rekening tujuan"
                                            keyboardType="numeric"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            error={fieldState.error?.message}
                                            style={{ height: 45 }}
                                        />
                                    )}
                                />
                            </>
                        )}
                        <ThemedGap height="md" />
                        <Controller
                            control={control}
                            name="amount"
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
                        <ThemedGap height="md" />
                        <Controller
                            name="date"
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
                            name="note"
                            control={control}
                            render={({ field, fieldState }) => (
                                <ThemedTextarea
                                    label="Keterangan"
                                    placeholder="Contoh: Uang makan siang"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </View>
                </ScrollView>
                <View style={[styles.footer, { bottom: 0 }]}>
                    <ThemedButton
                        title="Ambil Uang"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                        disabled={isLoading || user?.balance === 0}
                    />
                </View>
            </View>
            {/* Modal Konfirmasi Transfer */}
            <ThemedModal
                ref={confirmModalRef}
                onClose={() => confirmModalRef.current?.hide()}
            >
                <ThemedText size="lg" type="Medium">
                    Konfirmasi
                </ThemedText>
                <ThemedGap height="xl" />

                <View style={{ gap: 8 }}>
                    <Row label="Bank Tujuan" value={getValues("bank")} />
                    <Row
                        label="No. Rekening"
                        value={getValues("accountNumber")}
                    />
                    <Row
                        label="Nama Penerima"
                        value={getValues("accountOwner")}
                    />
                    <Row
                        label="Jumlah"
                        value={formatRupiahDisplay(getValues("amount"))}
                    />
                    <Row label="Biaya Admin" value="Rp 0" />
                    <Row
                        label="Total"
                        value={formatRupiahDisplay(getValues("amount"))}
                        bold
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
        </View>
    );
};

export default WithdrawalScreen;

const styles = StyleSheet.create({
    container: {
        padding: scale(20),
        ...GlobalStyles.flex,
    },
    headerWrapper: {
        marginHorizontal: scale(-20),
        marginTop: scale(-20),
        marginBottom: scale(20),
    },
    amountWrapper: {
        backgroundColor: Color.Background.Background,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderRadius: Radius.sm,
        ...GlobalStyles.shadow,
    },
    footer: {
        position: "absolute",
        width: "100%",
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
