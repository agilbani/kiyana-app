import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { CameraView, useCameraPermissions } from "expo-camera"; // Camera (Expo) with barcode support
import { router } from "expo-router";

// -----------------------------
// Types
// -----------------------------
export type Variant = {
  id: string;
  name: string; // e.g., "Level 1", "Pedas", dll.
  price: number; // variant price
  sku?: string; // optional barcode/QR code string used for scanning
};

export type Product = {
  id: string;
  name: string; // e.g., "Ayam Geprek"
  variants: Variant[];
  isFavorite?: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string;
  displayName: string; // "Nama Produk - Variant"
  price: number;
  qty: number;
};

export type RootStackParamList = {
  POSProductList: undefined;
  POSPreview: { items: CartItem[] };
};

// -----------------------------
// Helpers
// -----------------------------
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const getInitials = (name: string) => {
  if (!name) return "?";
  const words = name.trim().split(" ").filter(Boolean);
  const first = words[0]?.[0] || "";
  const last = words.length > 1 ? words[words.length - 1][0] : words[0]?.[1] || "";
  return (first + last).toUpperCase();
};

// Badge text (e.g., 9+)
const toBadgeText = (qty: number) => (qty > 9 ? "9+" : String(qty));

// Flatten products->variants to render rows easily
const useFlattenedItems = (products: Product[]) => {
  return useMemo(() => {
    return products.flatMap((p) =>
      p.variants.map((v) => ({
        key: `${p.id}-${v.id}`,
        productId: p.id,
        variantId: v.id,
        productName: p.name,
        variantName: v.name,
        price: v.price,
        sku: v.sku,
        isFavorite: !!p.isFavorite,
      }))
    );
  }, [products]);
};

// -----------------------------
// Mock Data (replace with API)
// -----------------------------
const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Ayam Geprek",
    variants: [
      { id: "v1", name: "Original", price: 18000, sku: "AG-ORIG" },
      { id: "v2", name: "Keju", price: 22000, sku: "AG-KEJU" },
    ],
  },
  {
    id: "p2",
    name: "Teh Manis",
    variants: [{ id: "v4", name: "Dingin", price: 7000, sku: "TM-DINGIN" }],
  },
  {
    id: "p3",
    name: "Nasi Putih",
    variants: [{ id: "v5", name: "Porsi", price: 6000, sku: "NP-PORSI" }],
  },
];

