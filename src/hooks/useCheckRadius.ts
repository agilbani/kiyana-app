import { OFFICE_LOCATION } from "@/constants/Location";
import { getDistanceFromLatLonInMeters } from "@/utils/locationUtils";
import * as Location from "expo-location";
import { useCallback, useState } from "react";

export const useCheckRadius = () => {
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const checkLocation = useCallback(async () => {
    setLoading(true);
    setIsWithinRadius(null);
    setDistance(null);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const { latitude, longitude } = location.coords;
      setCoords(location.coords);

      const distanceMeter = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        OFFICE_LOCATION.LATITUDE,
        OFFICE_LOCATION.LONGITUDE
      );

      setDistance(distanceMeter);
      setIsWithinRadius(distanceMeter <= OFFICE_LOCATION.RADIUS_METERS);
    } catch (e) {
      throw new Error("Lokasi tidak bisa didapatkan");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isWithinRadius,
    distance,
    coords,
    loading,
    checkLocation,
  };
};
