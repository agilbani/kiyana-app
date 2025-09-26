import { ROUTES } from "@/constants/Routes";
import { AuthHookResult, User, UserData } from "@/types/auth";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTH_TOKEN_KEY = "userAuthToken_v2";

const MIN_LOADING_DURATION_MS = 700;

const fetchUserProfileFromServer = async (token: string): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        token.startsWith("secure-jwt-token") ||
        token.startsWith("fake-jwt-token")
      ) {
        const mockUserData: UserData = {
          id: 123,
          username: "Fetched User",
          email: "fetched.user@example.com",
        };
        resolve(mockUserData);
      } else {
        reject(new Error("Token tidak valid atau sesi berakhir."));
      }
    }, 1500);
  });
};

export function useApp(): AuthHookResult {
  const [user, setUser] = useState<User | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;

    const bootstrapAsync = async (): Promise<void> => {
      let userToken: string | null = null;

      try {
        userToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

        if (userToken) {
          if (!isMountedRef.current) return;
          setLoadingUser(true);
          try {
            const userDataFromServer = await fetchUserProfileFromServer(
              userToken
            );
            if (isMountedRef.current) {
              setUser({ ...userDataFromServer, token: userToken });
            }
          } catch (fetchError: any) {
            if (isMountedRef.current) {
              await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
              setUser(null);
            }
          } finally {
            if (isMountedRef.current) {
              setLoadingUser(false);
            }
          }
        } else {
          if (isMountedRef.current) {
            setUser(null);
          }
        }
      } catch (e: any) {
        if (isMountedRef.current) {
          setUser(null);
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingInitial(false);
        }
      }
    };

    bootstrapAsync();

    return () => {
      // Cleanup function
      isMountedRef.current = false;
    };
  }, []);

  const login = useCallback(async (userDataWithToken: User): Promise<void> => {
    if (!isMountedRef.current) {
      return;
    }

    setLoadingUser(true);
    const startTime = Date.now();

    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, userDataWithToken.token ?? "");
      if (isMountedRef.current) {
        setUser(userDataWithToken);

        router.replace(ROUTES.DASHBOARD);
      }
    } catch (e: any) {
      if (isMountedRef.current) {
        setUser(null);
      }
    } finally {
      if (isMountedRef.current) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = MIN_LOADING_DURATION_MS - elapsedTime;

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
        setLoadingUser(false);
      }
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;
    setLoadingUser(true);
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      if (isMountedRef.current) {
        setUser(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingUser(false);
      }
    }
  }, []);

  return { user, loadingInitial, loadingUser, login, logout };
}
