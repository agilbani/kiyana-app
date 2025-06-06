import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import { ROUTES } from "@/constants/Routes";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import ILLocation from "@assets/images/permissions/ILocation.png";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback } from "react";

const LocationPermissionScreen = () => {
  const router = useRouter();
  const { requestPermission } = useLocationPermission();

  const redirectTo = useCallback(async () => {
    await SecureStore.setItemAsync("hasHandledPermissions", "true");
    router.push(ROUTES.LOGIN);
  }, [router]);

  const handleAllow = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      redirectTo();
    }
  }, [requestPermission, redirectTo]);

  return (
    <PermissionScreen
      icon={ILLocation}
      title="Izinkan Akses Lokasi"
      description="Lokasi digunakan untuk memastikan absensi dilakukan di area kantor yang sesuai."
      onAllow={handleAllow}
      onMaybeLater={redirectTo}
    />
  );
};

export default LocationPermissionScreen;
