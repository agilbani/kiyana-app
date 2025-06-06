import * as Notifications from "expo-notifications";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useNotificationPermission = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const settings = await Notifications.requestPermissionsAsync();
      const isGranted =
        settings.granted ||
        settings.ios?.status ===
          Notifications.IosAuthorizationStatus.AUTHORIZED;

      if (!isGranted) {
        Alert.alert(
          "Izin Notifikasi Ditolak",
          "Aplikasi membutuhkan izin notifikasi untuk mengirim pemberitahuan."
        );
      }

      setGranted(isGranted);
      return isGranted;
    } catch {
      Alert.alert("Error", "Terjadi kesalahan saat meminta izin notifikasi.");
      setGranted(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { granted, loading, requestPermission };
};
