import {
    SelectInput,
    ThemedContainer,
    ThemedHeader,
    ThemedText,
} from "@/components";
import {
    addProduct,
    getAccesorice,
    getCategory,
    getMaterial,
    getProductOne,
    getUnit,
    updateProduct,
} from "@/services/warehouseService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// -----------------------------
// Types
// -----------------------------
type ProductMaterial = {
  material_id: string;
  usage_quantity: string;
};

type ProductAccessory = {
  accessory_variant_id: string;
  qty: string;
};

type ProductForm = {
  name: string;
  sort_name: string;
  weight: string;
  level: string;
  description: string;
  category_id: string;
  cutting_fee: string;
  sewing_fee: string;
  finishing_fee: string;
  other_fee: string;
  productMaterials: ProductMaterial[];
  accessories: ProductAccessory[];
  data?: any[]; // optional, untuk gambar & varian size
};

// -----------------------------
// Component
// -----------------------------
const ProdukAdd: React.FC = () => {
  const { slug, mode } = useLocalSearchParams<{
    slug?: string;
    mode?: "add" | "edit" | "view";
  }>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    sort_name: "",
    weight: "",
    level: "",
    description: "",
    category_id: "",
    cutting_fee: "",
    sewing_fee: "",
    finishing_fee: "",
    other_fee: "",
    productMaterials: [{ material_id: "", usage_quantity: "" }],
    accessories: [{ accessory_variant_id: "", qty: "" }],
  });

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [unitList, setUnitList] = useState<any[]>([]);
  const [materialList, setMaterialList] = useState<any[]>([]);
  const [accessoryList, setAccessoryList] = useState<any[]>([]);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = !mode || mode === "add";

  // -----------------------------
  // Fetch dropdown data
  // -----------------------------
  const fetchDropdowns = useCallback(async () => {
    try {
      const [catRes, unitRes, matRes, accRes] = await Promise.all([
        getCategory(),
        getUnit(),
        getMaterial(),
        getAccesorice(),
      ]);
      setCategoryList(catRes || []);
      setUnitList(unitRes || []);
      setMaterialList(matRes || []);
      setAccessoryList(accRes || []);
    } catch (e) {
      console.log("Dropdown fetch error", e);
    }
  }, []);

  // -----------------------------
  // Fetch detail untuk edit/view
  // -----------------------------
  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      // TODO: tambahkan getProductOne() sesuai service kamu
      const res: any = await getProductOne(slug);
      const data = res?.data || res;

        setForm({
        name: data.name || "",
        sort_name: data.sort_name || "",
        weight: String(data.weight || ""),
        level: data.level || "",
        description: data.description || "",
        category_id: String(data.category_id || ""),
        cutting_fee: String(data.cutting_fee || ""),
        sewing_fee: String(data.sewing_fee || ""),
        finishing_fee: String(data.finishing_fee || ""),
        other_fee: String(data.other_fee || ""),

        productMaterials:
            data.product_materials?.map((m: any) => ({
            id: m.id, // buat update
            material_id: String(m.material_id),
            usage_quantity: String(m.usage_quantity),
            })) || [{ material_id: "", usage_quantity: "" }],

        accessories:
            data.accessories?.map((a: any) => ({
            id: a.id, // buat update
            accessory_variant_id: String(a.accessory_variant_id),
            qty: String(a.qty),
            })) || [{ accessory_variant_id: "", qty: "" }],

        // optional kalau nanti ada gambar/varian size
        data: data.variants
            ? [
                ...new Map(
                data.variants.map((v: any) => [
                    v.color,
                    {
                    color: v.color,
                    variants: [
                        {
                        id: v.id,
                        size_id: v.size_id,
                        sku: v.sku,
                        price: v.price,
                        stock: v.stock,
                        min_stock: v.min_stock,
                        },
                    ],
                    image: null, // kalau belum ada di API
                    },
                ])
                ).values(),
            ]
            : [],
        });
    } catch (err) {
      console.log("Fetch product detail error", err);
      Alert.alert("Error", "Gagal memuat detail produk");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDropdowns();
    if (isEdit || isView) fetchDetail();
  }, [fetchDropdowns, fetchDetail]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (key: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMaterialChange = (
    index: number,
    key: keyof ProductMaterial,
    value: string
  ) => {
    const updated = [...form.productMaterials];
    updated[index] = { ...updated[index], [key]: value };
    setForm((prev) => ({ ...prev, productMaterials: updated }));
  };

  const handleAccessoryChange = (
    index: number,
    key: keyof ProductAccessory,
    value: string
  ) => {
    const updated = [...form.accessories];
    updated[index] = { ...updated[index], [key]: value };
    setForm((prev) => ({ ...prev, accessories: updated }));
  };

  const addMaterialRow = () => {
    setForm((prev) => ({
      ...prev,
      productMaterials: [...prev.productMaterials, { material_id: "", usage_quantity: "" }],
    }));
  };

  const addAccessoryRow = () => {
    setForm((prev) => ({
      ...prev,
      accessories: [...prev.accessories, { accessory_variant_id: "", qty: "" }],
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      let res;
      if (isAdd) res = await addProduct(form);
      if (isEdit && slug) res = await updateProduct(slug, form);

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
          isAdd ? "Tambah Produk" : isEdit ? "Edit Produk" : "Detail Produk"
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText>Nama Produk</ThemedText>
          <TextInput
            editable={!isView}
            value={form.name}
            onChangeText={(t) => handleChange("name", t)}
            placeholder="Nama Produk"
            style={[styles.input, isView && styles.disabled]}
          />
        </View>

        <View>
          <ThemedText>Singkatan (Sort Name)</ThemedText>
          <TextInput
            editable={!isView}
            value={form.sort_name}
            onChangeText={(t) => handleChange("sort_name", t)}
            placeholder="Contoh: ELN"
            style={[styles.input, isView && styles.disabled]}
          />
        </View>

        <SelectInput
          label="Kategori"
          value={form.category_id}
          disabled={isView}
          options={categoryList.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
          placeholder="Pilih kategori"
          onSelect={(v) => handleChange("category_id", v)}
        />

        <ThemedText>Berat (Kg)</ThemedText>
        <TextInput
          editable={!isView}
          value={form.weight}
          onChangeText={(t) => handleChange("weight", t)}
          keyboardType="numeric"
          style={[styles.input, isView && styles.disabled]}
        />

        <SelectInput
            label="Tingkat Kesulitan"
            value={form.level}
            disabled={isView}
            options={[
                { label: "MUDAH", value: "MUDAH" },
                { label: "SEDANG", value: "SEDANG" },
                { label: "SULIT", value: "SULIT" },
            ]}
            placeholder="Pilih tingkat kesulitan"
            onSelect={(v) => handleChange("level", v)}
        />

        <ThemedText>Deskripsi</ThemedText>
        <TextInput
          editable={!isView}
          value={form.description}
          onChangeText={(t) => handleChange("description", t)}
          placeholder="Tuliskan deskripsi produk"
          multiline
          style={[styles.input, { minHeight: 80 }, isView && styles.disabled]}
        />

        {/* Biaya */}
        <View style={styles.feeRow}>
          <View style={{ flex: 1 }}>
            <ThemedText>Cutting Fee</ThemedText>
            <TextInput
              editable={!isView}
              value={form.cutting_fee}
              onChangeText={(t) => handleChange("cutting_fee", t)}
              keyboardType="numeric"
              style={[styles.input, isView && styles.disabled]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText>Sewing Fee</ThemedText>
            <TextInput
              editable={!isView}
              value={form.sewing_fee}
              onChangeText={(t) => handleChange("sewing_fee", t)}
              keyboardType="numeric"
              style={[styles.input, isView && styles.disabled]}
            />
          </View>
        </View>

        <View style={styles.feeRow}>
          <View style={{ flex: 1 }}>
            <ThemedText>Finishing Fee</ThemedText>
            <TextInput
              editable={!isView}
              value={form.finishing_fee}
              onChangeText={(t) => handleChange("finishing_fee", t)}
              keyboardType="numeric"
              style={[styles.input, isView && styles.disabled]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText>Other Fee</ThemedText>
            <TextInput
              editable={!isView}
              value={form.other_fee}
              onChangeText={(t) => handleChange("other_fee", t)}
              keyboardType="numeric"
              style={[styles.input, isView && styles.disabled]}
            />
          </View>
        </View>

        {/* Material Section */}
        <View style={{ marginTop: 12 }}>
          <ThemedText type="SemiBold">Bahan / Material</ThemedText>
          {form.productMaterials.map((m, i) => (
            <View key={i} style={styles.variantBox}>
              <SelectInput
                label={`Material ${i + 1}`}
                value={m.material_id}
                disabled={isView}
                options={materialList.map((mat) => ({
                  label: mat.name,
                  value: mat.id,
                }))}
                placeholder="Pilih bahan"
                onSelect={(val) =>
                  handleMaterialChange(i, "material_id", val)
                }
              />
              <ThemedText>Jumlah Pemakaian</ThemedText>
              <TextInput
                editable={!isView}
                keyboardType="numeric"
                value={m.usage_quantity}
                onChangeText={(t) =>
                  handleMaterialChange(i, "usage_quantity", t)
                }
                style={[styles.input, isView && styles.disabled]}
              />
            </View>
          ))}

          {!isView && (
            <TouchableOpacity style={styles.addVariantBtn} onPress={addMaterialRow}>
              <ThemedText type="SemiBold" color="#2563eb">
                ＋ Tambah Material
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Accessories Section */}
        <View style={{ marginTop: 12 }}>
          <ThemedText type="SemiBold">Aksesoris</ThemedText>
          {form.accessories.map((a, i) => (
            <View key={i} style={styles.variantBox}>
              <SelectInput
                label={`Aksesoris ${i + 1}`}
                value={a.accessory_variant_id}
                disabled={isView}
                options={accessoryList.map((acc) => ({
                    label: acc.name,
                    value: acc.id,
                }))}
                placeholder="Pilih aksesoris"
                onSelect={(val) =>
                    handleAccessoryChange(i, "accessory_variant_id", val)
                }
                />
              <ThemedText>Jumlah</ThemedText>
              <TextInput
                editable={!isView}
                keyboardType="numeric"
                value={a.qty}
                onChangeText={(t) => handleAccessoryChange(i, "qty", t)}
                style={[styles.input, isView && styles.disabled]}
              />
            </View>
          ))}

          {!isView && (
            <TouchableOpacity style={styles.addVariantBtn} onPress={addAccessoryRow}>
              <ThemedText type="SemiBold" color="#2563eb">
                ＋ Tambah Aksesoris
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
                : "Tambah Produk"}
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
  feeRow: {
    flexDirection: "row",
    gap: 12,
  },
  variantBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 6,
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

export default ProdukAdd;
