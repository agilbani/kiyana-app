import {
    ThemedButton,
    ThemedDatePicker,
    ThemedHeader,
    ThemedSelect,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import { requestAbsence } from "@/services/attendanceService";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { IcClose } from "@assets/icons";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";

const statusBarHeight = StatusBar.currentHeight;

type ImageData = {
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    name?: string;
};

type FormValues = {
    reason: string;
    date: string;
    type_request: string;
    attachments: ImageData[];
};

const schema = yup.object().shape({
    reason: yup.string().required("Alasan harus diisi"),
    date: yup.string().required("Tanggal pengajuan harus diisi"),
    type_request: yup.string().required("Tanggal pengajuan harus diisi"),
    attachments: yup
        .array()
        .of(
            yup.object().shape({
                uri: yup.string().required(),
                width: yup.number().optional(),
                height: yup.number().optional(),
                type: yup.string().optional(),
                fileName: yup.string().optional(),
            })
        )
        .required("Harus menyertakan minimal 1 gambar")
        .min(1, "Harus menyertakan minimal 1 gambar")
        .max(3, "Max 3 images allowed"),
});

const options = [
    { key: "Izin", value: "Izin" },
    { key: "Setengah Hari", value: "Setengah Hari" },
    { key: "Sakit", value: "Sakit" },
    { key: "Cuti", value: "Cuti" },
];

const AddAbsence = () => {
    const {
        control,
        watch,
        setValue,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        setError,
        getValues,
    } = useForm<FormValues>({
        defaultValues: {
            reason: "",
            type_request: "",
            date: "",
            attachments: [],
        },
        resolver: yupResolver(schema),
    });
    const attachments = watch("attachments");
    const [loading, setLoading] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const pickImage = async () => {
        if (attachments.length >= 3) {
            Alert.alert("Limit reached", "You can only upload up to 3 images.");
            return;
        }

        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                "Permission required",
                "Media library access is needed."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            const updated = [...attachments, selectedAsset];
            setValue("attachments", updated, { shouldValidate: true });
        }
    };

    const removeAttachment = (index: number) => {
        const updated = attachments.filter((_, i) => i !== index);
        setValue("attachments", updated, { shouldValidate: true });
    };

    const renderImage = ({
        item,
        index,
    }: {
        item: ImageData;
        index: number;
    }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item.uri }}
                style={styles.image}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAttachment(index)}
            >
                <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setIsScanning(false);
    };

    const onSubmit = async (data: any) => {
        console.log("data submited", data);

        let formatFile = [];
        for (let i = 0; i < data?.attachments.length; i++) {
            formatFile.push({
                uri: data?.attachments[i].uri,
                name: data?.attachments[i].fileName,
                type: `${data?.attachments[i].mimeType}`,
            });
        }
        const obj = {
            date: moment(data?.date, "DD-MM-YYYY").format("YYYY-MM-DD"),
            type_request: data?.type_request,
            reason: data?.reason,
            attachments: formatFile,
        };
        console.log("cek obj req", obj);
        setLoading(true);
        const res = await requestAbsence(obj);
        setLoading(false);
        if (res.success) {
            ShowToastMessage(res.message);
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
    };

    return (
        <View style={styles.page}>
            <StatusBar translucent barStyle="dark-content" />
            <ThemedHeader title="Ajukan Ijin" />
            <View style={{ padding: 10 }}>
                <ScrollView contentContainerStyle={{ gap: 15 }}>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ThemedDatePicker
                                label="Pilih tanggal pengajuan"
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                minimumDate="today"
                            />
                        )}
                    />
                    <Controller
                        name="type_request"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ThemedSelect
                                label="Pilih tipe pengajuan"
                                value={field.value}
                                data={options}
                                onChangeText={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name="reason"
                        control={control}
                        render={({ field, fieldState }) => (
                            <ThemedTextarea
                                label="Masukkan alasan pengajuan"
                                placeholder="Masukkan alasan pengajuan"
                                value={field.value}
                                onChangeText={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="attachments"
                        render={() => (
                            <FlatList
                                horizontal
                                data={attachments}
                                keyExtractor={(_, i) => `${i}`}
                                renderItem={renderImage}
                                ListFooterComponent={
                                    attachments.length < 3 ? (
                                        <TouchableOpacity
                                            style={styles.imageContainer}
                                            onPress={pickImage}
                                        >
                                            <View style={styles.placeholder}>
                                                <Ionicons
                                                    name="add"
                                                    size={30}
                                                    color="#aaa"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ) : null
                                }
                            />
                        )}
                    />
                    {errors.attachments && (
                        <ThemedText>{errors.attachments.message}</ThemedText>
                    )}
                    <ThemedButton
                        variant="primary"
                        title="Submit"
                        style={{ marginTop: 15 }}
                        disabled={!isValid}
                        loading={loading}
                        onPress={handleSubmit(onSubmit)}
                    />
                </ScrollView>
            </View>
            <Modal visible={isScanning} animationType="slide">
                <CameraView
                    // onBarcodeScanned={
                    //     scanned ? undefined : handleBarcodeScanned
                    // }
                    // barcodeScannerSettings={{
                    //     barcodeTypes: ["qr", "pdf417", "code128", "code39"],
                    // }}
                    style={StyleSheet.absoluteFillObject}
                />
                <Pressable
                    onPress={() => setIsScanning(false)}
                    style={styles.closeScanner}
                >
                    <IcClose />
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        ...GlobalStyles.flex,
        backgroundColor: Color.Base.White,
        paddingTop: statusBarHeight ? statusBarHeight + scale(12) : scale(46),
    },
    imageContainer: {
        marginRight: 10,
        marginTop: 15,
        position: "relative",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    placeholder: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    closeScanner: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: scale(8),
        borderRadius: 4,
    },
});

export default AddAbsence;
