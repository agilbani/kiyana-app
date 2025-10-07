import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
import { verticalScale } from "@/utils/scaleSize";
import React from "react";
import { StyleSheet, View } from "react-native";

const TabIconWithIndicator = ({
    iconComponent: IconComponent,
    focused,
}: {
    iconComponent: any;
    focused: boolean;
}) => {
    return (
        <View style={GlobalStyles.center}>
            <IconComponent width={24} height={24} color={Color.Green[500]} />
            {focused && (
                <View
                    style={[
                        styles.activeIndicator,
                        { backgroundColor: Color.Green[500] },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    activeIndicator: {
        position: "absolute",
        bottom: -verticalScale(8),
        width: "50%",
        height: verticalScale(2),
        borderRadius: verticalScale(2),
    },
});

export default TabIconWithIndicator;
