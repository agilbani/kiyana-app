import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import { ROUTES } from "@/constants/Routes";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import ILNotification from "@assets/images/permissions/ILNotification.png";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback } from "react";

const NotificationPermissionScreen = () => {
  const router = useRouter();
  const { requestPermission } = useNotificationPermission();

  const redirectTo = useCallback(async () => {
    await SecureStore.setItemAsync("hasHandledPermissions", "true");
    router.push(ROUTES.LOCATION_PERMISSION);
  }, [router]);

  const handleAllow = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      router.push(ROUTES.LOCATION_PERMISSION);
    }
  }, [requestPermission, router]);

  return (
    <PermissionScreen
      icon={ILNotification}
      title="Izinkan Notifikasi"
      description="Notifikasi digunakan untuk memberitahukan informasi penting seputar absensi dan aktivitas lainnya secara real-time."
      onAllow={handleAllow}
      onMaybeLater={redirectTo}
    />
  );
};

export default NotificationPermissionScreen;
