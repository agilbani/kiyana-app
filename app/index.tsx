import { ThemedLoader } from "@/components";
import { ROUTES } from "@/constants/Routes";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const Middleware = () => {
  const { user, loadingInitial: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const checkAndRedirect = async () => {
      try {
        const hasSeenOnboarding = await SecureStore.getItemAsync(
          "hasSeenOnboarding"
        );
        const hasHandledPermissions = await SecureStore.getItemAsync(
          "hasHandledPermissions"
        );

        if (!hasSeenOnboarding) {
          router.replace(ROUTES.ONBOARDING);
        } else if (!hasHandledPermissions) {
          router.replace(ROUTES.PERMISSIONS);
        } else if (!user) {
          router.replace(ROUTES.LOGIN);
        } else {
          router.replace(ROUTES.DASHBOARD);
        }
      } catch (error) {
        router.replace(ROUTES.LOGIN);
      }
    };

    checkAndRedirect();
  }, [isAuthLoading, user, router]);

  return <ThemedLoader />;
};

export default Middleware;
