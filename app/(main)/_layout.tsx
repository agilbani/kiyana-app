import { TabBarButton, TabIconWithIndicator } from "@/components";
import Color from "@/constants/Color";
import { verticalScale } from "@/utils/scaleSize";
import {
    IcActiveCalendar,
    IcActiveHome,
    IcCalendar,
    IcHome,
    IcProfile,
    IcProfileActive,
} from "@assets/icons";
import {
    BottomTabBarButtonProps,
    BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { Tabs, useSegments } from "expo-router";
import React, { useMemo } from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const renderTabBarButton = (props: BottomTabBarButtonProps) => (
    <TabBarButton {...props} />
);

const createTabBarIcon = (ActiveIcon: any, InactiveIcon: any) => {
    return ({ focused }: { focused: boolean }) => (
        <TabIconWithIndicator
            iconComponent={focused ? ActiveIcon : InactiveIcon}
            focused={focused}
        />
    );
};

const MainLayout = () => {
    const segment = useSegments();
    const insets = useSafeAreaInsets();
    console.log("cek segment", segment);

    const page = segment[segment.length - 1];
    const mainTabScreenNames = ["Dashboard", "attendance", "profile"];

    const isMainTabScreenActive = mainTabScreenNames.includes(page);

    const screenOptionsObject = useMemo((): BottomTabNavigationOptions => {
        const displayStyle: "flex" | "none" = isMainTabScreenActive
            ? "flex"
            : "none";

        return {
            animation: "shift",
            freezeOnBlur: true,
            headerShown: false,
            tabBarActiveTintColor: Color.Background.Background,
            tabBarInactiveTintColor: Color.Base.White,
            tabBarShowLabel: false,
            tabBarStyle: {
                height: verticalScale(74),
                backgroundColor: Color.Background.Navbar,
                paddingTop: verticalScale(12),
                display: displayStyle,
                marginBottom: insets.bottom,
            } as ViewStyle,
            tabBarButton: renderTabBarButton,
        };
    }, [isMainTabScreenActive, insets.bottom]);

    return (
        <Tabs screenOptions={screenOptionsObject}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarIcon: createTabBarIcon(IcActiveHome, IcHome),
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    tabBarIcon: createTabBarIcon(IcActiveCalendar, IcCalendar),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: createTabBarIcon(IcProfileActive, IcProfile),
                }}
            />
        </Tabs>
    );
};

export default MainLayout;
