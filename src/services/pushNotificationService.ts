import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotifications() {
    if (!Device.isDevice) {
        console.log("Must use physical device");
        return null;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    console.log("cek finalStatus", finalStatus);

    if (existingStatus !== "granted") {
        console.log("asd");

        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("asd1");
        console.log("Permission not granted");
        return null;
    }

    //  const token = await Notifications.getExpoPushTokenAsync({
    //      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    //  });

    try {
        // Ambil device push token (FCM/APNs)
        const tokenResponse = await Notifications.getDevicePushTokenAsync();

        const deviceToken =
            tokenResponse?.data || tokenResponse?.token || tokenResponse; // fallback

        console.log("Device Push Token:", deviceToken);

        // storage.setString('fcmToken', deviceToken)

        return deviceToken;
    } catch (err) {
        console.log("Error getting device push token:", err);
        return null;
    }
}
