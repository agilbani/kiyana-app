import {
  ThemedButton,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedInput,
  ThemedModal,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const SALDO = 100000;

type FormState = {
  recipient: string;
  amount: string;
  recipientError: string;
  amountError: string;
  isLoading: boolean;
};

const TransferScreen = () => {
  const confirmModalRef = useRef<ThemedModal | null>(null);

  const [form, setForm] = useState<FormState>({
    recipient: "",
    amount: "",
    recipientError: "",
    amountError: "",
    isLoading: false,
  });

  const [confirmedRecipientName, setConfirmedRecipientName] =
    useState<string>("");

  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (text: string) => {
    let numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue.length > 1 && numericValue.startsWith("0")) {
      numericValue = numericValue.replace(/^0+/, "");
    }
    const formatted = formatRupiah(numericValue);

    setForm((prev) => ({
      ...prev,
      amount: formatted,
      amountError: "",
    }));
  };

  const handleRecipientChange = (text: string) => {
    setForm((prev) => ({
      ...prev,
      recipient: text,
      recipientError: "",
    }));
  };

  const validateRecipient = () => {
    if (!form.recipient) {
      setForm((prev) => ({ ...prev, recipientError: "Penerima harus diisi" }));
      return false;
    }
    if (form.recipient.length < 5) {
      setForm((prev) => ({
        ...prev,
        recipientError: "Nomor HP / ID pengguna tidak valid",
      }));
      return false;
    }

    const recipientName = fetchRecipientName(form.recipient);
    if (recipientName === "Nama Penerima Tidak Dikenal") {
      setForm((prev) => ({
        ...prev,
        recipientError: "Penerima tidak ditemukan",
      }));
      return false;
    }

    return true;
  };

  const validateAmount = () => {
    const numericAmount = Number(form.amount.replace(/\./g, ""));
    if (!form.amount) {
      setForm((prev) => ({
        ...prev,
        amountError: "Jumlah transfer harus diisi",
      }));
      return false;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setForm((prev) => ({
        ...prev,
        amountError: "Jumlah transfer harus angka dan lebih dari 0",
      }));
      return false;
    }
    if (numericAmount > SALDO) {
      setForm((prev) => ({ ...prev, amountError: "Saldo tidak cukup" }));
      return false;
    }
    return true;
  };

  const fetchRecipientName = (recipientId: string): string => {
    if (recipientId === "08123456789") return "Budi Santoso";
    if (recipientId === "user12345") return "Siti Aminah";
    return "Nama Penerima Tidak Dikenal";
  };

  const handleSend = () => {
    setForm((prev) => ({
      ...prev,
      recipientError: "",
      amountError: "",
    }));

    if (!validateRecipient() || !validateAmount()) {
      return;
    }

    const recipientName = fetchRecipientName(form.recipient);

    if (recipientName === "Nama Penerima Tidak Dikenal") {
      setForm((prev) => ({
        ...prev,
        recipientError: "Penerima tidak ditemukan",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      isLoading: true,
    }));

    setTimeout(() => {
      setConfirmedRecipientName(recipientName);
      setForm((prev) => ({
        ...prev,
        recipientError: "",
        amountError: "",
        isLoading: false,
      }));

      console.log("kesini");
      confirmModalRef.current?.show();
    }, 2000);
  };

  const confirmTransfer = () => {
    confirmModalRef.current?.hide();

    setForm((prev) => ({
      ...prev,
      isLoading: true,
    }));

    setTimeout(() => {
      setForm({
        recipient: "",
        amount: "",
        recipientError: "",
        amountError: "",
        isLoading: false,
      });
      Alert.alert("Transfer Berhasil");
    }, 2000);
  };

  return (
    <ThemedContainer>
      <ThemedHeader title="Kirim Saldo" />
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
        <ThemedInput
          label="Penerima"
          placeholder="Masukkan Nomor HP / ID pengguna"
          value={form.recipient}
          onChangeText={handleRecipientChange}
          autoCapitalize="none"
          error={form.recipientError}
        />
        <ThemedGap height="md" />
        <ThemedInput
          label="Jumlah Uang"
          placeholder="Masukkan Jumlah Transfer"
          value={form.amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          error={form.amountError}
        />
      </View>
      <View style={styles.footer}>
        <ThemedButton
          title="Kirim Saldo"
          onPress={handleSend}
          loading={form.isLoading}
          disabled={form.isLoading}
        />
      </View>

      {/* Modal Konfirmasi Transfer */}
      <ThemedModal
        ref={confirmModalRef}
        onClose={() => confirmModalRef.current?.hide()}
      >
        <ThemedText size="lg" type="Medium">
          Konfirmasi Transfer
        </ThemedText>
        <ThemedGap height="sm" />
        <ThemedText type="Regular">
          Nomor HP / ID pengguna :
          <ThemedText type="Bold">{form.amount}</ThemedText>
        </ThemedText>
        <ThemedGap height="xxs" />
        <ThemedText type="Regular">
          Nama : <ThemedText type="Bold">{confirmedRecipientName}</ThemedText>
        </ThemedText>
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
