import { ThemedLoader } from "@/components";
import { ROUTES } from "@/constants/Routes";
import { useApp as appContext } from "@/context/AppContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const Middleware = () => {
    const { user, loading } = appContext();
    console.log("cek user", user);

    const router = useRouter();

    useEffect(() => {
        if (loading) {
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
                } else if (user?.id) {
                    router.replace(ROUTES.DASHBOARD);
                } else {
                    router.replace(ROUTES.LOGIN);
                }
            } catch (error) {
                router.replace(ROUTES.LOGIN);
            }
        };

        checkAndRedirect();
    }, [loading, user, router]);

    return <ThemedLoader />;
};

export default Middleware;
