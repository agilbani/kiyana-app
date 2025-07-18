import { ThemedLoader } from "@/components";
import GlobalStyles from "@/styles/common";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-SemiBold": require("../assets/fonts/Roboto-SemiBold.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <ThemedLoader />;
  }

  return (
    <GestureHandlerRootView style={GlobalStyles.flex}>
      <Slot />
    </GestureHandlerRootView>
  );
};

export default RootLayout;
