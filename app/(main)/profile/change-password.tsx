import {
    ThemedBottomSheet,
    ThemedButton,
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcPassword } from "@assets/icons";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";

const ChangePasswordScreen = () => {
    const ref = useRef<ThemedBottomSheet | null>(null);
    const { bottom } = usePositionBottom();

    return (
        <ThemedContainer>
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
                    />
                    <ThemedGap height="md" />
                    <ThemedInput
                        icon={<IcPassword />}
                        label="Kata Sandi Baru"
                        placeholder="Masukkan kata sandi baru"
                        secureTextEntry
                    />
                    <ThemedGap height="md" />
                    <ThemedInput
                        icon={<IcPassword />}
                        label="Konfirmasi Kata Sandi Baru"
                        placeholder="Ulangi kata sandi baru"
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={[styles.footer, { bottom: bottom }]}>
                <ThemedButton
                    title="Perbarui Kata Sandi"
                    onPress={() => ref.current?.show()}
                />
            </View>

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
                <ThemedButton title="Ya, Perbarui Sekarang" />
                <ThemedGap height="md" />
                <ThemedButton
                    variant="outline"
                    title="Tidak, Periksa Ulang"
                    onPress={() => ref.current?.hide()}
                />
            </ThemedBottomSheet>
        </ThemedContainer>
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
