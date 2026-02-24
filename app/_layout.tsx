import { ThemedLoader } from "@/components";
import { AuthProvider } from "@/context/AppContext";
import { saveItem } from "@/store/asyncStore";
import GlobalStyles from "@/styles/common";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Slot, useRouter } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Appearance, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ViewLoading from "../src/components/ui/ViewLoading";

import { setupNotificationChannel } from "@/services/notificationChannel";
import "@/services/notificationHandler";
import { registerForPushNotifications } from "@/services/pushNotificationService";

const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
        "Roboto-SemiBold": require("../assets/fonts/Roboto-SemiBold.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    });

    const router = useRouter();

    useEffect(() => {
        setupNotificationChannel();

        registerForPushNotifications().then(async (token) => {
            if (token) {
                // TODO: kirim ke backend
                console.log("FCM Token:", token);
                await saveItem("fcm_token", token);
            }
        });

        const foregroundSub = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("Foreground notification:", notification);
            },
        );

        const responseListener =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const data = response.notification;
                    console.log("data notif", data);
                },
            );

        return () => {
            foregroundSub.remove();
            responseListener.remove();
        };
    }, []);

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
