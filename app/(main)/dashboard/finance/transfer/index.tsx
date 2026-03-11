import {
    CustomDropdown,
    ThemedButton,
    ThemedContainer,
    ThemedErrorMessage,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedModal,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getAllEmployee } from "@/services/masterService";
import { postTransfer } from "@/services/payoutService";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay, formatRupiahInput } from "@/utils/currency";
import LoadingManager from "@/utils/LoadingManager";
import { scale, verticalScale } from "@/utils/scaleSize";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import * as yup from "yup";

const SALDO = 100000;

type FormValues = {
    recipient: string;
    amount: string;
    note: string;
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
    recipient: yup
        .string()
        .required("Penerima harus diisi")
        .min(1, "Nama Penerima tidak boleh kosong"),
    amount: yup
        .string()
        .required("Jumlah harus diisi")
        .matches(/^[0-9.]+$/, "Jumlah harus berupa angka"),
    note: yup.string().default(""),
});

const TransferScreen = () => {
    const { user } = useApp();
    const confirmModalRef = useRef<ThemedModal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmedRecipientName, setConfirmedRecipientName] = useState("");
    const [listEmployee, setListEmployee] = useState<any>([]);

    const { control, handleSubmit, reset, setError, getValues } =
        useForm<FormValues>({
            defaultValues: {
                recipient: "",
                amount: "",
                note: "",
            },
            resolver: yupResolver(schema),
        });

    const fetchRecipientName = (recipientId: string): string => {
        if (recipientId === "08123456789") return "Budi Santoso";
        if (recipientId === "user12345") return "Siti Aminah";
        return "Nama Penerima Tidak Dikenal";
    };

    const onSubmit = async (data: FormValues) => {
        //   console.log("cek data form", data);

        const recipientName = fetchRecipientName(data.recipient);
        const numericAmount = Number(data.amount.replace(/\./g, ""));

        if (numericAmount > user?.balance) {
            setError("amount", { message: "Saldo tidak cukup" });
            return;
        }

        LoadingManager.show();
        const res = await postTransfer({
            receiver_id: data.recipient,
            notes: data.note,
            amount: Number(data.amount.replace(/\./g, "")),
        });
        LoadingManager.hide();
        //   console.log("res tf", res);

        if (res.success) {
            Alert.alert("Berhasil!", "Saldo anda berhasil di transfer");
            router.replace(ROUTES.DASHBOARD);
        } else {
            Alert.alert(
                "Gagal!",
                "Saldo anda gagal di transfer, silahkan coba beberapa saat lagi",
            );
        }
    };

    const confirmTransfer = async () => {
        confirmModalRef.current?.hide();
    };

    const getListEmployee = async () => {
        LoadingManager.show();
        const res = await getAllEmployee();
        LoadingManager.hide();
        //   console.log("res employee", res);
        if (res.success) {
            let arr = [];
            for (let i = 0; i < res.data.length; i++) {
                arr.push({
                    name: `${res.data[i].first_name} ${
                        res.data[i].last_name ? res.data[i].last_name : ""
                    }`,
                    value: res.data[i].id,
                });
            }
            setListEmployee(arr);
        }
    };

    useEffect(() => {
        getListEmployee();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Kirim Uang" />
            <View style={styles.container}>
                <View style={styles.amountWrapper}>
                    <ThemedText size="md" color={Color.Text.Secondary}>
                        Saldo Anda
                    </ThemedText>
                    <ThemedGap height="xxs" />
                    <ThemedText type="Medium" size="lg">
                        {formatRupiahDisplay(user?.balance)}
                    </ThemedText>
                </View>
                <ThemedGap height="xl" />
                <Controller
                    name="recipient"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <CustomDropdown
                                label="Nama Penerima"
                                items={listEmployee}
                                onSelectItem={(selected: any) =>
                                    field.onChange(selected?.value)
                                }
                                value={field.value}
                                maxHeight={200}
                                searchable
                            />
                            {fieldState.error?.message && (
                                <View style={{ marginLeft: 4 }}>
                                    <ThemedErrorMessage
                                        message={fieldState.error?.message}
                                    />
                                </View>
                            )}
                        </>
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

            <View style={styles.footer}>
                <ThemedButton
                    title="Kirim Uang"
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
                    <Row
                        label="Nomor HP / ID pengguna"
                        value={getValues("recipient")}
                    />
                    <Row label="Nama Penerima" value={confirmedRecipientName} />
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
        </ThemedContainer>
    );
};

export default TransferScreen;

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
