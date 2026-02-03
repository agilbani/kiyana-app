import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { ThemedHeaderProps } from "@/types/components";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcArrowLeft } from "@assets/icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

const ThemedHeader: React.FC<ThemedHeaderProps> = ({ title, onPressBack }) => {
    const handleBack = () => {
        router.back();
    };
    return (
        <View style={styles.header}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.backButton}
                onPress={onPressBack ? onPressBack : handleBack}
            >
                <IcArrowLeft />
            </TouchableOpacity>
            <ThemedText type="SemiBold" size="lg">
                {title}
            </ThemedText>
        </View>
    );
};

export default React.memo(ThemedHeader);

const styles = StyleSheet.create({
    header: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(20),
        borderBottomWidth: 1,
        borderColor: Color.Gray[200],
        ...GlobalStyles.center,
    },
    backButton: {
        position: "absolute",
        left: scale(24),
        width: scale(32),
        height: scale(32),
        backgroundColor: Color.Purple[50],
        borderRadius: Radius.rounded,
        ...GlobalStyles.center,
    },
});