// -----------------------------
// Main Screen (Product List)
// -----------------------------
const POSProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [query, setQuery] = useState("");
  const [cartMap, setCartMap] = useState<Record<string, CartItem>>({}); // key by variantId
  const [scanOpen, setScanOpen] = useState(false);

  const items = useFlattenedItems(products);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.productName.toLowerCase().includes(q) ||
        it.variantName.toLowerCase().includes(q) ||
        `${it.productName} - ${it.variantName}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const totals = useMemo(() => {
    const list = Object.values(cartMap);
    const qty = list.reduce((sum, c) => sum + c.qty, 0);
    const amount = list.reduce((sum, c) => sum + c.qty * c.price, 0);
    return { qty, amount };
  }, [cartMap]);

  const snapshotItems = useMemo(() => Object.values(cartMap), [cartMap]);

  const toggleFavorite = useCallback((productId: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p)));
  }, []);

  const addToCart = useCallback((productId: string, variantId: string, displayName: string, price: number) => {
    setCartMap((prev) => {
      const existing = prev[variantId];
      const nextQty = (existing?.qty || 0) + 1;
      return {
        ...prev,
        [variantId]: {
          productId,
          variantId,
          displayName,
          price,
          qty: nextQty,
        },
      };
    });
  }, []);

  const onScanCode = useCallback(
    (payload: string) => {
      const found = items.find((it) => it.sku && it.sku.toLowerCase() === payload.toLowerCase());
      if (!found) {
        Alert.alert("Kode tidak ditemukan", `Tidak ada produk dengan kode "${payload}"`);
        return;
      }
      const name = `${found.productName} - ${found.variantName}`;
      addToCart(found.productId, found.variantId, name, found.price);
      setScanOpen(false);
    },
    [items, addToCart]
  );

  const goToPreview = useCallback(() => {
    const state = encodeURIComponent(JSON.stringify(snapshotItems));
    router.push({ pathname: ROUTES.TASK_POINT_OF_SALE_PREVIEW_PODUCT_V2, params: { state } });
  }, [router, snapshotItems]);

  return (
    <ThemedContainer>
      <View style={styles.headerWrap}>
        <ThemedHeader title="POS • Penjualan" />
        <View style={styles.toolbar}>
          <SearchBar value={query} onChangeText={setQuery} />
          <TouchableOpacity style={styles.scanBtn} onPress={() => setScanOpen(true)}>
            <ThemedText type="SemiBold" size="md" color={"white"}>
              📷 Scan
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.key}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <ProductRow
            initials={getInitials(item.productName)}
            name={`${item.productName} - ${item.variantName}`}
            price={item.price}
            isFavorite={item.isFavorite}
            inCartQty={cartMap[item.variantId]?.qty || 0}
            onToggleFavorite={() => toggleFavorite(item.productId)}
            onAdd={() =>
              addToCart(
                item.productId,
                item.variantId,
                `${item.productName} - ${item.variantName}`,
                item.price
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Bottom Cart Summary */}
      <CartSummary
        qty={totals.qty}
        total={totals.amount}
        onPress={goToPreview}
      />

      {/* Camera Scanner Modal (Expo Camera) */}
      <ScanCameraModal visible={scanOpen} onClose={() => setScanOpen(false)} onSubmit={onScanCode} />
    </ThemedContainer>
  );
};

// -----------------------------
// UI Components (List Screen)
// -----------------------------
const SearchBar: React.FC<{ value: string; onChangeText: (t: string) => void }> = ({ value, onChangeText }) => {
  const inputRef = useRef<TextInput>(null);
  return (
    <View style={styles.searchWrap}>
      <ThemedText size="md">🔎</ThemedText>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Cari produk atau varian…"
        placeholderTextColor={"#9aa0a6"}
        style={styles.searchInput}
        returnKeyType="search"
      />
      {!!value && (
        <TouchableOpacity onPress={() => onChangeText("")}> 
          <ThemedText size="md">✕</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ProductRow: React.FC<{
  initials: string;
  name: string;
  price: number;
  isFavorite?: boolean;
  inCartQty?: number;
  onAdd: () => void;
  onToggleFavorite: () => void;
}> = React.memo(({ initials, name, price, isFavorite, inCartQty = 0, onAdd, onToggleFavorite }) => {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <ThemedText type="Bold" size="lg" color="#fff">
          {initials}
        </ThemedText>
      </View>

      <View style={{ flex: 1 }}>
        <ThemedText type="SemiBold" size="md" color={Color.Text.Primary}>
          {name}
        </ThemedText>
        <ThemedText size="sm" color={Color.Text.Secondary || "#5f6368"}>
          {formatCurrency(price)}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.iconBtn} accessibilityLabel="Favoritkan">
          <ThemedText size="lg">{isFavorite ? "★" : "☆"}</ThemedText>
        </TouchableOpacity>

        {/* Cart button with small badge when already added */}
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={onAdd} style={[styles.iconBtn, styles.cartBtn]} accessibilityLabel="Tambahkan ke keranjang">
            <ThemedText size="lg">🛒</ThemedText>
          </TouchableOpacity>
          {inCartQty > 0 && (
            <View style={styles.badge} accessible accessibilityLabel={`${inCartQty} di keranjang`}>
              <ThemedText type="SemiBold" size="xs" color="#fff">
                {toBadgeText(inCartQty)}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

const CartSummary: React.FC<{ qty: number; total: number; onPress: () => void }> = ({ qty, total, onPress }) => {
  if (qty === 0) return null;
  return (
    <View style={styles.cartBar}>
      <View style={{ flex: 1 }}>
        <ThemedText type="SemiBold" size="md">Keranjang</ThemedText>
        <ThemedText size="sm" color={Color.Text.Secondary || "#5f6368"}>
          {qty} item • {formatCurrency(total)}
        </ThemedText>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.cartBarBtn}>
        <ThemedText type="SemiBold" size="md" color="#fff">Lihat</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

// -----------------------------
// Camera Scanner Modal (Expo Camera)
// -----------------------------
const ScanCameraModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}> = ({ visible, onClose, onSubmit }) => {
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    setScanned(false);
  }, [visible]);

  const handleBarcode = useCallback(
    (result: { data: string; type: string }) => {
      if (scanned) return;
      setScanned(true);
      onSubmit(result.data);
    },
    [scanned, onSubmit]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalBackdrop}>
        <View style={styles.cameraCard}>
          <View style={styles.cameraHeader}>
            <ThemedText type="SemiBold" size="md">Scan Produk</ThemedText>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => setTorch((t) => !t)} style={styles.closeBtn} accessibilityLabel="Senter">
                <ThemedText size="md">{torch ? "🔦" : "💡"}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Tutup">
                <ThemedText size="md">✕</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {!permission && (
            <ThemedText size="sm" color={Color.Text.Secondary || "#5f6368"}>Memeriksa izin kamera…</ThemedText>
          )}

          {permission && !permission.granted && (
            <View style={{ gap: 10 }}>
              <ThemedText size="sm" color={Color.Text.Secondary || "#5f6368"}>
                Izin kamera belum diberikan.
              </ThemedText>
              <TouchableOpacity style={[styles.modalBtn, styles.modalOK]} onPress={requestPermission}>
                <ThemedText type="SemiBold" color="#fff">Izinkan Kamera</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancel]} onPress={() => Linking.openSettings()}>
                <ThemedText type="SemiBold">Buka Pengaturan</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {permission?.granted && (
            <View style={styles.cameraWrap}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                enableTorch={torch}
                onBarcodeScanned={scanned ? undefined : handleBarcode}
                barcodeScannerSettings={{ barcodeTypes: ["qr", "code128", "ean13"] }}
              />
              <View style={styles.focusBox} pointerEvents="none" />
              <View style={styles.cameraHint} pointerEvents="none">
                <ThemedText size="sm" color="#fff">Arahkan barcode/QR ke dalam kotak</ThemedText>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  headerWrap: {
    paddingBottom: 8,
    backgroundColor: Color.Background?.Background || "#fff",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f1f3f4",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
  },
  scanBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e8eaed",
    marginLeft: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Color.Background?.Background || "#fff",
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
    alignItems: "center",
    gap: 6,
    marginLeft: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8eaed",
  },
  cartBtn: {
    backgroundColor: "#f1f3f4",
  },
  // Small cart badge
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 24,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  cartBarBtn: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563eb",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  // Camera card
  cameraCard: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: Color.Background?.Background || "#111",
    gap: 12,
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#00000033",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraWrap: {
    overflow: "hidden",
    borderRadius: 16,
    height: 340,
    backgroundColor: "#000",
  },
  focusBox: {
    position: "absolute",
    left: "10%",
    right: "10%",
    top: "20%",
    bottom: "20%",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
  },
  cameraHint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
  },
  // --- (legacy modal styles kept for consistency if needed) ---
  modalCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: Color.Background?.Background || "#fff",
    gap: 12,
  },
  modalInputWrap: {
    backgroundColor: "#f1f3f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "center",
  },
  modalInput: {
    height: 48,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancel: {
    backgroundColor: "#f1f3f4",
  },
  modalOK: {
    backgroundColor: "#2563eb",
  },
});

export default POSProductList;
