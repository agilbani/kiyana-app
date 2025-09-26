import { ThemedLoader } from "@/components";
import { AuthProvider } from "@/context/AppContext";
import GlobalStyles from "@/styles/common";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import { Appearance, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
        "Roboto-SemiBold": require("../assets/fonts/Roboto-SemiBold.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    });

    useEffect(() => {
        SystemUI.setBackgroundColorAsync("#ffffff");
        Appearance.setColorScheme("light");
    }, []);

    if (!fontsLoaded) {
        return <ThemedLoader />;
    }

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <GestureHandlerRootView style={GlobalStyles.flex}>
                    <Slot />
                </GestureHandlerRootView>
            </AuthProvider>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default RootLayout;
