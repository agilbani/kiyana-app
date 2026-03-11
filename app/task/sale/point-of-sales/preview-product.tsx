import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { deleteCustomer } from "@/services/customerService";
import {
    addCustomer,
    getCustomer,
    updateCustomer,
} from "@/services/warehouseService"; // ✅ import api
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
    displayName: string;
    price: number;
    qty: number;
};

export type Customer = {
    id: string;
    name: string;
    contact?: string;
    address?: string;
};

// -----------------------------
// Helper
// -----------------------------
const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);

// -----------------------------
// Main Component
// -----------------------------
const POSPreviewScreen: React.FC = () => {
    const router = useRouter();
    const { state } = useLocalSearchParams<{ state?: string }>();

    const parsedState = useMemo<IncomingState | null>(() => {
        if (!state) return null;
        try {
            const raw = Array.isArray(state) ? state[0] : state;
            return JSON.parse(decodeURIComponent(String(raw)));
        } catch {
            return null;
        }
    }, [state]);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        null,
    );

    const items: CartItem[] = useMemo(() => {
        if (Array.isArray(parsedState)) return parsedState;
        return Array.isArray(parsedState?.items) ? parsedState.items : [];
    }, [parsedState]);

    useEffect(() => {
        setCartItems(items || []);
    }, [items]);

    useEffect(() => {
        if (
            parsedState &&
            !Array.isArray(parsedState) &&
            parsedState.customer?.id
        ) {
            setSelectedCustomerId(parsedState.customer.id);
        }
    }, [parsedState]);

    // -----------------------------
    // Fetch Customers
    // -----------------------------
    const fetchCustomers = useCallback(async () => {
        try {
            const res = await getCustomer();
            setCustomers(res || []);
        } catch (err) {
            // console.log("❌ Gagal load customers:", err);
            Alert.alert("Error", "Gagal memuat daftar pelanggan");
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const selectedCustomer = useMemo(
        () => customers.find((c) => c.id === selectedCustomerId) || null,
        [customers, selectedCustomerId],
    );

    // -----------------------------
    // Discounts & Totals
    // -----------------------------
    const [discountType, setDiscountType] = useState<"percent" | "nominal">(
        "nominal",
    );
    const [discountValue, setDiscountValue] = useState<string>("0");

    const subtotal = useMemo(
        () => cartItems.reduce((s, it) => s + it.qty * it.price, 0),
        [cartItems],
    );

    const numericDiscount = useMemo(
        () => parseInt((discountValue || "0").replace(/[^0-9]/g, ""), 10) || 0,
        [discountValue],
    );

    const discountAmount = useMemo(
        () =>
            discountType === "percent"
                ? Math.round(
                      (Math.max(0, Math.min(100, numericDiscount)) / 100) *
                          subtotal,
                  )
                : Math.min(numericDiscount, subtotal),
        [discountType, numericDiscount, subtotal],
    );

    const total = Math.max(0, subtotal - discountAmount);

    const updateQty = useCallback(
        (productId: string, variantId: string, delta: number) => {
            setCartItems((prev) => {
                const idx = prev.findIndex(
                    (it) =>
                        it.productId === productId &&
                        it.variantId === variantId,
                );
                if (idx === -1) return prev;
                const next = [...prev];
                const curr = next[idx];
                const newQty = (curr.qty || 0) + delta;
                if (newQty <= 0) next.splice(idx, 1);
                else next[idx] = { ...curr, qty: newQty };
                return next;
            });
        },
        [],
    );

    // -----------------------------
    // Confirm Checkout
    // -----------------------------
    const handleConfirm = useCallback(() => {
        if (!selectedCustomerId) {
            Alert.alert(
                "Pilih Pelanggan",
                "Silakan pilih pelanggan terlebih dahulu sebelum lanjut.",
            );
            return;
        }

        const payload = {
            items: cartItems,
            subtotal,
            discountType,
            discountValue: numericDiscount,
            discountAmount,
            total,
            customer: selectedCustomer,
        };

        const stateParam = encodeURIComponent(JSON.stringify(payload));
        router.push({
            pathname: ROUTES.TASK_POINT_OF_SALE_PAYMENT_PRODUCT_V2,
            params: { state: stateParam },
        });
    }, [
        cartItems,
        subtotal,
        discountType,
        numericDiscount,
        discountAmount,
        total,
        selectedCustomerId,
        selectedCustomer,
        router,
    ]);

    return (
        <ThemedContainer>
            <ThemedHeader title="Preview Pesanan" />

            {/* Customer Section */}
            <View style={checkoutStyles.section}>
                <ThemedText type="SemiBold" size="md">
                    Pelanggan
                </ThemedText>
                <CustomerPicker
                    customers={customers}
                    selectedId={selectedCustomerId}
                    onSelect={setSelectedCustomerId}
                    onAdd={async (c) => {
                        const res = await addCustomer(c);
                        if (res.success) {
                            Alert.alert(
                                "Sukses",
                                "Pelanggan berhasil ditambahkan",
                            );
                            fetchCustomers();
                        } else {
                            Alert.alert("Gagal", res.message);
                        }
                    }}
                    onRefresh={fetchCustomers}
                />
            </View>

            {/* Items */}
            <View style={checkoutStyles.section}>
                <ThemedText
                    type="SemiBold"
                    size="md"
                    style={{ marginBottom: 6 }}
                >
                    Daftar Item
                </ThemedText>
                {items.length === 0 ? (
                    <ThemedText
                        size="sm"
                        color={Color.Text?.Secondary || "#6b7280"}
                    >
                        Belum ada item.
                    </ThemedText>
                ) : (
                    <FlatList
                        data={cartItems}
                        keyExtractor={(it) => `${it.productId}-${it.variantId}`}
                        renderItem={({ item }) => (
                            <View style={checkoutStyles.itemRow}>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    <ThemedText type="SemiBold" size="md">
                                        {item.displayName}
                                    </ThemedText>
                                    <ThemedText
                                        size="sm"
                                        color={
                                            Color.Text?.Secondary || "#6b7280"
                                        }
                                    >
                                        {formatCurrency(item.price)} ×{" "}
                                        {item.qty}
                                    </ThemedText>
                                </View>

                                {/* Stepper */}
                                <View style={checkoutStyles.stepper}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            updateQty(
                                                item.productId,
                                                item.variantId,
                                                -1,
                                            )
                                        }
                                        style={[
                                            checkoutStyles.stepperBtn,
                                            checkoutStyles.stepperMinus,
                                        ]}
                                    >
                                        <ThemedText type="SemiBold" size="md">
                                            −
                                        </ThemedText>
                                    </TouchableOpacity>

                                    <View style={checkoutStyles.stepperQty}>
                                        <ThemedText type="SemiBold">
                                            {item.qty}
                                        </ThemedText>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() =>
                                            updateQty(
                                                item.productId,
                                                item.variantId,
                                                +1,
                                            )
                                        }
                                        style={[
                                            checkoutStyles.stepperBtn,
                                            checkoutStyles.stepperPlus,
                                        ]}
                                    >
                                        <ThemedText type="SemiBold" size="md">
                                            +
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>

                                <ThemedText
                                    type="SemiBold"
                                    size="md"
                                    style={{
                                        minWidth: 100,
                                        textAlign: "right",
                                    }}
                                >
                                    {formatCurrency(item.price * item.qty)}
                                </ThemedText>
                            </View>
                        )}
                    />
                )}
            </View>

            {/* Discount & Totals */}
            <View style={checkoutStyles.totalsCard}>
                <View style={checkoutStyles.totalRow}>
                    <ThemedText>Subtotal</ThemedText>
                    <ThemedText>{formatCurrency(subtotal)}</ThemedText>
                </View>
                <View style={checkoutStyles.totalRow}>
                    <ThemedText>Diskon</ThemedText>
                    <ThemedText>-{formatCurrency(discountAmount)}</ThemedText>
                </View>
                <View style={checkoutStyles.totalDivider} />
                <View style={checkoutStyles.totalRow}>
                    <ThemedText type="SemiBold">Total</ThemedText>
                    <ThemedText type="SemiBold">
                        {formatCurrency(total)}
                    </ThemedText>
                </View>

                <TouchableOpacity
                    style={checkoutStyles.payBtn}
                    onPress={handleConfirm}
                >
                    <ThemedText type="SemiBold" color="#fff">
                        Proses Pembayaran
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedContainer>
    );
};

