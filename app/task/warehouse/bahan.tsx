import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { deleteMaterial, getMaterial } from "@/services/warehouseService";
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

// --- Types ---
type Material = {
    id: number;
    slug: string;
    name: string;
    supplier?: { name: string };
    unit?: { name: string };
};

// --- Helper ---
const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts[0][0].toUpperCase() + (parts[1]?.[0]?.toUpperCase() || "");
};

// --- Screen ---
const BahanScreen: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch data dari API
    const fetchMaterials = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await getMaterial();
            console.log("API Response:", res);
            setMaterials(res || []);
        } catch (err: any) {
            console.log("Fetch material error:", err);
            Alert.alert("Error", "Gagal memuat data material");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, []);

    // 🔹 Delete Material
    const handleDelete = useCallback(
        async (slug: string) => {
            Alert.alert("Konfirmasi", "Yakin ingin menghapus material ini?", [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteMaterial(slug, {});
                        if (res.success) {
                            Alert.alert("Sukses", "Material berhasil dihapus");
                            fetchMaterials();
                        } else {
                            Alert.alert(
                                "Gagal",
                                res.message || "Gagal menghapus material"
                            );
                        }
                    },
                },
            ]);
        },
        [fetchMaterials]
    );

    // --- Render item ---
    const renderItem = useCallback(
        ({ item }: { item: Material }) => {
            return (
                <View style={styles.row}>
                    {/* Avatar / initials */}
                    <View style={styles.avatar}>
                        <ThemedText type="Bold" size="lg" color="#fff">
                            {getInitials(item.name)}
                        </ThemedText>
                    </View>

                    {/* Main content */}
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

                    {/* Actions */}
                    <View style={styles.actions}>
                        {/* Edit button */}
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: ROUTES.BAHAN_ADD,
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

    // --- Render screen ---
    return (
        <ThemedContainer>
            {/* Header + Add Button */}
            <ThemedHeader title="Daftar Bahan / Material" />
            <View style={styles.headerWrap}>
                <View />
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: ROUTES.BAHAN_ADD,
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
                    data={materials}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(it) => String(it.id)}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ padding: 24 }}>
                            <ThemedText>Tidak ada material</ThemedText>
                        </View>
                    )}
                />
            )}
        </ThemedContainer>
    );
};

// --- Styles ---
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
    deleteBtn: {
        padding: 8,
        backgroundColor: "#ef4444",
        borderRadius: 8,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
});

export default BahanScreen;
