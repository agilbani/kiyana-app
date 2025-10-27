import {
    SelectInput,
    ThemedContainer,
    ThemedHeader,
    ThemedText,
} from "@/components";
import { PATH } from "@/constants/PathAsset";
import {
    addMaterial,
    getMaterialOne,
    getMaterialVariant,
    getSuppliers,
    getUnit,
    updateMaterial,
} from "@/services/warehouseService";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// -----------------------------
// Types
// -----------------------------
type Variant = {
    id?: string;
    color_id: string;
    price: string;
    stock: string;
    min_stock: string;
    image?: any;
    preview?: string;
};

type MaterialForm = {
    name: string;
    supplier_id: string;
    unit_id: string;
    variants: Variant[];
};

// -----------------------------
// Component
// -----------------------------
const BahanAdd: React.FC = () => {
    const { slug, mode } = useLocalSearchParams<{
        slug?: string;
        mode?: "add" | "edit" | "view";
    }>();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<MaterialForm>({
        name: "",
        supplier_id: "",
        unit_id: "",
        variants: [{ color_id: "", price: "", stock: "", min_stock: "" }],
    });

    const [variantList, setVariantList] = useState<any[]>([]);
    const [unitList, setUnitList] = useState<any[]>([]);
    const [supplierList, setSupplierList] = useState<any[]>([]);

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = !mode || mode === "add";

    // 🔹 Fetch dropdown data
    const fetchDropdowns = useCallback(async () => {
        try {
            const [variantRes, unitRes, supplierRes] = await Promise.all([
                getMaterialVariant(),
                getUnit(),
                getSuppliers(),
            ]);
            setVariantList(variantRes || []);
            setUnitList(unitRes || []);
            setSupplierList(supplierRes || []);
        } catch (e) {
            console.log("Dropdown fetch error", e);
        }
    }, []);

    // 🔹 Fetch detail untuk edit/view
    const fetchDetail = useCallback(async () => {
        if (!slug) return;
        try {
            setLoading(true);
            const res: any = await getMaterialOne(slug);
            const data = res?.data || res;

            setForm({
                name: data.name || "",
                supplier_id: data.supplier_id || "",
                unit_id: String(data.unit_id || ""),
                variants: data.variants?.map((v: any) => ({
                    id: v.id,
                    color_id: String(v.color?.id || v.color_id || ""),
                    price: String(v.price || ""),
                    stock: String(v.stock || ""),
                    min_stock: String(v.min_stock || ""),
                    preview: v.image || undefined,
                })) || [{ color_id: "", price: "", stock: "", min_stock: "" }],
            });
        } catch (err) {
            console.log("Fetch material error", err);
            Alert.alert("Error", "Gagal memuat data material");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchDropdowns();
        if (isEdit || isView) fetchDetail();
    }, [fetchDropdowns, fetchDetail]);

    // 🔹 Input handler
    const handleChange = (key: keyof MaterialForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleVariantChange = (
        index: number,
        key: keyof Variant,
        value: any
    ) => {
        const updated = [...form.variants];
        updated[index] = { ...updated[index], [key]: value };
        setForm((prev) => ({ ...prev, variants: updated }));
    };

    // 🔹 Pilih gambar (ImagePicker)
    const handlePickImage = async (index: number) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Izin diperlukan",
                "Berikan izin akses galeri untuk memilih gambar."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            const image = result.assets[0];
            const localUri = image.uri;
            const fileName = localUri.split("/").pop() || "photo.jpg";
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `image/${match[1]}` : `image`;

            handleVariantChange(index, "image", {
                uri: localUri,
                name: fileName,
                type,
            });
            handleVariantChange(index, "preview", localUri);
        }
    };

    // 🔹 Add / Remove Variant
    const handleAddVariant = () => {
        setForm((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                { color_id: "", price: "", stock: "", min_stock: "" },
            ],
        }));
    };

    const handleRemoveVariant = (index: number) => {
        Alert.alert("Hapus Varian", "Yakin ingin menghapus varian ini?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Hapus",
                style: "destructive",
                onPress: () => {
                    setForm((prev) => {
                        const updated = [...prev.variants];
                        updated.splice(index, 1);
                        return { ...prev, variants: updated };
                    });
                },
            },
        ]);
    };

    // 🔹 Submit handler
    const handleSubmit = async () => {
        console.log("cek form", form);

        try {
            setSubmitting(true);
            let res;
            if (isAdd) res = await addMaterial(form);
            if (isEdit && slug) res = await updateMaterial(slug, form);

            if (res?.success) {
                Alert.alert("Sukses", res.message, [
                    { text: "OK", onPress: () => router.back() },
                ]);
            } else {
                Alert.alert("Gagal", res?.message || "Terjadi kesalahan");
            }
        } catch (err) {
            console.log("Submit error", err);
            Alert.alert("Error", "Gagal menyimpan data");
        } finally {
            setSubmitting(false);
        }
    };

    // -----------------------------
    // UI
    // -----------------------------
    if (loading) {
        return (
            <ThemedContainer>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <ThemedText>Memuat data...</ThemedText>
                </View>
            </ThemedContainer>
        );
    }

    return (
        <ThemedContainer>
            <ThemedHeader
                title={
                    isAdd
                        ? "Tambah Material"
                        : isEdit
                        ? "Edit Material"
                        : "Detail Material"
                }
            />

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    gap: 14,
                    paddingBottom: 64,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Nama Material */}
                <View>
                    <ThemedText>Nama Material</ThemedText>
                    <TextInput
                        editable={!isView}
                        value={form.name}
                        onChangeText={(t) => handleChange("name", t)}
                        placeholder="Contoh: Kain Katun"
                        style={[styles.input, isView && styles.disabled]}
                    />
                </View>

                {/* Supplier */}
                <SelectInput
                    label="Supplier"
                    value={form.supplier_id}
                    disabled={isView}
                    options={supplierList.map((s) => ({
                        label: s.name,
                        value: s.id,
                    }))}
                    placeholder="Pilih supplier"
                    onSelect={(v) => handleChange("supplier_id", v)}
                />

                {/* Unit */}
                <SelectInput
                    label="Satuan"
                    value={form.unit_id}
                    disabled={isView}
                    options={unitList.map((u) => ({
                        label: u.name,
                        value: u.id,
                    }))}
                    placeholder="Pilih satuan"
                    onSelect={(v) => handleChange("unit_id", v)}
                />

                {/* Variants */}
                <View style={{ marginTop: 8 }}>
                    <ThemedText type="SemiBold">Varian</ThemedText>

                    {form.variants.map((v, i) => (
                        <View key={i} style={styles.variantBox}>
                            <View style={styles.variantHeader}>
                                <ThemedText type="SemiBold">
                                    Varian {i + 1}
                                </ThemedText>
                                {!isView && form.variants.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => handleRemoveVariant(i)}
                                        style={styles.deleteVariantBtn}
                                    >
                                        <ThemedText color="#fff">🗑️</ThemedText>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <SelectInput
                                label="Warna"
                                value={v.color_id}
                                disabled={isView}
                                options={variantList.map((c) => ({
                                    label: c?.color?.name || c?.name,
                                    value: String(c?.color?.id || c?.id),
                                }))}
                                placeholder="Pilih warna"
                                onSelect={(val) =>
                                    handleVariantChange(i, "color_id", val)
                                }
                            />

                            {/* Gambar */}
                            <View style={{ marginTop: 6 }}>
                                <ThemedText>Gambar</ThemedText>
                                {v.preview ? (
                                    <TouchableOpacity
                                        disabled={isView}
                                        onPress={() => handlePickImage(i)}
                                    >
                                        <Image
                                            source={{
                                                uri: `${PATH}${v.preview}`,
                                            }}
                                            style={{
                                                width: "100%",
                                                height: 150,
                                                borderRadius: 10,
                                            }}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    !isView && (
                                        <TouchableOpacity
                                            onPress={() => handlePickImage(i)}
                                            style={styles.uploadBtn}
                                        >
                                            <ThemedText color="#2563eb">
                                                ＋ Pilih Gambar
                                            </ThemedText>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>

                            <ThemedText>Harga</ThemedText>
                            <TextInput
                                editable={!isView}
                                keyboardType="numeric"
                                value={v.price}
                                onChangeText={(t) =>
                                    handleVariantChange(i, "price", t)
                                }
                                style={[
                                    styles.input,
                                    isView && styles.disabled,
                                ]}
                            />

                            <ThemedText>Stok</ThemedText>
                            <TextInput
                                editable={!isView}
                                keyboardType="numeric"
                                value={v.stock}
                                onChangeText={(t) =>
                                    handleVariantChange(i, "stock", t)
                                }
                                style={[
                                    styles.input,
                                    isView && styles.disabled,
                                ]}
                            />

                            <ThemedText>Stok Minimum</ThemedText>
                            <TextInput
                                editable={!isView}
                                keyboardType="numeric"
                                value={v.min_stock}
                                onChangeText={(t) =>
                                    handleVariantChange(i, "min_stock", t)
                                }
                                style={[
                                    styles.input,
                                    isView && styles.disabled,
                                ]}
                            />
                        </View>
                    ))}

                    {!isView && (
                        <TouchableOpacity
                            style={styles.addVariantBtn}
                            onPress={handleAddVariant}
                        >
                            <ThemedText type="SemiBold" color="#2563eb">
                                ＋ Tambah Varian
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                </View>

                {!isView && (
                    <TouchableOpacity
                        disabled={submitting}
                        style={[styles.saveBtn, submitting && { opacity: 0.6 }]}
                        onPress={handleSubmit}
                    >
                        <ThemedText type="SemiBold" color="#fff">
                            {submitting
                                ? "Menyimpan..."
                                : isEdit
                                ? "Simpan Perubahan"
                                : "Tambah Material"}
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </ThemedContainer>
    );
};

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    disabled: {
        backgroundColor: "#f3f4f6",
    },
    variantBox: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        padding: 10,
        marginTop: 8,
        gap: 6,
    },
    variantHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    deleteVariantBtn: {
        backgroundColor: "#ef4444",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    uploadBtn: {
        borderWidth: 1,
        borderColor: "#2563eb",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 6,
    },
    addVariantBtn: {
        marginTop: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#2563eb",
        borderRadius: 10,
        alignItems: "center",
    },
    saveBtn: {
        backgroundColor: "#2563eb",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        marginTop: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
});

export default BahanAdd;
