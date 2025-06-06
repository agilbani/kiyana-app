import {
  ThemedButton,
  ThemedErrorMessage,
  ThemedGap,
  ThemedInput,
  ThemedText,
} from "@/components";
import AuthLayout from "@/components/layout/ThemedAuthLayout";
import Color from "@/constants/Color";
import { useAuth } from "@/hooks/useAuth";
import GlobalStyles from "@/styles/common";
import { AuthResponse, User } from "@/types/auth";
import { LoginForm } from "@/types/form";
import { IcPassword, IcUserID } from "@assets/icons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

const authenticateUserOnServer = async (
  loginData: LoginForm
): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    if (loginData.userId === "user" && loginData.password === "password") {
      const mockUser: User = {
        id: "user-123",
        username: "Test User",
        email: "testuser@example.com",
        token: `fake-jwt-token-${Date.now()}`,
      };
      resolve({ success: true, data: mockUser });
    } else if (loginData.userId === "failuser") {
      resolve({
        success: false,
        message: "ID Karyawan atau Kata Sandi salah.",
      });
    } else {
      resolve({
        success: false,
        message: "ID Karyawan atau Kata Sandi salah.",
      });
    }
  });
};

const LoginScreen = () => {
  const { login: authLogin, loadingUser } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError(null);

    try {
      const response = await authenticateUserOnServer(data);

      if (response.success && response.data) {
        await authLogin(response.data);
      } else {
        const errorMessage =
          response.message || "Login gagal. Silakan coba lagi.";
        setApiError(errorMessage);
      }
    } catch (error) {
      setApiError("Terjadi kesalahan. Periksa koneksi Anda dan coba lagi.");
    }
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
        name="userId"
        rules={{ required: "ID Karyawan wajib diisi" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            icon={<IcUserID />}
            label="ID Karyawan"
            placeholder="Masukkan ID Karyawan"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.userId?.message}
            editable={!loadingUser}
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
            editable={!loadingUser}
          />
        )}
      />
      <ThemedGap height="xxl" />
      <ThemedButton
        title={loadingUser ? "Memproses..." : "Masuk"}
        loading={loadingUser}
        disabled={!isValid || loadingUser}
        onPress={handleSubmit(onSubmit)}
      />
    </AuthLayout>
  );
};

export default LoginScreen;