export default POSPreviewScreen;

const CustomerPicker: React.FC<{
    customers: Customer[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: (c: Omit<Customer, "id">) => void;
    onRefresh?: () => void;
}> = ({ customers, selectedId, onSelect, onAdd, onRefresh }) => {
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editData, setEditData] = useState<Customer | null>(null);

    const selected = customers.find((c) => c.id === selectedId) || null;

    const handleDelete = async (id: string) => {
        Alert.alert(
            "Hapus Pelanggan",
            "Apakah Anda yakin ingin menghapus pelanggan ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res: any = await deleteCustomer(id);
                            if (res.success) {
                                Alert.alert("Sukses", "Pelanggan dihapus");
                                onRefresh?.();
                            } else {
                                Alert.alert("Gagal", res.message);
                            }
                        } catch (e) {
                            Alert.alert("Error", "Gagal menghapus pelanggan");
                        }
                    },
                },
            ],
        );
    };

    return (
        <View>
            <TouchableOpacity
                style={checkoutStyles.customerBtn}
                onPress={() => setOpen(true)}
            >
                <View style={{ flex: 1 }}>
                    <ThemedText>
                        {selected ? selected.name : "Pilih pelanggan"}
                    </ThemedText>
                    {!!selected?.contact && (
                        <ThemedText
                            size="xs"
                            color={Color.Text?.Secondary || "#6b7280"}
                        >
                            {selected.contact}
                        </ThemedText>
                    )}
                </View>
                <ThemedText>▾</ThemedText>
            </TouchableOpacity>

            {/* Modal daftar pelanggan */}
            <Modal
                visible={open}
                transparent
                animationType="slide"
                onRequestClose={() => setOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={checkoutStyles.backdrop}
                >
                    <View style={checkoutStyles.sheet}>
                        <View style={checkoutStyles.sheetHeader}>
                            <ThemedText type="SemiBold">
                                Pilih Pelanggan
                            </ThemedText>
                            <TouchableOpacity
                                onPress={() => setOpen(false)}
                                style={checkoutStyles.iconGhost}
                            >
                                <ThemedText>✕</ThemedText>
                            </TouchableOpacity>
                        </View>

                        {customers.length === 0 ? (
                            <ThemedText
                                size="sm"
                                color={Color.Text?.Secondary || "#6b7280"}
                            >
                                Belum ada pelanggan.
                            </ThemedText>
                        ) : (
                            <FlatList
                                data={customers}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View
                                        style={[
                                            checkoutStyles.customerRow,
                                            { alignItems: "center" },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                onSelect(item.id);
                                                setOpen(false);
                                            }}
                                        >
                                            <ThemedText type="SemiBold">
                                                {item.name}
                                            </ThemedText>
                                            {!!item.contact && (
                                                <ThemedText
                                                    size="xs"
                                                    color={
                                                        Color.Text?.Secondary ||
                                                        "#6b7280"
                                                    }
                                                >
                                                    {item.contact}
                                                </ThemedText>
                                            )}
                                            {!!item.address && (
                                                <ThemedText
                                                    size="xs"
                                                    color={
                                                        Color.Text?.Secondary ||
                                                        "#6b7280"
                                                    }
                                                >
                                                    {item.address}
                                                </ThemedText>
                                            )}
                                        </TouchableOpacity>

                                        {/* Tombol Edit */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setEditData(item);
                                                setOpen(false);
                                                setTimeout(
                                                    () => setAddOpen(true),
                                                    400,
                                                );
                                            }}
                                            style={[
                                                checkoutStyles.iconGhost,
                                                { marginHorizontal: 4 },
                                            ]}
                                        >
                                            <ThemedText>✎</ThemedText>
                                        </TouchableOpacity>

                                        {/* Tombol Hapus */}
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleDelete(item.id)
                                            }
                                            style={checkoutStyles.iconGhost}
                                        >
                                            <ThemedText>🗑️</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={checkoutStyles.sep} />
                                )}
                            />
                        )}

                        <TouchableOpacity
                            style={checkoutStyles.addBtn}
                            onPress={() => {
                                setEditData(null);
                                setOpen(false);
                                setTimeout(() => setAddOpen(true), 400);
                            }}
                        >
                            <ThemedText type="SemiBold" color="#fff">
                                + Tambah Pelanggan
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modal tambah/edit pelanggan */}
            <AddCustomerModal
                visible={addOpen}
                editData={editData}
                onClose={() => setAddOpen(false)}
                onSave={async (payload) => {
                    if (editData) {
                        // mode edit
                        const res = await updateCustomer(editData.id, payload);
                        if (res.success) {
                            Alert.alert("Sukses", "Data pelanggan diperbarui");
                            onRefresh?.();
                        } else {
                            Alert.alert("Gagal", res.message);
                        }
                    } else {
                        // mode tambah
                        const res = await addCustomer(payload);
                        if (res.success) {
                            Alert.alert(
                                "Sukses",
                                "Pelanggan berhasil ditambahkan",
                            );
                            onRefresh?.();
                        } else {
                            Alert.alert("Gagal", res.message);
                        }
                    }
                    setAddOpen(false);
                }}
            />
        </View>
    );
};

const AddCustomerModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onSave: (c: Omit<Customer, "id">) => void;
    editData?: Customer | null;
}> = ({ visible, onClose, onSave, editData }) => {
    const [name, setName] = useState(editData?.name || "");
    const [contact, setContact] = useState(editData?.contact || "");
    const [address, setAddress] = useState(editData?.address || "");

    useEffect(() => {
        if (editData) {
            setName(editData.name || "");
            setContact(editData.contact || "");
            setAddress(editData.address || "");
        } else {
            setName("");
            setContact("");
            setAddress("");
        }
    }, [editData]);

    const canSave = name.trim().length > 0;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={checkoutStyles.backdrop}
            >
                <View style={checkoutStyles.formCard}>
                    <View style={checkoutStyles.sheetHeader}>
                        <ThemedText type="SemiBold">
                            {editData ? "Edit Pelanggan" : "Tambah Pelanggan"}
                        </ThemedText>
                        <TouchableOpacity
                            onPress={onClose}
                            style={checkoutStyles.iconGhost}
                        >
                            <ThemedText>✕</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={{ gap: 8 }}>
                        <TextInput
                            style={checkoutStyles.input}
                            placeholder="Nama"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={checkoutStyles.input}
                            placeholder="Kontak (opsional)"
                            value={contact}
                            onChangeText={setContact}
                        />
                        <TextInput
                            style={[checkoutStyles.input, { height: 80 }]}
                            placeholder="Alamat (opsional)"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        disabled={!canSave}
                        style={[
                            checkoutStyles.addBtn,
                            !canSave && { opacity: 0.6 },
                        ]}
                        onPress={() =>
                            onSave({
                                name: name.trim(),
                                contact: contact.trim(),
                                address: address.trim(),
                            })
                        }
                    >
                        <ThemedText type="SemiBold" color="#fff">
                            {editData ? "Perbarui" : "Simpan"}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// -----------------------------
// Styles (Preview)
// -----------------------------
const checkoutStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.Background?.Background || "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
    },
    section: { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
    sep: { height: StyleSheet.hairlineWidth, backgroundColor: "#e5e7eb" },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    segment: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderRadius: 12,
        padding: 4,
    },
    numberInputWrap: {
        width: 120,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    numberInput: { height: 44 },
    totalsCard: {
        margin: 16,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "white",
        gap: 10,
    },
    totalRow: { flexDirection: "row", justifyContent: "space-between" },
    totalDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#374151",
    },
    payBtn: {
        marginTop: 8,
        height: 46,
        borderRadius: 12,
        backgroundColor: "#2563eb",
        alignItems: "center",
        justifyContent: "center",
    },
    customerBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        maxHeight: "80%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 16,
        gap: 10,
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    customerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 6,
        paddingVertical: 10,
    },
    addBtn: {
        marginTop: 10,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#2563eb",
        alignItems: "center",
        justifyContent: "center",
    },
    iconGhost: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    formCard: {
        margin: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        padding: 16,
        gap: 10,
    },
    input: {
        height: 44,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
    },
    //stepper
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginRight: 8,
    },
    stepperBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        alignItems: "center",
        justifyContent: "center",
    },
    stepperMinus: {
        backgroundColor: "#fee2e2", // merah muda lembut
    },
    stepperPlus: {
        backgroundColor: "#dcfce7", // hijau muda lembut
    },
    stepperQty: {
        minWidth: 36,
        height: 32,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        alignItems: "center",
        justifyContent: "center",
    },
});

const segStyles = StyleSheet.create({
    btn: {
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    active: { backgroundColor: "#2563eb" },
});
