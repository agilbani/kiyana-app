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
  reason: string;
  amount: string;
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
});

const CashAdvanceScreen = () => {
  const confirmModalRef = useRef<ThemedModal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedRecipientName, setConfirmedRecipientName] = useState("");

  const { control, handleSubmit, reset, setError, getValues } =
    useForm<FormValues>({
      defaultValues: {
        reason: "",
        amount: "",
      },
      resolver: yupResolver(schema),
    });

  const onSubmit = (data: FormValues) => {
    const numericAmount = Number(data.amount.replace(/\./g, ""));

    if (numericAmount > SALDO) {
      setError("amount", { message: "Saldo tidak cukup" });
      return;
    }

    setIsLoading(true);

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
      <ThemedHeader title="Ajukan Kasbon" />
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
              onChangeText={(text) => field.onChange(formatRupiahInput(text))}
              error={fieldState.error?.message}
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
            <ThemedButton title="Konfirmasi" onPress={confirmTransfer} />
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
