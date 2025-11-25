import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { deleteAccesorice, getAccesorice } from "@/services/warehouseService";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// -----------------------------
// Types
// -----------------------------
type Accessory = {
    id: number;
    slug: string;
    name: string;
    supplier?: { name: string };
    unit?: { name: string };
};

// -----------------------------
// Helper
// -----------------------------
const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts[0][0].toUpperCase() + (parts[1]?.[0]?.toUpperCase() || "");
};

// -----------------------------
// Component
// -----------------------------
const Aksesoris: React.FC = () => {
    const [data, setData] = useState<Accessory[]>([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch list dari API
    const fetchAccessories = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await getAccesorice();
            setData(res || []);
        } catch (err) {
            // console.log("Fetch accessories error:", err);
            Alert.alert("Error", "Gagal memuat data aksesoris");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccessories();
    }, []);

    // 🔹 Delete handler
    const handleDelete = useCallback(
        async (slug: string) => {
            Alert.alert("Konfirmasi", "Yakin ingin menghapus aksesoris ini?", [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteAccesorice(slug, {});
                        if (res.success) {
                            Alert.alert("Sukses", "Aksesoris berhasil dihapus");
                            fetchAccessories();
                        } else {
                            Alert.alert(
                                "Gagal",
                                res.message || "Gagal menghapus aksesoris"
                            );
                        }
                    },
                },
            ]);
        },
        [fetchAccessories]
    );

    // 🔹 Render item list
    const renderItem = useCallback(
        ({ item }: { item: Accessory }) => {
            return (
                <View style={styles.row}>
                    <View style={styles.avatar}>
                        <ThemedText type="Bold" size="lg" color="#fff">
                            {getInitials(item.name)}
                        </ThemedText>
                    </View>

                    <View style={{ flex: 1 }}>
                        <ThemedText type="SemiBold" size="md">
                            {item.name}
                        </ThemedText>
                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            {item.supplier?.name || "Tanpa Supplier"}
                        </ThemedText>
                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            Satuan: {item.unit?.name || "-"}
                        </ThemedText>
                    </View>

                    <View style={styles.actions}>
                        {/* Edit button */}
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: ROUTES.AKSESORIS_ADD,
                                    params: { slug: item.slug, mode: "edit" },
                                })
                            }
                            style={[
                                styles.actionBtn,
                                { backgroundColor: "#2563eb" },
                            ]}
                        >
                            <ThemedText color="#fff">✏️</ThemedText>
                        </TouchableOpacity>

                        {/* Delete button */}
                        <TouchableOpacity
                            onPress={() => handleDelete(item.slug)}
                            style={[
                                styles.actionBtn,
                                { backgroundColor: "#ef4444" },
                            ]}
                        >
                            <ThemedText color="#fff">🗑️</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        },
        [handleDelete]
    );

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <ThemedContainer>
            {/* Header */}
            <ThemedHeader title="Daftar Aksesoris" />
            <View style={styles.headerWrap}>
                <View />
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: ROUTES.AKSESORIS_ADD,
                            params: { mode: "add" },
                        })
                    }
                    style={styles.addBtn}
                >
                    <ThemedText type="SemiBold" color="#fff">
                        ＋ Tambah
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <ThemedText>Memuat data...</ThemedText>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(it) => String(it.id)}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ padding: 24 }}>
                            <ThemedText>Tidak ada aksesoris</ThemedText>
                        </View>
                    )}
                />
            )}
        </ThemedContainer>
    );
};

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
    headerWrap: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    addBtn: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#1e40af",
        justifyContent: "center",
        alignItems: "center",
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
    actionBtn: {
        padding: 8,
        borderRadius: 8,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#e5e7eb",
        marginLeft: 16,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
});

export default Aksesoris;
