import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type IncomingState =
  | CartItem[]
  | {
      items?: CartItem[];
      subtotal?: number;
      discountType?: "percent" | "nominal";
      discountValue?: number;
      customer?: Customer | null;
    };

export type CartItem = {
  productId: string;
  variantId: string;
  displayName: string; // "Nama Produk - Variant"
  price: number;
  qty: number;
};

export type Customer = {
  id: string;
  name: string;
  contact?: string;
  address?: string;
};

const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const MOCK_CUSTOMERS: Customer[] = [
  { id: "c0", name: "Walk-in / Umum" },
  { id: "c1", name: "Budi", contact: "+6287886831322", address: "Jl. Merdeka 10" },
  { id: "c2", name: "Sinta", contact: "+6287886831322", address: "Gg. Kenanga No. 2" },
];

const POSPreviewScreen: React.FC = () => {
  const router = useRouter();
  const { state } = useLocalSearchParams<{ state?: string }>();
  const parsedState = useMemo<IncomingState | null>(() => {
    if (!state) return null;

    try {
        // useLocalSearchParams bisa kasih string[]; ambil elemen pertama
        const raw = Array.isArray(state) ? state[0] : state;
        return JSON.parse(decodeURIComponent(String(raw)));
    } catch {
        return null;
    }
  }, [state]);

  const items: CartItem[] = useMemo(() => {
    if (Array.isArray(parsedState)) return parsedState;

    const arr = parsedState?.items;
    return Array.isArray(arr) ? arr : [];
  }, [parsedState]);

  useEffect(() => {
    if (parsedState && !Array.isArray(parsedState) && parsedState.customer?.id) {
        setSelectedCustomerId(parsedState.customer.id);
    }
  }, [parsedState]);

  const [discountType, setDiscountType] = useState<"percent" | "nominal">("nominal");
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id ?? null);
  const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedCustomerId) || null, [customers, selectedCustomerId]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.qty * it.price, 0), [items]);
  const numericDiscount = useMemo(() => parseInt((discountValue || "0").replace(/[^0-9]/g, ""), 10) || 0, [discountValue]);
  const discountAmount = useMemo(() => discountType === "percent" ? Math.round(Math.max(0, Math.min(100, numericDiscount)) / 100 * subtotal) : Math.min(numericDiscount, subtotal), [discountType, numericDiscount, subtotal]);
  const total = Math.max(0, subtotal - discountAmount);

  const handleConfirm = useCallback(() => {
    const payload = {
      items,
      subtotal,
      discountType,
      discountValue: numericDiscount,
      discountAmount,
      total,
      customer: selectedCustomer,
    };
    const stateParam = encodeURIComponent(JSON.stringify(payload));
    router.push({ pathname: ROUTES.TASK_POINT_OF_SALE_PAYMENT_PRODUCT_V2, params: { state: stateParam } });
  }, [items, subtotal, discountType, numericDiscount, discountAmount, total, selectedCustomer, router]);

  return (
    <ThemedContainer>
      {/* Header */}
      <ThemedHeader title="Preview Pesanan" />

      {/* Customer */}
      <View style={checkoutStyles.section}>
        <ThemedText type="SemiBold" size="md">Pelanggan</ThemedText>
        <CustomerPicker
          customers={customers}
          selectedId={selectedCustomerId}
          onSelect={setSelectedCustomerId}
          onAdd={(c) => setCustomers(prev => [{ id: `c-${Date.now()}`, ...c }, ...prev])}
        />
      </View>

      {/* Items */}
      <View style={checkoutStyles.section}>
        <ThemedText type="SemiBold" size="md" style={{ marginBottom: 6 }}>Daftar Item</ThemedText>
        {items.length === 0 ? (
          <ThemedText size="sm" color={Color.Text?.Secondary || "#6b7280"}>Belum ada item.</ThemedText>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => `${it.productId}-${it.variantId}`}
            renderItem={({ item }) => (
              <View style={checkoutStyles.itemRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="SemiBold" size="md">{item.displayName}</ThemedText>
                  <ThemedText size="sm" color={Color.Text?.Secondary || "#6b7280"}>
                    {formatCurrency(item.price)} × {item.qty}
                  </ThemedText>
                </View>
                <ThemedText type="SemiBold" size="md">{formatCurrency(item.price * item.qty)}</ThemedText>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={checkoutStyles.sep} />}
          />
        )}
      </View>

      {/* Discount */}
      <View style={checkoutStyles.section}>
        <ThemedText type="SemiBold" size="md" style={{ marginBottom: 6 }}>Diskon</ThemedText>
        <View style={checkoutStyles.rowBetween}>
          <View style={checkoutStyles.segment}>
            <SegmentButton label="Nominal" active={discountType === "nominal"} onPress={() => setDiscountType("nominal")} />
            <SegmentButton label="%" active={discountType === "percent"} onPress={() => setDiscountType("percent")} />
          </View>
          <View style={checkoutStyles.numberInputWrap}>
            <TextInput
              value={discountValue}
              onChangeText={setDiscountValue}
              keyboardType="numeric"
              placeholder={discountType === "percent" ? "0-100" : "0"}
              style={checkoutStyles.numberInput}
            />
          </View>
        </View>
        <ThemedText size="sm" color={Color.Text?.Secondary || "#6b7280"}>Potongan: {formatCurrency(discountAmount)}</ThemedText>
      </View>

      {/* Totals + Action */}
      <View style={checkoutStyles.totalsCard}>
        <View style={checkoutStyles.totalRow}><ThemedText>Subtotal</ThemedText><ThemedText>{formatCurrency(subtotal)}</ThemedText></View>
        <View style={checkoutStyles.totalRow}><ThemedText>Diskon</ThemedText><ThemedText>-{formatCurrency(discountAmount)}</ThemedText></View>
        <View style={checkoutStyles.totalDivider} />
        <View style={checkoutStyles.totalRow}><ThemedText type="SemiBold">Total</ThemedText><ThemedText type="SemiBold">{formatCurrency(total)}</ThemedText></View>
        <TouchableOpacity style={checkoutStyles.payBtn} onPress={handleConfirm}>
          <ThemedText type="SemiBold" color="#fff">Proses Pembayaran</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedContainer>
  );
};

