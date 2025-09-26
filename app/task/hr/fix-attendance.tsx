import {
    ThemedBottomSheet,
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import { scale, verticalScale } from "@/utils/scaleSize";
import React, { useRef } from "react";
import { Alert, StyleSheet, View } from "react-native";

const FixAttendanceScreen = () => {
    const ref = useRef<ThemedBottomSheet | null>(null);
    const { bottom } = usePositionBottom();

    const handleConfirm = () => {
        ref.current?.hide();
        Alert.alert("Sukses", "Pengajuan perbaikan absensi berhasil dikirim.");
    };

    return (
        <ThemedContainer>
            <ThemedHeader title="Perbaikan Absensi" />
            <View style={styles.container}>
                <View style={styles.content}>
                    <ThemedText type="SemiBold" size="md">
                        Formulir Perbaikan Absensi
                    </ThemedText>
                    <ThemedText
                        type="Regular"
                        size="sm"
                        color={Color.Gray[500]}
                    >
                        Lengkapi informasi berikut untuk mengajukan perbaikan
                        absensi.
                    </ThemedText>
                    <ThemedGap height="lg" />

                    <ThemedDatePicker label="Tanggal Absensi" />
                    <ThemedGap height="md" />
                    <ThemedInput
                        label="Jam Masuk"
                        placeholder="Contoh: 08:00"
                    />
                    <ThemedGap height="md" />
                    <ThemedInput
                        label="Jam Keluar"
                        placeholder="Contoh: 17:00"
                    />
                    <ThemedGap height="md" />
                    <ThemedTextarea
                        label="Catatan"
                        placeholder="Contoh: Lupa absen pagi, dsb"
                    />
                </View>
            </View>

            <View style={[styles.footer, { bottom: bottom }]}>
                <ThemedButton
                    title="Ajukan Perbaikan"
                    onPress={() => ref.current?.show()}
                />
            </View>

            <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    style={GlobalStyles.center}
                >
                    Konfirmasi Pengajuan
                </ThemedText>
                <ThemedGap height="md" />
                <ThemedText
                    type="Medium"
                    size="md"
                    color={Color.Text.Secondary}
                >
                    Apakah kamu yakin ingin mengajukan perbaikan absensi ini?
                    Pastikan semua data yang dimasukkan sudah benar.
                </ThemedText>
                <ThemedGap height="xl" />
                <ThemedButton
                    title="Ya, Ajukan Sekarang"
                    onPress={handleConfirm}
                />
                <ThemedGap height="md" />
                <ThemedButton
                    variant="outline"
                    title="Batal"
                    onPress={() => ref.current?.hide()}
                />
            </ThemedBottomSheet>
        </ThemedContainer>
    );
};

export default FixAttendanceScreen;

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
