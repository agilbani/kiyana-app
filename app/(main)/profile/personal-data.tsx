import {
    ThemedBottomSheet,
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedGap,
    ThemedHeader,
    ThemedImage,
    ThemedInput,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcKeyboard, IcRefresh, IcUserOutline } from "@assets/icons";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

const PersonalDataScreen = () => {
    const ref = useRef<ThemedBottomSheet | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const { bottom } = usePositionBottom();

    const pickImage = async () => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert("Izin Ditolak", "Izin akses galeri dibutuhkan.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                aspect: [1, 1],
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImageUri(uri);
            }
        } catch (err) {
            console.warn("Image Picker Error:", err);
        }
    };

    return (
        <ThemedContainer>
            <ThemedHeader title="Data Pribadi" />
            <View style={styles.container}>
                <View style={styles.content}>
                    <ThemedText type="SemiBold" size="md">
                        Data Saya
                    </ThemedText>
                    <ThemedText
                        type="Regular"
                        size="sm"
                        color={Color.Gray[500]}
                    >
                        Informasi terkait data pribadi Anda
                    </ThemedText>
                    <ThemedGap height="lg" />
                    <View style={GlobalStyles.center}>
                        <View style={styles.profileWrapper}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.iconWrapper}
                                onPress={pickImage}
                            >
                                <IcRefresh />
                            </TouchableOpacity>
                            <ThemedImage
                                source={
                                    imageUri
                                        ? { uri: imageUri }
                                        : { uri: "https://picsum.photos/200" }
                                }
                                width={100}
                                height={100}
                            />
                        </View>
                        <ThemedGap height="sm" />
                        <ThemedText
                            type="SemiBold"
                            size="sm"
                            color={Color.Gray[600]}
                        >
                            Unggah Foto
                        </ThemedText>
                        <ThemedGap height="xxs" />
                        <ThemedText
                            type="Regular"
                            size="xs"
                            color={Color.Gray[600]}
                            style={[
                                GlobalStyles.center,
                                { paddingHorizontal: scale(68) },
                            ]}
                        >
                            Format harus .jpeg atau .png dengan ukuran minimal
                            800x800px dan maksimal 5MB
                        </ThemedText>
                    </View>
                    <ThemedGap height="md" />
                    <ThemedInput
                        icon={<IcUserOutline />}
                        label="Nama Depan"
                        placeholder="Masukkan nama depan"
                    />
                    <ThemedGap height="md" />
                    <ThemedInput
                        icon={<IcUserOutline />}
                        label="Nama Belakang"
                        placeholder="Masukkan nama belakang"
                    />
                    <ThemedGap height="md" />
                    <ThemedDatePicker label="Tanggal Lahir" />
                    <ThemedGap height="md" />
                    <ThemedInput
                        icon={<IcKeyboard />}
                        label="Posisi"
                        placeholder="Masukkan jabatan atau posisi"
                    />
                </View>
            </View>
            <View style={[styles.footer, { bottom: bottom }]}>
                <ThemedButton
                    title="Perbarui"
                    onPress={() => ref.current?.show()}
                />
            </View>

            <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    style={GlobalStyles.center}
                >
                    Perbarui Profil
                </ThemedText>
                <ThemedGap height="md" />
                <ThemedText
                    type="Medium"
                    size="md"
                    color={Color.Text.Secondary}
                >
                    Apakah Anda yakin ingin memperbarui profil? Ini akan
                    membantu kami meningkatkan pengalaman Anda dan menyediakan
                    fitur yang dipersonalisasi.
                </ThemedText>
                <ThemedGap height="xl" />
                <ThemedButton title="Ya, Perbarui Profil" />
                <ThemedGap height="md" />
                <ThemedButton
                    variant="outline"
                    title="Tidak, Cek Ulang Dulu"
                    onPress={() => ref.current?.hide()}
                />
            </ThemedBottomSheet>
        </ThemedContainer>
    );
};

export default PersonalDataScreen;

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
    profileWrapper: {
        position: "relative",
        borderWidth: 2,
        borderColor: Color.Background.Background,
        borderRadius: Radius.sm,
    },
    iconWrapper: {
        position: "absolute",
        top: verticalScale(-12),
        right: scale(-12),
        zIndex: 1,
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
