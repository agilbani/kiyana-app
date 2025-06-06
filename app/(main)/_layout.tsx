import { TabBarButton, TabIconWithIndicator } from "@/components";
import Color from "@/constants/Color";
import { verticalScale } from "@/utils/scaleSize";
import {
  IcActiveCalendar,
  IcActiveHome,
  IcActiveTask,
  IcCalendar,
  IcHome,
  IcTask,
} from "@assets/icons";
import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { Tabs, useSegments } from "expo-router";
import React, { useMemo } from "react";
import { ViewStyle } from "react-native";

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
  const page = segment[segment.length - 1];
  const mainTabScreenNames = ["dashboard", "attendance", "task"];

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
      } as ViewStyle,
      tabBarButton: renderTabBarButton,
    };
  }, [isMainTabScreenActive]);

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
        name="task"
        options={{
          tabBarIcon: createTabBarIcon(IcActiveTask, IcTask),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
