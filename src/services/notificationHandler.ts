import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification:
        async (): Promise<Notifications.NotificationBehavior> => ({
            shouldShowBanner: true, // ✅ wajib
            shouldShowList: true, // ✅ wajib
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
});
