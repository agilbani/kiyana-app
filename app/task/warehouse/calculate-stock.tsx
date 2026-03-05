import { ThemedHeader } from "@/components";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { useApp } from "@/context/AppContext";
import { calculateStock, getProductBySKU } from "@/services/masterService";
import { usePositionBottom } from "@/utils/bottomPosition";
import { hasMenuAccess } from "@/utils/helpher";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface StockItem {
    id: string;
    sku: string;
    product?: string;
    initialStock: number | null; // stock dari response scan (readonly)
    currentStock: number | null; // input user
    difference: number | null; // currentStock - initialStock
    type?: string;
}

export default function PerhitunganStockScreen() {
    const { user } = useApp();
    const { bottom } = usePositionBottom();
    const [items, setItems] = useState<StockItem[]>([
        {
            id: Date.now().toString(),
            sku: "",
            initialStock: null,
            currentStock: null,
            difference: null,
            type: "",
            product: "",
        },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    useEffect(() => {
        if (!permission) requestPermission();
    }, []);

    // Handle scan result
    const handleBarcodeScanned = async (barcode: string) => {
        setModalVisible(false);
        if (activeIndex === null) return;

        try {
            LoadingManager.show();
            const res = await getProductBySKU(barcode);
            LoadingManager.hide();

            setItems((prev) => {
                const updated = [...prev];
                updated[activeIndex] = {
                    ...updated[activeIndex],
                    sku: res.data.data.variant.sku,
                    initialStock: res.data.data.variant.stock,
                    product: `${res.data.data.variant.item.name} - ${res.data.data.variant.color.name}`,
                    type: res.data.data.type,
                    // reset currentStock/difference ketika product baru dimasukkan
                    //   currentStock: updated[activeIndex].currentStock ?? null,
                    //   difference:
                    //       updated[activeIndex].currentStock != null
                    //           ? (updated[activeIndex].currentStock || 0) -
                    //             response.stock
                    //           : null,
                };
                return updated;
            });
        } catch (err) {
            console.error(err);
        }
    };

    // Tambah data baru
    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                sku: "",
                initialStock: null,
                currentStock: null,
                difference: null,
                type: "",
                product: "",
            },
        ]);
    };

    // Hapus item
    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    // Update currentStock (input user) dan hitung difference
    const handleCurrentStockChange = (id: string, value: string) => {
        setItems((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((i) => i.id === id);
            if (idx === -1) return prev;
            const parsed = value === "" ? null : parseInt(value, 10);
            updated[idx].currentStock = parsed;
            if (updated[idx].initialStock != null && parsed != null) {
                updated[idx].difference = parsed - updated[idx].initialStock;
            } else {
                updated[idx].difference = null;
            }
            return updated;
        });
    };

    const handleSubmit = async () => {
        let payload = [];
        for (let i = 0; i < items.length; i++) {
            payload.push({
                type: items[i].type,
                sku: items[i].sku,
                stock: items[i].initialStock,
                actual_stock: items[i].currentStock,
            });
        }
        const params = {
            data: payload,
        };
        LoadingManager.show();
        const res = await calculateStock(params);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
    };

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.CALCULATE_STOCK)) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    return (
        <View style={styles.container}>
            <ThemedHeader title="Perhitungan Stock" />

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 140,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                }}
            >
                {items.map((item, index) => (
                    <View key={item.id} style={styles.card}>
                        {/* Tombol delete */}
                        {items.length > 1 && (
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => deleteItem(item.id)}
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

                        {/* Scan Produk */}
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => {
                                setActiveIndex(index);
                                setModalVisible(true);
                            }}
                        >
                            <Text style={styles.scanText}>📷 Scan Produk</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Produk | SKU"
                            value={item.product}
                            editable={false}
                            onChangeText={(text) =>
                                setItems((prev) => {
                                    const updated = [...prev];
                                    const idx = updated.findIndex(
                                        (i) => i.id === item.id,
                                    );
                                    if (idx !== -1) updated[idx].sku = text;
                                    return updated;
                                })
                            }
                        />

                        {/* ROW: initialStock (readonly) --- difference */}
                        <View style={styles.topRow}>
                            <View style={styles.initialBox}>
                                <Text>Stock Gudang Default</Text>
                                <TextInput
                                    style={[styles.input, { marginTop: 6 }]}
                                    value={
                                        item.initialStock != null
                                            ? item.initialStock.toString()
                                            : ""
                                    }
                                    editable={false}
                                />
                            </View>

                            <View style={styles.diffBoxContainer}>
                                <Text>Perbedaan</Text>
                                <View
                                    style={[
                                        styles.diffBox,
                                        item.difference == null
                                            ? { backgroundColor: "#f3f4f6" }
                                            : item.difference < 0
                                              ? { backgroundColor: "#fee2e2" }
                                              : { backgroundColor: "#dcfce7" },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color:
                                                item.difference == null
                                                    ? "#6b7280"
                                                    : item.difference < 0
                                                      ? "#dc2626"
                                                      : "#16a34a",
                                            fontWeight: "700",
                                            fontSize: 16,
                                        }}
                                    >
                                        {item.difference == null
                                            ? "-"
                                            : item.difference > 0
                                              ? `+${item.difference}`
                                              : `${item.difference}`}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Input current stock berada di bawah */}
                        <View style={{ marginTop: 10 }}>
                            <Text>Masukkan Stock Sekarang</Text>
                            <TextInput
                                style={[styles.input, { marginTop: 6 }]}
                                keyboardType="numeric"
                                placeholder="Masukkan Stock Sekarang"
                                value={
                                    item.currentStock != null
                                        ? item.currentStock.toString()
                                        : ""
                                }
                                onChangeText={(text) =>
                                    handleCurrentStockChange(item.id, text)
                                }
                            />
                        </View>

                        {/* Tombol tambah hanya di item terakhir */}
                        {index === items.length - 1 && (
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={addItem}
                            >
                                <Text style={styles.addText}>
                                    Tambah Data +
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { bottom }]}>
                <TouchableOpacity
                    style={[styles.footerBtn, { backgroundColor: "#16a34a" }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.footerText}>Simpan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.footerBtn, { backgroundColor: "#dc2626" }]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.footerText}>Batalkan</Text>
                </TouchableOpacity>
            </View>

            {/* Modal Kamera */}
            <Modal visible={modalVisible} animationType="slide">
                <CameraView
                    onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
                    style={{ flex: 1 }}
                />
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                        Tutup
                    </Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f4f5" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
    card: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        position: "relative",
    },
    scanButton: {
        backgroundColor: "#e0f2fe",
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: "center",
    },
    scanText: { color: "#0284c7", fontWeight: "600" },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "white",
        color: Color.Base.Black,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 8,
    },
    initialBox: {
        flex: 1,
    },
    diffBoxContainer: {
        width: 96,
        alignItems: "center",
    },
    diffBox: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 72,
    },
    addButton: {
        backgroundColor: "#e0f2fe",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    addText: { color: "#0369a1", fontWeight: "600" },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#f4f4f5",
    },
    footerBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    footerText: { color: "white", fontWeight: "bold" },
    closeBtn: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    deleteBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#ef4444",
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
});
