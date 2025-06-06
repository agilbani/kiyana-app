import {
  ThemedButton,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedInput,
  ThemedModal,
  ThemedText,
  ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay, formatRupiahInput } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
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
    .min(5, "Nomor HP / ID pengguna tidak valid"),
  amount: yup
    .string()
    .required("Jumlah harus diisi")
    .matches(/^[0-9.]+$/, "Jumlah harus berupa angka"),
  note: yup.string().default(""),
});

const TransferScreen = () => {
  const confirmModalRef = useRef<ThemedModal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedRecipientName, setConfirmedRecipientName] = useState("");

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

  const onSubmit = (data: FormValues) => {
    const recipientName = fetchRecipientName(data.recipient);
    const numericAmount = Number(data.amount.replace(/\./g, ""));

    if (recipientName === "Nama Penerima Tidak Dikenal") {
      setError("recipient", { message: "Penerima tidak ditemukan" });
      return;
    }

    if (numericAmount > SALDO) {
      setError("amount", { message: "Saldo tidak cukup" });
      return;
    }

    setIsLoading(true);
    setConfirmedRecipientName(recipientName);

    setTimeout(() => {
      confirmModalRef.current?.show();
      setIsLoading(false);
    }, 1000);
  };

  const confirmTransfer = () => {
    confirmModalRef.current?.hide();
    setIsLoading(true);

    setTimeout(() => {
      reset();
      setIsLoading(false);
      Alert.alert("Transfer Berhasil");
    }, 2000);
  };

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
            Rp {SALDO.toLocaleString("id-ID")}
          </ThemedText>
        </View>
        <ThemedGap height="xl" />
        <Controller
          name="recipient"
          control={control}
          render={({ field, fieldState }) => (
            <ThemedInput
              label="Penerima"
              placeholder="Masukkan Nomor HP / ID pengguna"
              autoCapitalize="none"
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
              onChangeText={(text) => field.onChange(formatRupiahInput(text))}
              error={fieldState.error?.message}
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
          <Row label="Nomor HP / ID pengguna" value={getValues("recipient")} />
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
            <ThemedButton title="Konfirmasi" onPress={confirmTransfer} />
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
