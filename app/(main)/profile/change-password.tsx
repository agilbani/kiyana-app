import {
    ThemedBottomSheet,
    ThemedButton,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { changePassword } from "@/services/masterService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcPassword } from "@assets/icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";

type ChangePasswordPayload = {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
};

const ChangePasswordScreen = () => {
    const { logout } = useApp();
    const ref = useRef<ThemedBottomSheet | null>(null);
    const { bottom } = usePositionBottom();

    const [form, setForm] = useState<ChangePasswordPayload>({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const onChange = (key: keyof ChangePasswordPayload, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        if (!form.old_password.trim()) {
            return "Kata sandi saat ini wajib diisi";
        }

        if (!form.new_password.trim()) {
            return "Kata sandi baru wajib diisi";
        }

        if (!form.new_password_confirmation.trim()) {
            return "Konfirmasi kata sandi wajib diisi";
        }

        if (form.new_password !== form.new_password_confirmation) {
            return "Konfirmasi kata sandi tidak cocok";
        }

        if (form.old_password === form.new_password) {
            return "Kata sandi baru tidak boleh sama dengan kata sandi lama";
        }

        return null;
    };

    const onLogout = async () => {
        await logout();
        router.replace(ROUTES.LOGIN);
    };

    const onSubmit = async () => {
        const errorMessage = validateForm();

        if (errorMessage) {
            Alert.alert("Validasi Gagal", errorMessage);
            return;
        }

        const payload: ChangePasswordPayload = {
            old_password: form.old_password,
            new_password: form.new_password,
            new_password_confirmation: form.new_password_confirmation,
        };

        /**
         * Payload SIAP dikirim ke API
         * await changePassword(payload)
         */
        console.log("PAYLOAD CHANGE PASSWORD:", payload);
        LoadingManager.show();
        const res = await changePassword(payload);
        LoadingManager.hide();
        ref.current?.hide();
        if (res.success) {
            Alert.alert(
                "Perubahan password berhasil",
                "Silahkan login kembali dengan password baru anda",
                [
                    {
                        text: "Login",
                        onPress: () => onLogout(),
                    },
                ],
            );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                    paddingTop: StatusBar.currentHeight,
                }}
            >
                <ThemedHeader title="Ubah Kata Sandi" />

                <View style={styles.container}>
                    <View style={styles.content}>
                        <ThemedText type="SemiBold" size="md">
                            Formulir Ubah Kata Sandi
                        </ThemedText>

                        <ThemedText
                            type="Regular"
                            size="sm"
                            color={Color.Gray[500]}
                        >
                            Isi informasi berikut untuk mengubah kata sandi Anda
                        </ThemedText>

                        <ThemedGap height="lg" />

                        <ThemedInput
                            icon={<IcPassword />}
                            label="Kata Sandi Saat Ini"
                            placeholder="Masukkan kata sandi saat ini"
                            secureTextEntry
                            value={form.old_password}
                            onChangeText={(v) => onChange("old_password", v)}
                            style={{ height: 45 }}
                        />

                        <ThemedGap height="md" />

                        <ThemedInput
                            icon={<IcPassword />}
                            label="Kata Sandi Baru"
                            placeholder="Masukkan kata sandi baru"
                            secureTextEntry
                            value={form.new_password}
                            onChangeText={(v) => onChange("new_password", v)}
                            style={{ height: 45 }}
                        />

                        <ThemedGap height="md" />

                        <ThemedInput
                            icon={<IcPassword />}
                            label="Konfirmasi Kata Sandi Baru"
                            placeholder="Ulangi kata sandi baru"
                            secureTextEntry
                            value={form.new_password_confirmation}
                            onChangeText={(v) =>
                                onChange("new_password_confirmation", v)
                            }
                            style={{ height: 45 }}
                        />
                    </View>
                </View>
            </ScrollView>
            {/* Footer */}
            <View style={[styles.footer, { bottom }]}>
                <ThemedButton
                    title="Perbarui Kata Sandi"
                    onPress={() => ref.current?.show()}
                />
            </View>
            {/* Confirmation Bottom Sheet */}
            <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    style={GlobalStyles.center}
                >
                    Perbarui Kata Sandi
                </ThemedText>

                <ThemedGap height="md" />

                <ThemedText
                    type="Medium"
                    size="md"
                    color={Color.Text.Secondary}
                >
                    Apakah Anda yakin ingin memperbarui kata sandi? Tindakan ini
                    akan meningkatkan keamanan akun Anda.
                </ThemedText>

                <ThemedGap height="xl" />

                <ThemedButton
                    title="Ya, Perbarui Sekarang"
                    onPress={onSubmit}
                />

                <ThemedGap height="md" />

                <ThemedButton
                    variant="outline"
                    title="Tidak, Periksa Ulang"
                    onPress={() => ref.current?.hide()}
                />
            </ThemedBottomSheet>
        </View>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.Purple[50],
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(12),
        ...GlobalStyles.flex,
    },
    content: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(24),
        borderRadius: Radius.xs,
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
