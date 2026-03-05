import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { deleteProduct, getProduct } from "@/services/warehouseService";
import { hasMenuAccess } from "@/utils/helpher";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// --- Types ---
type Product = {
    id: number;
    slug: string;
    name: string;
    category?: { name: string };
    level?: string;
    hpp?: number;
    material_cost?: number;
    accessories_cost?: number;
    images?: { url?: string }[];
};

// --- Helper ---
const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts[0][0].toUpperCase() + (parts[1]?.[0]?.toUpperCase() || "");
};

// --- Screen ---
const ProdukScreen: React.FC = () => {
    const { user } = useApp();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch data dari API
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await getProduct();
            console.log("API Response (produk):", res);
            setProducts(res || []);
        } catch (err: any) {
            console.log("Fetch product error:", err);
            Alert.alert("Error", "Gagal memuat data produk");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🔹 Delete Product
    const handleDelete = useCallback(
        async (slug: string) => {
            Alert.alert("Konfirmasi", "Yakin ingin menghapus produk ini?", [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteProduct(slug, {});
                        if (res.success) {
                            Alert.alert("Sukses", "Produk berhasil dihapus");
                            fetchProducts();
                        } else {
                            Alert.alert(
                                "Gagal",
                                res.message || "Gagal menghapus produk",
                            );
                        }
                    },
                },
            ]);
        },
        [fetchProducts],
    );

    // --- Render item ---
    const renderItem = useCallback(
        ({ item }: { item: Product }) => {
            const imageUri = item.images?.[0]?.url;

            return (
                <View style={styles.row}>
                    {/* Thumbnail */}
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.thumbnail}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <ThemedText type="Bold" size="lg" color="#fff">
                                {getInitials(item.name)}
                            </ThemedText>
                        </View>
                    )}

                    {/* Main content */}
                    <View style={{ flex: 1 }}>
                        <ThemedText type="SemiBold" size="md">
                            {item.name}
                        </ThemedText>

                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            Kategori: {item.category?.name || "-"}
                        </ThemedText>

                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            Level: {item.level || "-"}
                        </ThemedText>

                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            HPP: Rp {item.hpp?.toLocaleString("id-ID") || 0}
                        </ThemedText>

                        <ThemedText size="sm" color={Color.Text.Secondary}>
                            Material: Rp{" "}
                            {item.material_cost?.toLocaleString("id-ID") || 0} |
                            Accessories: Rp{" "}
                            {item.accessories_cost?.toLocaleString("id-ID") ||
                                0}
                        </ThemedText>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: ROUTES.PRODUK_ADD,
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
        [handleDelete],
    );

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.PRODUCT)) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    // --- Render screen ---
    return (
        <ThemedContainer>
            {/* Header + Add Button */}
            <ThemedHeader title="Daftar Produk" />
            <View style={styles.headerWrap}>
                <View />
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: ROUTES.PRODUK_ADD,
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
                    <ThemedText>Memuat data produk...</ThemedText>
                </View>
            ) : (
                <FlatList
                    data={products}
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
                            <ThemedText>Tidak ada produk</ThemedText>
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
    thumbnail: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
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

export default ProdukScreen;
