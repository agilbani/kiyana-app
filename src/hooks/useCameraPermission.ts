import { Camera } from "expo-camera";
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

export const useCameraPermission = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    setGranted(status === "granted");
    setLoading(false);
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { status, canAskAgain } =
        await Camera.requestCameraPermissionsAsync();

      if (status === "granted") {
        setGranted(true);
        return true;
      }

      if (!canAskAgain) {
        Alert.alert(
          "Izin Kamera Diperlukan",
          "Silakan buka pengaturan dan izinkan akses kamera.",
          [
            { text: "Batal", style: "cancel" },
            {
              text: "Buka Pengaturan",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Izin Kamera Ditolak",
          "Aplikasi membutuhkan izin kamera untuk fitur ini."
        );
      }

      setGranted(false);
      return false;
    } catch (e) {
      Alert.alert("Error", "Terjadi kesalahan saat meminta izin kamera.");
      setGranted(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { granted, loading, requestPermission, recheck: checkPermission };
};
