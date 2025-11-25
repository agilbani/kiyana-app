import { useApp } from "@/context/AppContext";
import { getDistanceFromLatLonInMeters } from "@/utils/locationUtils";
import * as Location from "expo-location";
import { useCallback, useState } from "react";

export const useCheckRadius = () => {
  const { dataSetting } = useApp();
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const officeCoordinate = dataSetting.find(
      (s) => s.key === "OFFICE_COORDINATE"
  )?.value;
  const dataOfficeCoordinate = officeCoordinate
      ? JSON.parse(officeCoordinate)
      : null;
  
  const checkLocation = useCallback(async () => {
    setLoading(true);
    setIsWithinRadius(null);
    setDistance(null);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      // console.log('location 1', location);
      
      const { latitude, longitude } = location.coords;
      setCoords(location.coords);

      const distanceMeter = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        dataOfficeCoordinate.lat,
        dataOfficeCoordinate.lng
      );

      setDistance(distanceMeter);
      setIsWithinRadius(distanceMeter <= 100);
    } catch (e) {
      console.log('cek err loc', e);
      
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
