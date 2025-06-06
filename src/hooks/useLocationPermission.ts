import * as Location from "expo-location";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useLocationPermission = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          "Izin Lokasi Ditolak",
          "Aplikasi membutuhkan akses lokasi untuk memproses absensi dalam radius kantor."
        );
        setGranted(false);
        return false;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          "Layanan Lokasi Nonaktif",
          "Harap aktifkan layanan lokasi di pengaturan perangkat Anda."
        );
        setGranted(false);
        return false;
      }

      setGranted(true);
      return true;
    } catch {
      Alert.alert("Error", "Terjadi kesalahan saat meminta izin lokasi.");
      setGranted(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { granted, loading, requestPermission };
};
