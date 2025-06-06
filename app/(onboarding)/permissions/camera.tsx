import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import { ROUTES } from "@/constants/Routes";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import ILCamera from "@assets/images/permissions/ILCamera.png";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback } from "react";

const CameraPermissionScreen = () => {
  const router = useRouter();
  const { requestPermission } = useCameraPermission();

  const redirectTo = useCallback(async () => {
    await SecureStore.setItemAsync("hasHandledPermissions", "true");
    router.push(ROUTES.NOTIFICATION_PERMISSION);
  }, [router]);

  const handleAllow = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      redirectTo();
    }
  }, [requestPermission, redirectTo]);

  return (
    <PermissionScreen
      icon={ILCamera}
      title="Izinkan Akses Kamera"
      description="Akses kamera dibutuhkan untuk absensi berbasis foto secara akurat dan aman."
      onAllow={handleAllow}
      onMaybeLater={redirectTo}
    />
  );
};

export default CameraPermissionScreen;
