import Color from "@/constants/Color";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedDropdown, ThemedText } from "../ui";

type IMAGE = {
    uri: string;
    type?: string;
    name?: string;
};

type Approval = {
    id: number;
    qty?: string | number;
    status?: string;
    attachments?: IMAGE;
};

const status = [
    { label: "Disetujui", value: "Approved" },
    {
        label: "Reject (Tidak Bisa Diperbaiki)",
        value: "Reject (Tidak Bisa Diperbaiki)",
    },
    { label: "Reject (Bisa Diperbaiki)", value: "Reject (Bisa Diperbaiki)" },
];

const ModalEndFinishing = ({ show, onClose, submit }) => {
    const cameraRef = useRef(null);
    const [approval, setApproval] = useState<Approval[]>([{ id: Date.now() }]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [permission, requestPermission] = useCameraPermissions();

    const addMore = () => {
        setApproval((prev) => [...prev, { id: Date.now() }]);
    };

    const deleteItem = (index: number) => {
        // minimal 1 form tersisa
        if (approval.length === 1) return alert("Minimal harus ada 1 data");
        setApproval((prev) => prev.filter((_, i) => i !== index));
    };

    const updateItem = (
        index: number | null,
        key: keyof Approval,
        value: string
    ) => {
        const updated = [...approval];
        updated[index][key] = value;
        setApproval(updated);
    };

    const takePhoto = async () => {
        if (!cameraRef.current) return;

        try {
            const result = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                base64: false,
            });
            setCameraVisible(false);
            const obj = {
                uri: result.uri,
                name: `image${result.format}`,
                type: "image/jpg",
            };
            console.log("poto result", result);
            updateItem(activeIndex, "attachments", obj);
        } catch (err) {
            console.log("Error ambil foto:", err);
        } finally {
            setActiveIndex(null);
            setCameraVisible(false);
        }
    };

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    if (!permission) {
        return <View />;
    }

    return (
        <Modal visible={show} onRequestClose={onClose} transparent>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ThemedText type="Medium" size="lg">
                            Masukkan Informasi Produksi
                        </ThemedText>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: Color.Gray[400],
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={onClose}
                        >
                            <ThemedText size="xs" color={Color.Base.White}>
                                X
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        {approval.map((v: any, index: any) => (
                            <View key={`${index}`} style={{ marginTop: 15 }}>
                                <View style={{ gap: 8 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ThemedText>Masukkan Jumlah</ThemedText>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deleteItem(index)}
                                        >
                                            <Text
                                                style={{
                                                    color: "white",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ×
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        placeholder="Contoh: 12"
                                        style={{
                                            borderRadius: 4,
                                            borderWidth: 1,
                                            borderColor: Color.Gray[300],
                                        }}
                                        value={v.qty}
                                        onChangeText={(text: any) =>
                                            updateItem(index, "qty", text)
                                        }
                                    />
                                </View>
                                <View style={{ gap: 8 }}>
                                    <ThemedDropdown
                                        label="Apakah bisa diperbaiki?"
                                        value={v.status}
                                        items={status}
                                        onValueChange={(value) =>
                                            updateItem(index, "status", value)
                                        }
                                    />
                                </View>
                                <View style={{ gap: 8 }}>
                                    <ThemedText>
                                        Masukkan Poto Hasil Produksi
                                    </ThemedText>
                                    {v.attachments?.uri ? (
                                        <Image
                                            source={{ uri: v.attachments?.uri }}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 6,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.imageContainer}
                                            // onPress={pickImage}
                                            onPress={() => {
                                                setActiveIndex(index);
                                                setCameraVisible(true);
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
                                    )}
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addMore}
                        >
                            <Text style={styles.addText}>Tambah Data +</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            {
                                position: "absolute",
                                bottom: 10,
                                width: "100%",
                            },
                        ]}
                        onPress={() => submit(approval)}
                    >
                        <Text style={styles.addText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Modal Kamera */}
            <Modal visible={cameraVisible} animationType="slide">
                <CameraView style={{ flex: 1 }} ref={cameraRef} />
                <TouchableOpacity
                    onPress={() => setCameraVisible(false)}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        alignSelf: "center",
                        backgroundColor: "#0008",
                        padding: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "white" }}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // setCameraVisible(false)
                        takePhoto();
                    }}
                    style={{
                        position: "absolute",
                        bottom: 50,
                        alignSelf: "center",
                        backgroundColor: "#0008",
                        padding: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "white" }}>Ambil Gambar</Text>
                </TouchableOpacity>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: "#e53935",
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    addButton: {
        width: "40%",
        alignSelf: "center",
        backgroundColor: "#009688",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },
    addText: { color: "white", fontWeight: "600" },
    placeholder: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        marginRight: 10,
        marginTop: 10,
        position: "relative",
    },
    content: {
        width: "100%",
        backgroundColor: Color.Base.White,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        padding: 12,
        maxHeight: Dimensions.get("window").height * 0.7,
    },
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
});

export default ModalEndFinishing;