// -----------------------------
// Customer Picker + Add Modal (shared)
// -----------------------------
const CustomerPicker: React.FC<{
  customers: Customer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (c: Omit<Customer, "id">) => void;
}> = ({ customers, selectedId, onSelect, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const selected = customers.find(c => c.id === selectedId) || null;

  return (
    <View>
      <TouchableOpacity style={checkoutStyles.customerBtn} onPress={() => setOpen(true)}>
        <View style={{ flex: 1 }}>
          <ThemedText>{selected ? selected.name : "Pilih pelanggan"}</ThemedText>
          {!!selected?.contact && (
            <ThemedText size="xs" color={Color.Text?.Secondary || "#6b7280"}>{selected.contact}</ThemedText>
          )}
        </View>
        <ThemedText>▾</ThemedText>
      </TouchableOpacity>

      {/* List Modal */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={checkoutStyles.backdrop}>
          <View style={checkoutStyles.sheet}>
            <View style={checkoutStyles.sheetHeader}>
              <ThemedText type="SemiBold">Pilih Pelanggan</ThemedText>
              <TouchableOpacity onPress={() => setOpen(false)} style={checkoutStyles.iconGhost}><ThemedText>✕</ThemedText></TouchableOpacity>
            </View>
            <FlatList
              data={customers}
              keyExtractor={(c) => c.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={checkoutStyles.customerRow} onPress={() => { onSelect(item.id); setOpen(false); }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="SemiBold">{item.name}</ThemedText>
                    {!!item.contact && <ThemedText size="xs" color={Color.Text?.Secondary || "#6b7280"}>{item.contact}</ThemedText>}
                    {!!item.address && <ThemedText size="xs" color={Color.Text?.Secondary || "#6b7280"}>{item.address}</ThemedText>}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={checkoutStyles.sep} />}
            />

            <TouchableOpacity 
                style={checkoutStyles.addBtn} 
                onPress={() => {
                    setOpen(false)
                    setTimeout(() => {
                        setAddOpen(true)
                    }, 400)
                }}
            >
              <ThemedText type="SemiBold" color="#fff">+ Tambah Pelanggan</ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Customer Modal */}
      <AddCustomerModal visible={addOpen} onClose={() => setAddOpen(false)} onSave={(payload) => { onAdd(payload); setAddOpen(false); }} />
    </View>
  );
};

const AddCustomerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSave: (c: Omit<Customer, "id">) => void;
}> = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const canSave = name.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={checkoutStyles.backdrop}>
        <View style={checkoutStyles.formCard}>
          <View style={checkoutStyles.sheetHeader}>
            <ThemedText type="SemiBold">Tambah Pelanggan</ThemedText>
            <TouchableOpacity onPress={onClose} style={checkoutStyles.iconGhost}><ThemedText>✕</ThemedText></TouchableOpacity>
          </View>
          <View style={{ gap: 8 }}>
            <TextInput style={checkoutStyles.input} placeholder="Nama" value={name} onChangeText={setName} />
            <TextInput style={checkoutStyles.input} placeholder="Kontak (opsional)" value={contact} onChangeText={setContact} />
            <TextInput style={[checkoutStyles.input, { height: 80 }]} placeholder="Alamat (opsional)" value={address} onChangeText={setAddress} multiline />
          </View>
          <TouchableOpacity disabled={!canSave} style={[checkoutStyles.addBtn, !canSave && { opacity: 0.6 }]} onPress={() => onSave({ name: name.trim(), contact: contact.trim(), address: address.trim() })}>
            <ThemedText type="SemiBold" color="#fff">Simpan</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const SegmentButton: React.FC<{ label: string; active?: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[segStyles.btn, active && segStyles.active]}>
    <ThemedText type="SemiBold" color={active ? "#fff" : undefined}>{label}</ThemedText>
  </TouchableOpacity>
);

// -----------------------------
// Styles (Preview)
// -----------------------------
const checkoutStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Color.Background?.Background || "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#e5e7eb" },
  itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  segment: { flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 12, padding: 4 },
  numberInputWrap: { width: 120, height: 44, borderRadius: 12, backgroundColor: "#f3f4f6", justifyContent: "center", paddingHorizontal: 10 },
  numberInput: { height: 44 },
  totalsCard: { margin: 16, padding: 14, borderRadius: 16, backgroundColor: "white", gap: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#374151" },
  payBtn: { marginTop: 8, height: 46, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center" },
  customerBtn: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, backgroundColor: "#f3f4f6" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: { maxHeight: "80%", backgroundColor: "#fff", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, gap: 10 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  customerRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, paddingVertical: 10 },
  addBtn: { marginTop: 10, height: 44, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center" },
  iconGhost: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  formCard: { margin: 16, borderRadius: 16, backgroundColor: "#fff", padding: 16, gap: 10 },
  input: { height: 44, borderRadius: 12, backgroundColor: "#f3f4f6", paddingHorizontal: 12 },
});

const segStyles = StyleSheet.create({
  btn: { height: 40, paddingHorizontal: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  active: { backgroundColor: "#2563eb" },
});

export default POSPreviewScreen;
