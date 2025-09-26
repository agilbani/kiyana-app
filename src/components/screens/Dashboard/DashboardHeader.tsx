import { ThemedGap, ThemedImage, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { User } from "@/types/auth";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcBell } from "@assets/icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface DashboardHeaderProps {
    userData: User | null;
    onPressNotif: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userData,
    onPressNotif,
}) => {
    return (
        <View style={styles.header}>
            <View style={GlobalStyles.rowCenter}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push(ROUTES.PROFILE)}
                >
                    <ThemedImage
                        source={{ uri: "https://picsum.photos/200" }}
                        style={styles.profile}
                    />
                </TouchableOpacity>
                <ThemedGap width="xs" />
                <View>
                    <ThemedText type="Medium">{`${userData?.first_name} ${userData?.last_name}`}</ThemedText>
                    <ThemedText
                        type="Medium"
                        size="sm"
                        color={Color.Purple[600]}
                    >
                        {userData?.role?.name}
                    </ThemedText>
                </View>
            </View>
            <TouchableOpacity onPress={onPressNotif} style={styles.iconWrapper}>
                <IcBell />
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(DashboardHeader);

const styles = StyleSheet.create({
    header: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
        borderColor: Color.Gray[200],
        ...GlobalStyles.rowSpaceBetween,
    },
    profile: {
        width: scale(44),
        height: scale(44),
        borderRadius: Radius.rounded,
    },
    iconWrapper: {
        backgroundColor: Color.Purple[50],
        width: scale(40),
        height: scale(40),
        borderRadius: Radius.rounded,
        ...GlobalStyles.center,
    },
});
