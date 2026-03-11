import {
    ThemedButton,
    ThemedErrorMessage,
    ThemedGap,
    ThemedInput,
    ThemedText,
} from "@/components";
import AuthLayout from "@/components/layout/ThemedAuthLayout";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp as appContext } from "@/context/AppContext";
import { getAllSettings } from "@/services/settingService";
import { getItem } from "@/store/asyncStore";
import GlobalStyles from "@/styles/common";
import { LoginForm } from "@/types/form";
import { IcPassword, IcUserID } from "@assets/icons";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

const LoginScreen = () => {
    const { login, saveDataSetting, attendance } = appContext();

    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginForm>({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginForm) => {
        setApiError(null);
        setLoading(true);
        const fcmToken = (await getItem("fcm_token")) ?? "";
        try {
            const response = await login(data.email, data.password, fcmToken);
            // console.log("res login", response);

            if (response.status === 200) {
                getListSetting();
            } else {
                setLoading(false);
                const errorMessage = "Login gagal. Silakan coba lagi.";
                setApiError(errorMessage);
            }
        } catch (error) {
            setLoading(false);
            setApiError(
                "Terjadi kesalahan. Periksa koneksi Anda dan coba lagi.",
            );
        }
    };

    const getListSetting = async () => {
        const res = await getAllSettings();
        setLoading(false);
        if (res.success && res.data) {
            saveDataSetting(res.data);
        }
        router.replace(ROUTES.DASHBOARD);
    };

    return (
        <AuthLayout>
            <View style={GlobalStyles.center}>
                <ThemedText type="SemiBold" size="xl">
                    Masuk
                </ThemedText>
                <ThemedText type="Medium" size="md" color={Color.Gray[600]}>
                    Masuk ke akun Anda
                </ThemedText>
            </View>

            <ThemedGap height="xl" />

            {apiError && (
                <View style={GlobalStyles.center}>
                    <ThemedErrorMessage message={apiError} />
                    <ThemedGap height="md" />
                </View>
            )}

            <Controller
                control={control}
                name="email"
                rules={{ required: "Email Karyawan wajib diisi" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        icon={<IcUserID />}
                        label="Email Karyawan"
                        placeholder="Masukkan Email Karyawan"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.email?.message}
                        editable={!loading}
                        style={{ height: 45 }}
                    />
                )}
            />
            <ThemedGap height="xl" />
            <Controller
                control={control}
                name="password"
                rules={{ required: "Kata sandi wajib diisi" }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <ThemedInput
                        icon={<IcPassword />}
                        label="Kata Sandi"
                        placeholder="Masukkan Kata Sandi"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.password?.message}
                        editable={!loading}
                        style={{ height: 45 }}
                    />
                )}
            />
            <ThemedGap height="xxl" />
            <ThemedButton
                title={loading ? "Memproses..." : "Masuk"}
                loading={loading}
                disabled={!isValid || loading}
                onPress={handleSubmit(onSubmit)}
            />
        </AuthLayout>
    );
};

export default LoginScreen;
