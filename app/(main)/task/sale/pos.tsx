import {
  ThemedBottomSheet,
  ThemedButton,
  ThemedContainer,
  ThemedDatePicker,
  ThemedGap,
  ThemedHeader,
  ThemedInput,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";

const POSMenuScreen = () => {
  const ref = useRef<ThemedBottomSheet | null>(null);

  return (
    <ThemedContainer>
      <ThemedHeader title="Menu Kasir" />
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="SemiBold" size="md">
            Formulir Transaksi Kasir
          </ThemedText>
          <ThemedText type="Regular" size="sm" color={Color.Gray[500]}>
            Lengkapi informasi berikut untuk mencatat transaksi.
          </ThemedText>
          <ThemedGap height="lg" />

          <ThemedInput
            label="Nama Pelanggan"
            placeholder="Masukkan nama pelanggan"
          />
          <ThemedGap height="md" />
          <ThemedInput label="Nama Produk" placeholder="Masukkan nama produk" />
          <ThemedGap height="md" />
          <ThemedInput
            label="Jumlah"
            placeholder="Masukkan jumlah"
            keyboardType="numeric"
          />
          <ThemedGap height="md" />
          <ThemedInput
            label="Harga Satuan"
            placeholder="Masukkan harga satuan"
            keyboardType="numeric"
          />
          <ThemedGap height="md" />
          <ThemedInput
            label="Total Bayar"
            placeholder="Masukkan total bayar"
            keyboardType="numeric"
          />
          <ThemedGap height="md" />
          <ThemedDatePicker label="Tanggal Transaksi" />
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedButton
          title="Simpan Transaksi"
          onPress={() => ref.current?.show()}
        />
      </View>

      <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
        <ThemedText type="SemiBold" size="lg" style={GlobalStyles.center}>
          Simpan Transaksi
        </ThemedText>
        <ThemedGap height="md" />
        <ThemedText type="Medium" size="md" color={Color.Text.Secondary}>
          Apakah kamu yakin ingin menyimpan transaksi ini? Pastikan semua data
          telah sesuai.
        </ThemedText>
        <ThemedGap height="xl" />
        <ThemedButton title="Ya, Simpan Sekarang" />
        <ThemedGap height="md" />
        <ThemedButton
          variant="outline"
          title="Batal"
          onPress={() => ref.current?.hide()}
        />
      </ThemedBottomSheet>
    </ThemedContainer>
  );
};

export default POSMenuScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Purple[50],
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    ...GlobalStyles.flex,
  },
  content: {
    backgroundColor: Color.Background.Background,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(24),
    borderRadius: Radius.xs,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.Background.Background,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(14),
    borderTopWidth: 1,
    borderColor: Color.Gray[200],
  },
});
