import {
    ThemedBottomSheet,
    ThemedButton,
    ThemedDropdown,
    ThemedGap,
    ThemedHeader,
    ThemedImage,
    ThemedInput,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import { BANKS_ONLY } from "@/constants/Dummy/Bank";
import Radius from "@/constants/Radius";
import { useApp } from "@/context/AppContext";
import { getProfile } from "@/services/authService";
import { changeProfile } from "@/services/masterService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcKeyboard, IcRefresh, IcUserOutline } from "@assets/icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

type ProfilePayload = {
    first_name: string;
    last_name: string;
    phone: string;
    bank: string;
    bank_account: string;
    bank_number: string;
    identity_address: string;
    address: string;
    image?: any;
};

const PersonalDataScreen = () => {
    const { user, updateUser } = useApp();
    console.log("cek user e", user);

    const ref = useRef<ThemedBottomSheet | null>(null);
    const { bottom } = usePositionBottom();

    const isReady = Boolean(user);

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [optionsTransfer, setOptionsTransfer] = useState<any>([]);

    const [form, setForm] = useState<ProfilePayload>({
        first_name: "",
        last_name: "",
        phone: "",
        bank: "",
        bank_account: "",
        bank_number: "",
        identity_address: "",
        address: "",
        image: {},
    });

    const onChange = (key: keyof ProfilePayload, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

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
                const selectedAsset = result.assets[0];
                setImageUri(result.assets[0].uri);
                onChange("image", selectedAsset);
            }
        } catch (err) {
            console.warn("Image Picker Error:", err);
        }
    };

    const getUser = async () => {
        LoadingManager.show();
        const res = await getProfile();
        LoadingManager.hide();
        if (res.success) {
            updateUser(res.data);
            Alert.alert(
                "Update profile berhasil",
                "Profile anda berhasil diperbaharui",
                [
                    {
                        text: "Kembali",
                        onPress: () => router.back(),
                    },
                ],
            );
        }
    };

    const validateForm = () => {
        if (!form.first_name.trim()) return "Nama depan wajib diisi";
        if (!form.last_name.trim()) return "Nama belakang wajib diisi";
        if (!form.phone.trim()) return "Nomor telepon wajib diisi";
        if (!form.identity_address.trim())
            return "Alamat sesuai identitas wajib diisi";
        if (!form.address.trim()) return "Alamat domisili wajib diisi";
        return null;
    };

    const onSubmit = async () => {
        ref.current?.hide();
        const errorMessage = validateForm();
        if (errorMessage) {
            ref.current?.hide();
            Alert.alert("Validasi Gagal", errorMessage);
            return;
        }

        const payload: ProfilePayload = {
            ...form,
        };
        console.log("PAYLOAD UPDATE PROFILE:", payload);
        const formData = new FormData();
        formData.append("address", payload.address);
        formData.append("bank", payload.bank);
        formData.append("bank_account", payload.bank_account);
        formData.append("bank_number", payload.bank_number);
        formData.append("first_name", payload.first_name);
        formData.append("identity_address", payload.identity_address);
        formData.append("last_name", payload.last_name);
        formData.append("phone", payload.phone);

        if (form.image && Object.keys(form.image).length > 0) {
            formData.append("image", {
                uri: payload.image.uri,
                name: payload.image.fileName,
                type: payload.image.mimeType,
            } as any);
        }
        LoadingManager.show();
        const res = await changeProfile(formData);
        LoadingManager.hide();
        console.log("res update", res);
        if (res.success) {
            getUser();
        }
    };

    const getOptionTransfer = () => {
        let opt = [];
        for (let i = 0; i < BANKS_ONLY.length; i++) {
            opt.push({
                label: BANKS_ONLY[i].key,
                value: BANKS_ONLY[i].value,
            });
        }
        setOptionsTransfer(opt);
    };

    useEffect(() => {
        if (!user) return;

        setForm({
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            phone: user.phone ?? "",
            bank: user.bank ?? "",
            bank_account: user.bank_account ?? "",
            bank_number: user.bank_number ?? "",
            identity_address: user.detail?.identity_address ?? "",
            address: user.detail?.address ?? "",
        });
        setImageUri(user?.image_url);
    }, [user]);

    useEffect(() => {
        getOptionTransfer();
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 120,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <ThemedHeader title="Data Pribadi" />

            <View style={styles.container}>
                <View style={styles.content}>
                    <ThemedText type="SemiBold" size="md">
                        Data Saya
                    </ThemedText>

                    <ThemedGap height="lg" />

                    {/* Upload Photo */}
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
                    </View>

                    <ThemedGap height="lg" />

                    {/* Required Fields */}
                    <ThemedInput
                        icon={<IcUserOutline />}
                        label="Nama Depan"
                        placeholder="Masukkan nama depan"
                        value={form.first_name}
                        onChangeText={(v) => onChange("first_name", v)}
                        style={{ height: 45 }}
                    />

                    <ThemedGap height="md" />

                    <ThemedInput
                        icon={<IcUserOutline />}
                        label="Nama Belakang"
                        placeholder="Masukkan nama belakang"
                        value={form.last_name}
                        onChangeText={(v) => onChange("last_name", v)}
                        style={{ height: 45 }}
                    />

                    <ThemedGap height="md" />

                    <ThemedInput
                        icon={<IcKeyboard />}
                        label="Nomor Telepon"
                        placeholder="Masukkan nomor telepon"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) => onChange("phone", v)}
                        style={{ height: 45 }}
                    />

                    <ThemedGap height="md" />

                    <ThemedTextarea
                        label="Alamat Sesuai Identitas"
                        placeholder="Masukkan alamat sesuai KTP"
                        value={form.identity_address}
                        onChangeText={(v) => onChange("identity_address", v)}
                    />

                    <ThemedGap height="md" />

                    <ThemedTextarea
                        label="Alamat Domisili"
                        placeholder="Masukkan alamat domisili"
                        value={form.address}
                        onChangeText={(v) => onChange("address", v)}
                    />

                    <ThemedGap height="lg" />

                    {/* Optional Bank Info */}
                    <ThemedText type="SemiBold" size="sm">
                        Informasi Bank (Opsional)
                    </ThemedText>

                    <ThemedGap height="md" />

                    {/* <ThemedInput
                        label="Nama Bank"
                        placeholder="Contoh: BCA"
                        value={form.bank}
                        onChangeText={(v) => onChange("bank", v)}
                    /> */}

                    <ThemedDropdown
                        items={optionsTransfer}
                        value={form.bank}
                        label="Nama Bank"
                        placeholder="Nama Bank"
                        onValueChange={(selected) => onChange("bank", selected)}
                    />

                    <ThemedGap height="md" />

                    <ThemedInput
                        label="Nama Pemilik Rekening"
                        placeholder="Masukkan nama pemilik rekening"
                        value={form.bank_account}
                        onChangeText={(v) => onChange("bank_account", v)}
                        style={{ height: 45 }}
                    />

                    <ThemedGap height="md" />

                    <ThemedInput
                        label="Nomor Rekening"
                        placeholder="Masukkan nomor rekening"
                        keyboardType="numeric"
                        value={form.bank_number}
                        onChangeText={(v) => onChange("bank_number", v)}
                        style={{ height: 45 }}
                    />
                </View>
            </View>

            {/* Footer */}
            <View style={[styles.footer, { bottom }]}>
                <ThemedButton
                    title="Perbarui"
                    onPress={() => ref.current?.show()}
                    disabled={!isReady}
                />
            </View>

            {/* Confirmation Bottom Sheet */}
            <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    style={GlobalStyles.center}
                >
                    Perbarui Profil
                </ThemedText>

                <ThemedGap height="lg" />

                <ThemedButton title="Ya, Perbarui Profil" onPress={onSubmit} />

                <ThemedGap height="md" />

                <ThemedButton
                    variant="outline"
                    title="Tidak, Cek Ulang Dulu"
                    onPress={() => ref.current?.hide()}
                />
            </ThemedBottomSheet>
        </ScrollView>
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
