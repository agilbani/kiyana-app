import { ThemedHeader } from "@/components";
import Color from "@/constants/Color";
import { addStock, getProductBySKU } from "@/services/masterService";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ItemData = {
    id: number;
    product?: string;
    qty?: string;
    scanCode?: string;
    type?: string;
};

export default function AddStockScreen() {
    const { bottom } = usePositionBottom();
    const router = useRouter();
    const [data, setData] = useState<ItemData[]>([{ id: Date.now() }]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    const handleScan = async (barcode: string) => {
        if (activeIndex === null) return;
        setCameraVisible(false);

        try {
            // contoh request API setelah scan
            LoadingManager.show();
            const res = await getProductBySKU(barcode);
            LoadingManager.hide();
            const updated = [...data];
            updated[activeIndex] = {
                ...updated[activeIndex],
                scanCode: res.data.data.variant?.sku,
                product: `${res.data.data.variant?.item.name} - ${res.data.data.variant?.color.name}`,
                type: res.data.data.type,
            };
            setData(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const addItem = () => {
        setData((prev) => [...prev, { id: Date.now() }]);
    };

    const updateItem = (index: number, key: keyof ItemData, value: string) => {
        const updated = [...data];
        updated[index][key] = value;
        setData(updated);
    };

    const deleteItem = (index: number) => {
        // minimal 1 form tersisa
        if (data.length === 1) return alert("Minimal harus ada 1 data");
        setData((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            let payload = [];
            for (let i = 0; i < data.length; i++) {
                payload.push({
                    type: data[i].type,
                    sku: data[i].scanCode,
                    stock: data[i].qty,
                });
            }
            const params = {
                data: payload,
            };
            LoadingManager.show();
            const res = await addStock(params);
            LoadingManager.hide();
            if (res.success) {
                ShowToastMessage(res.message);
                router.back();
            } else {
                ShowToastMessage(res.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!permission?.granted) {
        return (
            <View style={styles.center}>
                <Text>Meminta izin kamera...</Text>
            </View>
        );
    }

    return (
        <View
            style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
        >
            <StatusBar
                barStyle={"dark-content"}
                backgroundColor={Color.Base.White}
            />
            <ThemedHeader title="Penambahan Stock" />

            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {data.map((item, index) => (
                    <View key={item.id} style={[styles.card, { gap: 10 }]}>
                        {/* Tombol Hapus */}
                        {data.length > 1 && (
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
                        )}
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => {
                                setActiveIndex(index);
                                setCameraVisible(true);
                            }}
                        >
                            <Text style={styles.scanText}>📷 Scan Produk</Text>
                        </TouchableOpacity>

                        <View>
                            <Text>Nama Produk</Text>
                            <TextInput
                                placeholder="Produk | SKU"
                                style={styles.input}
                                value={item.product || ""}
                                onChangeText={(text) =>
                                    updateItem(index, "product", text)
                                }
                                editable={false}
                            />
                        </View>

                        <View>
                            <Text>Masukkan jumlah yang ditambahkan</Text>
                            <TextInput
                                placeholder="Jumlah"
                                keyboardType="numeric"
                                style={styles.input}
                                value={item.qty || ""}
                                onChangeText={(text) =>
                                    updateItem(index, "qty", text)
                                }
                            />
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addItem}>
                    <Text style={styles.addText}>Tambah Data +</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={[styles.footer, { bottom }]}>
                <TouchableOpacity
                    style={[
                        styles.footerButton,
                        { backgroundColor: "#0abf04" },
                    ]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.footerText}>Simpan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.footerButton,
                        { backgroundColor: "#e53935" },
                    ]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.footerText}>Batalkan</Text>
                </TouchableOpacity>
            </View>
            {/* Modal Kamera */}
            <Modal visible={cameraVisible} animationType="slide">
                <CameraView
                    style={{ flex: 1 }}
                    onBarcodeScanned={({ data }) => {
                        handleScan(data);
                    }}
                />
                <TouchableOpacity
                    onPress={() => setCameraVisible(false)}
                    style={{
                        position: "absolute",
                        bottom: 50,
                        alignSelf: "center",
                        backgroundColor: "#0008",
                        padding: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "white" }}>Tutup Kamera</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f3f4f6" },
    deleteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#e53935",
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginTop: 3,
    },
    scanButton: {
        backgroundColor: "#e8f3ff",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
    },
    scanText: { color: "#007bff", fontWeight: "600" },
    addButton: {
        backgroundColor: "#009688",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },
    addText: { color: "white", fontWeight: "600" },
    footer: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: Color.Base.White,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    footerButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    footerText: { color: "white", fontWeight: "600" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
