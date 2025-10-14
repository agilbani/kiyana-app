import { TabBarButton, TabIconWithIndicator } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
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
import { Tabs, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect, useMemo } from "react";
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
    const pathname = usePathname();
    const router = useRouter();

    const insets = useSafeAreaInsets();
    const mainTabScreens = [
        "/dashboard/Dashboard",
        "/attendance",
        "/log-activity",
        "/profile",
    ];

    useEffect(() => {
        if (pathname === "/") {
            router.replace(ROUTES.DASHBOARD);
        }
    }, [pathname]);

    //  const isMainTabScreenActive = mainTabScreens.includes(page);
    const isMainTabScreenActive = mainTabScreens.includes(pathname);

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
                backgroundColor: Color.Base.White,
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
                name="log-activity/index"
                options={{
                    tabBarIcon: createTabBarIcon(IcActiveHome, IcHome),
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
