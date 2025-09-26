import {
    ThemedButton,
    ThemedDropdown,
    ThemedGap,
    ThemedInput,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { rejcetProduction } from "@/services/productionService";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { IcClose, IcScan } from "@assets/icons";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import React, { useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface ModalRejectProps {
    visible: boolean;
    batch: string;
    onClose: () => void;
    onSuccessReject: () => void;
}

type ImageData = {
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    name?: string;
};

const ModalReject: React.FC<ModalRejectProps> = ({
    visible,
    batch,
    onClose,
    onSuccessReject,
}) => {
    const cameraRef = useRef<CameraView>(null);
    const [count, setCount] = useState<string>("");
    const [canRepaired, setCanRepaired] = useState<string>("");
    const [rejectedAt, setRejectedAt] = useState<string>("");
    const [rejectedReason, setRejectedReason] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [newBatch, setNewBatch] = useState<string>("");
    const [attachments, setAttachments] = useState<any>([]);
    const [typeCamera, setTypeCamera] = useState<string>("barcode");

    const optionRepaired = [
        { label: "Bisa", value: "true" },
        { label: "Tidak Bisa", value: "false" },
    ];

    const optionReject = [
        { label: "Proses Potong", value: "CUTTING" },
        { label: "Proses Jahit", value: "SEWING" },
    ];

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setIsScanning(false);
        setNewBatch(data);
    };

    const handleSubmitReject = async () => {
        const body = {
            batch: newBatch,
            qty: Number(count),
            can_repaired: canRepaired === "true" ? true : false,
            rejected_at: rejectedAt,
            rejected_reason: rejectedReason,
            attachment: attachments,
        };
        setLoading(true);
        const res = await rejcetProduction(batch, body);
        console.log("res reject", res);

        setLoading(false);
        if (res.success) {
            ShowToastMessage(res.message);
            onSuccessReject();
        } else {
            ShowToastMessage(res.message);
        }
    };

    const removeAttachment = (index: number) => {
        const updated = attachments.filter((_: any, i: any) => i !== index);
        setAttachments(updated);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                });
                const obj = {
                    uri: photo.uri,
                    type: "image/jpeg",
                    name: "rejectSpot.jpg",
                };
                if (photo?.uri) {
                    const updated = [...attachments, obj];
                    setAttachments(updated);
                    setScanned(false);
                    setIsScanning(false);
                }
            } catch (error) {
                Alert.alert("Error", "Gagal mengambil foto.");
            }
        }
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

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={{ width: "10%" }} />
                            <View
                                style={{
                                    width: "80%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ThemedText size="lg" type="Bold">
                                    Masukkan Infomasi Reject
                                </ThemedText>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onClose}
                                style={{ width: "10%", alignItems: "flex-end" }}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                GlobalStyles.rowCenter,
                                { marginBottom: 10 },
                            ]}
                        >
                            <View style={GlobalStyles.flex}>
                                <ThemedInput
                                    label="Barcode"
                                    placeholder="Hasil scan atau input manual"
                                    value={newBatch}
                                    onChangeText={(text) => setNewBatch(text)}
                                    style={{ height: 45 }}
                                />
                            </View>
                            <ThemedGap width="sm" />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.scanWrapper}
                                onPress={() => {
                                    setTypeCamera("barcode");
                                    setIsScanning(true);
                                    setScanned(false);
                                }}
                            >
                                <IcScan />
                            </TouchableOpacity>
                        </View>
                        <ThemedInput
                            label="Jumlah Produk Entry"
                            placeholder="Masukkan jumlah produk entry"
                            keyboardType="numeric"
                            value={count}
                            onChangeText={(text) => setCount(text)}
                            style={{ height: 45 }}
                        />
                        <ThemedDropdown
                            label="Apakah bisa diperbaiki?"
                            value={canRepaired}
                            items={optionRepaired}
                            onValueChange={(value) => setCanRepaired(value)}
                        />
                        <ThemedDropdown
                            label="Proses dikembalikan kepada"
                            value={rejectedAt}
                            items={optionReject}
                            onValueChange={(value) => setRejectedAt(value)}
                        />
                        <View style={{ marginBottom: 15 }}>
                            <ThemedText
                                type="Regular"
                                size="sm"
                                color={Color.Gray[600]}
                                style={styles.spacing}
                            >
                                Photo bagian reject
                            </ThemedText>
                            <FlatList
                                horizontal
                                data={attachments}
                                keyExtractor={(_, i) => `${i}`}
                                renderItem={renderImage}
                                ListFooterComponent={
                                    attachments.length < 1 ? (
                                        <TouchableOpacity
                                            style={styles.imageContainer}
                                            // onPress={pickImage}
                                            onPress={() => {
                                                setTypeCamera("item");
                                                setIsScanning(true);
                                            }}
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
                        </View>
                        <ThemedTextarea
                            label="Alasan Penolakan"
                            placeholder="Contoh: Bolong"
                            value={rejectedReason}
                            onChangeText={(text) => setRejectedReason(text)}
                        />
                        <ThemedButton
                            title="Submit"
                            onPress={handleSubmitReject}
                            loading={loading}
                        />
                    </View>
                </ScrollView>
                <Modal visible={isScanning} animationType="slide">
                    {typeCamera === "barcode" ? (
                        <CameraView
                            onBarcodeScanned={
                                scanned ? undefined : handleBarcodeScanned
                            }
                            barcodeScannerSettings={{
                                barcodeTypes: [
                                    "qr",
                                    "pdf417",
                                    "code128",
                                    "code39",
                                ],
                            }}
                            style={StyleSheet.absoluteFillObject}
                        />
                    ) : (
                        <CameraView
                            facing="back"
                            ref={cameraRef}
                            mode="picture"
                            style={StyleSheet.absoluteFillObject}
                        />
                    )}
                    <Pressable
                        onPress={() => setIsScanning(false)}
                        style={styles.closeScanner}
                    >
                        <IcClose />
                    </Pressable>
                    {typeCamera !== "barcode" && (
                        <View style={styles.bottomControlsContainer}>
                            <TouchableOpacity
                                style={styles.captureButtonOuter}
                                onPress={takePicture}
                            >
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>
                        </View>
                    )}
                </Modal>
            </View>
        </Modal>
    );
};

export default ModalReject;

const styles = StyleSheet.create({
    spacing: {
        marginLeft: scale(4),
    },
    imageContainer: {
        marginRight: 10,
        marginTop: 10,
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
    header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 5,
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    cancel: {
        backgroundColor: "#e0e0e0",
    },
    confirm: {
        backgroundColor: "#007bff",
    },
    cancelText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "bold",
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    closeScanner: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: scale(8),
        borderRadius: Radius.rounded,
    },
    scanWrapper: {
        paddingTop: scale(16),
    },
    bottomControlsContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 24,
        paddingBottom: verticalScale(24),
        ...GlobalStyles.center,
    },
    captureButtonOuter: {
        width: scale(64),
        height: scale(64),
        borderRadius: Radius.rounded,
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.center,
    },
    captureButtonInner: {
        width: scale(56),
        height: scale(56),
        borderRadius: Radius.rounded,
        backgroundColor: Color.Background.Background,
        borderWidth: scale(4),
        borderColor: Color.Gray[500],
    },
});
