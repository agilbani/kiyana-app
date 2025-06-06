import { ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcConvertCard, IcMoneyReceive, IcReceiptEdit } from "@assets/icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const DashboardCard = () => {
  const redirectToCashAdvance = useCallback(() => {
    router.push(ROUTES.DASHBOARD_CASHADVANCE);
  }, []);

  const redirectToTransfer = useCallback(() => {
    router.push(ROUTES.DASHBOARD_TRANSFER);
  }, []);
  const redirectToWithdrawal = useCallback(() => {
    router.push(ROUTES.DASHBOARD_WITHDRAWAL);
  }, []);

  return (
    <LinearGradient
      colors={["#5033A4", "#331098A6"]}
      locations={[0, 1]}
      start={{ x: 0.9, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.card}
    >
      <View>
        <View style={GlobalStyles.center}>
          <ThemedText size="sm" color={Color.Gray[50]}>
            Saldo
          </ThemedText>
          <ThemedText type="SemiBold" size="xl" color={Color.Base.White}>
            Rp 10.000.000
          </ThemedText>
        </View>
        <ThemedGap height="md" />
        <View style={GlobalStyles.rowSpaceBetween}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={GlobalStyles.center}
            onPress={redirectToCashAdvance}
          >
            <IcReceiptEdit stroke={Color.Base.White} />
            <ThemedGap height="sm" />
            <ThemedText type="Medium" size="sm" color={Color.Base.White}>
              Ajukan Kasbon
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={GlobalStyles.center}
            onPress={redirectToWithdrawal}
          >
            <IcMoneyReceive stroke={Color.Base.White} />
            <ThemedGap height="sm" />
            <ThemedText type="Medium" size="sm" color={Color.Base.White}>
              Ambil Uang
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={GlobalStyles.center}
            onPress={redirectToTransfer}
          >
            <IcConvertCard stroke={Color.Base.White} />
            <ThemedGap height="sm" />
            <ThemedText type="Medium" size="sm" color={Color.Base.White}>
              Kirim Uang
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default React.memo(DashboardCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: scale(16),
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(24),
  },
  line: {
    width: 1,
    height: verticalScale(24),
    backgroundColor: Color.Base.White,
  },
});
