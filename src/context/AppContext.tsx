import { loginUser } from "@/services/authService";
import { deleteItem, getItem, saveItem } from "@/store/asyncStore";
import { Attendance } from "@/types/attendance";
import { LoginResponse, User } from "@/types/auth";
import { Setting } from "@/types/settings";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    attendance: Attendance | null;
    dataSetting: Setting[];
    dataCoords: any;
    dataSelectedAttendance: any;
    savedIdLateSchedule: string | null;
    login: (
        email: string,
        password: string,
        fcm_token: string,
    ) => Promise<{
        success: boolean;
        status?: number;
        message?: string;
    }>;
    logout: () => Promise<void>;
    saveAttendance: (attendance: any) => Promise<void>;
    saveDataSetting: (dataSetting: Setting[]) => Promise<void>;
    setCoords: (data: any) => Promise<void>;
    setSelectAttendance: (data: any) => Promise<void>;
    updateUser: (data: any) => Promise<void>;
    setLateScheduleId: (data: any) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
    user: null,
    token: null,
    loading: true,
    attendance: null,
    login: async () => ({ success: false }),
    logout: async () => {},
    saveAttendance: async () => {},
    dataSetting: [],
    saveDataSetting: async () => {},
    setCoords: async () => {},
    dataCoords: null,
    dataSelectedAttendance: null,
    setSelectAttendance: async () => {},
    updateUser: async () => {},
    savedIdLateSchedule: null,
    setLateScheduleId: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [dataSetting, setDateSetting] = useState<Setting[]>([]);
    const [dataCoords, setDataCoords] = useState({});
    const [dataSelectedAttendance, setDataSelectedAttendance] = useState({});
    const [savedIdLateSchedule, setSavedIdLateSchedule] = useState<
        string | null
    >(null);

    // Restore session from secure store
    useEffect(() => {
        (async () => {
            const storedToken = await getItem("auth_token");
            const storedUser = await getItem("auth_user");
            const storedAttendance = await getItem("dataAttendance");
            const storedSetting = await getItem("dataSetting");
            const storedCoords = await getItem("dataCoords");
            const storedDataAttendance = await getItem(
                "selectedDataAttendance",
            );
            const storedIdLateSchedule = await getItem("savedIdLateSchedule");
            console.log("cek storedIdLateSchedule app", storedIdLateSchedule);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            if (storedAttendance) {
                setAttendance(JSON.parse(storedAttendance));
            }
            if (storedSetting) {
                setDateSetting(JSON.parse(storedSetting));
            }
            if (storedCoords) {
                setDataCoords(JSON.parse(storedCoords));
            }
            if (storedDataAttendance) {
                setDataSelectedAttendance(JSON.parse(storedDataAttendance));
            }
            if (storedIdLateSchedule) {
                setSavedIdLateSchedule(storedIdLateSchedule);
            }
            setLoading(false);
        })();
    }, []);

    const login: AppContextType["login"] = async (
        email,
        password,
        fcm_token,
    ) => {
        console.log("login email", email);

        setLoading(true);
        try {
            const res = await loginUser(email, password, fcm_token);
            console.log("login res1111", res);
            setLoading(false);
            if (res?.token) {
                setUser(res.user);
                setToken(res.token);
                await saveUser(res);
                return {
                    success: true,
                    status: res.status ?? 200,
                    message: "Login success",
                };
            } else {
                return {
                    success: false,
                    status: res?.status ?? 400,
                    message: "Invalid response",
                };
            }
        } catch (err: any) {
            console.log("err login", err);

            setLoading(false);
            const status = err.response?.status;
            const message = err.response?.data?.message || "Login failed";
            return { success: false, status, message };
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        setAttendance(null);
        setDateSetting([]);
        setDataCoords({});
        setDataSelectedAttendance({});
        await deleteItem("auth_token");
        await deleteItem("auth_user");
        await deleteItem("dataAttendance");
        await deleteItem("dataSetting");
        await deleteItem("dataCoords");
        //   await deleteItem("selectedDataAttendance");
    };

    const saveUser = async (response: LoginResponse) => {
        await saveItem("auth_token", response.token);
        await saveItem("auth_user", JSON.stringify(response.user));
    };

    const updateUser = async (data: any) => {
        const storedUser = await getItem("auth_user");
        const dataUser = JSON.parse(storedUser ?? "");
        const currentDataUser = { ...dataUser };
        const newUser = {
            ...data,
            shift: currentDataUser.shift ?? null,
        };
        await saveItem("auth_user", JSON.stringify(newUser));
        setUser(newUser);
    };

    const saveAttendance = async (data: any) => {
        setAttendance(data);
        await saveItem("dataAttendance", JSON.stringify(data));
    };

    const saveDataSetting = async (data: Setting[]) => {
        setDateSetting(data);
        await saveItem("dataSetting", JSON.stringify(data));
    };

    const setCoords = async (data: any) => {
        setDataCoords(data);
        await saveItem("dataCoords", JSON.stringify(data));
    };

    const setSelectAttendance = async (data: any) => {
        setDataSelectedAttendance(data);
        await saveItem("selectedDataAttendance", JSON.stringify(data));
    };

    const setLateScheduleId = async (data: any) => {
        setSavedIdLateSchedule(data);
        await saveItem("savedIdLateSchedule", data);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                saveAttendance,
                attendance,
                saveDataSetting,
                dataSetting,
                dataCoords,
                setCoords,
                setSelectAttendance,
                dataSelectedAttendance,
                updateUser,
                savedIdLateSchedule,
                setLateScheduleId,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
