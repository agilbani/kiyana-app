import {
  ThemedButton,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcClock } from "@assets/icons";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

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
      <ThemedText type="Medium" size="md" color={color || Color.Text.Body}>
        {value}
      </ThemedText>
    </View>
  )
);

const DetailPayrollScreen = () => {
  return (
    <ThemedContainer>
      <ThemedHeader title="Slip Gaji" />
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="Medium" size="md">
            Total Jam Kerja
          </ThemedText>
          <ThemedText type="Regular" size="sm" color={Color.Gray[500]}>
            Periode Pembayaran 1 - 30 September 2024
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
              <ThemedText size="xl">00:00 Jam</ThemedText>
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
                  Periode Ini
                </ThemedText>
              </View>
              <ThemedGap height="xs" />
              <ThemedText size="xl">40:00 Jam</ThemedText>
            </View>
          </View>
        </View>

        <ThemedGap height="md" />

        {/* Rincian Gaji */}
        <View style={styles.content}>
          <ThemedText type="Medium" size="md">
            Rincian Gaji
          </ThemedText>
          <ThemedText type="Regular" size="sm" color={Color.Gray[500]}>
            Detail lengkap slip gaji
          </ThemedText>
          <ThemedGap height="sm" />
          <View style={styles.divider} />
          <ThemedGap height="sm" />
          <PayrollRow label="Gaji Pokok" value="Rp700.000" />
          <ThemedGap height="sm" />
          <PayrollRow label="Pajak" value="-Rp70.000" color={Color.Red[500]} />
          <ThemedGap height="sm" />
          <PayrollRow
            label="Reimbursement"
            value="+Rp70.000"
            color={Color.Green[500]}
          />
          <ThemedGap height="sm" />
          <PayrollRow
            label="Bonus"
            value="+Rp100.000"
            color={Color.Green[500]}
          />
          <ThemedGap height="sm" />
          <PayrollRow label="Lembur" value="+Rp0" color={Color.Green[500]} />
          <ThemedGap height="sm" />
          <View style={styles.divider} />
          <ThemedGap height="sm" />
          <PayrollRow label="Total Gaji" value="Rp800.000" />
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedButton title="Simpan Slip Gaji" />
      </View>
    </ThemedContainer>
  );
};

export default DetailPayrollScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Purple[50],
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    ...GlobalStyles.flex,
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
    bottom: 0,
    backgroundColor: Color.Background.Background,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(14),
    borderTopWidth: 1,
    borderColor: Color.Gray[200],
  },
});
