import { ThemedLoader } from "@/components";
import { AuthProvider } from "@/context/AppContext";
import GlobalStyles from "@/styles/common";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Appearance, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ViewLoading from "../src/components/ui/ViewLoading";

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
        <AuthProvider>
            <GestureHandlerRootView style={GlobalStyles.flex}>
                <Slot />
            </GestureHandlerRootView>
            <ViewLoading />
        </AuthProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default RootLayout;
