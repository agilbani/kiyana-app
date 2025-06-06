import { ROUTES } from "@/constants/Routes";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const PermissionScreen = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.CAMERA_PERMISSION);
  }, []);

  return null;
};

export default PermissionScreen;
