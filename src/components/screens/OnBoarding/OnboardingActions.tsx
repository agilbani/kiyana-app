import { ThemedButton, ThemedGap } from "@/components";
import GlobalStyles from "@/styles/common";
import { OnboardingActionsProps } from "@/types/components";
import { scale } from "@/utils/scaleSize";
import React from "react";
import { StyleSheet, View } from "react-native";

const OnboardingActions = ({ onNext, onSkip }: OnboardingActionsProps) => (
  <View style={[GlobalStyles.flex, styles.spacing]}>
    <ThemedButton variant="primary" title="Selanjutnya" onPress={onNext} />
    <ThemedGap height="md" />
    <ThemedButton variant="outline" title="Lewati" onPress={onSkip} />
  </View>
);

const styles = StyleSheet.create({
  spacing: {
    paddingHorizontal: scale(32),
  },
});

export default React.memo(OnboardingActions);
