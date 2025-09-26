import { ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { DashboardAnnouncementProps } from "@/types/components";
import { scale } from "@/utils/scaleSize";
import { IcWarning } from "@assets/icons";
import React from "react";
import { StyleSheet, View } from "react-native";

const DashboardAnnouncement: React.FC<DashboardAnnouncementProps> = ({
    text,
}) => {
    return (
        text && (
            <View style={styles.annountcementWrapper}>
                <View style={{ width: "8%" }}>
                    <IcWarning stroke={Color.Red[500]} />
                </View>
                <ThemedGap width="sm" />
                <ThemedText
                    type="Medium"
                    color={Color.Red[500]}
                    style={{ maxWidth: "90%" }}
                >
                    {text}
                </ThemedText>
            </View>
        )
    );
};

export default React.memo(DashboardAnnouncement);

const styles = StyleSheet.create({
    annountcementWrapper: {
        backgroundColor: Color.Yellow[200],
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        borderRadius: Radius.sm,
        borderWidth: 1,
        borderColor: Color.Yellow[500],
        ...GlobalStyles.rowCenter,
    },
});
