import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

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

type PaymentPayload = {
  items: CartItem[];
  subtotal: number;
  discountType: "percent" | "nominal";
  discountValue: number; // numeric value
  discountAmount: number;
  total: number;
  customer?: Customer | null;
};

type Account = { id: string; name: string; type: "cash" | "bank" };
const ACCOUNTS: Account[] = [
  { id: "a1", name: "Cash", type: "cash" },
  { id: "a2", name: "Bank BCA QRIS", type: "bank" },
  { id: "a3", name: "BANK Mandiri", type: "bank" },
];

const PaymentScreen: React.FC = () => {
  const router = useRouter();
  const { state } = useLocalSearchParams<{ state?: string }>();

  const payload: PaymentPayload | null = useMemo(() => {
    try { return state ? JSON.parse(decodeURIComponent(String(state))) : null; } catch { return null; }
  }, [state]);

  const subtotal = payload?.subtotal ?? 0;
  const discountAmount = payload?.discountAmount ?? 0;
  const total = payload?.total ?? 0;

  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const [selectedAccId, setSelectedAccId] = useState<string>(() => ACCOUNTS.find(a => a.type === "cash")?.id || ACCOUNTS[0].id);
  const [uangPas, setUangPas] = useState(false);
  const [payStr, setPayStr] = useState("");

  // Ensure account matches method
  useEffect(() => {
    const acc = ACCOUNTS.find(a => a.id === selectedAccId);
    if (!acc) return;
    if (method === "cash" && acc.type !== "cash") {
      const firstCash = ACCOUNTS.find(a => a.type === "cash");
      if (firstCash) setSelectedAccId(firstCash.id);
    }
    if (method === "transfer" && acc.type !== "bank") {
      const firstBank = ACCOUNTS.find(a => a.type === "bank");
      if (firstBank) setSelectedAccId(firstBank.id);
    }
  }, [method, selectedAccId]);

  // Uang pas → set pay = total
  useEffect(() => {
    if (uangPas) setPayStr(String(total));
  }, [uangPas, total]);

  const paid = useMemo(() => parseInt((payStr || "0").replace(/[^0-9]/g, ""), 10) || 0, [payStr]);
  const change = paid - total;

  const generateInvoiceNumber = (d = new Date()) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = String(d.getFullYear());
    const HH = String(d.getHours()).padStart(2, "0");
    const MM = String(d.getMinutes()).padStart(2, "0");
    const SS = String(d.getSeconds()).padStart(2, "0");
    return `${dd}${mm}${yyyy}${HH}${MM}${SS}`;
  };

  const onPay = useCallback(() => {
    if (!payload) {
        Alert.alert("Error", "Data order tidak ditemukan.");
        return;
    }

    // Validasi khusus cash
    if (method === "cash") {
        const nom = uangPas ? total : paid;
        if (nom < total) {
        Alert.alert(
            "Nominal kurang",
            `Total ${formatCurrency(total)}\nDibayar ${formatCurrency(nom)}`
        );
        return;
        }
    }

    // Hitung ringkasan transaksi
    const invoiceNo = generateInvoiceNumber(new Date());
    const accountName = ACCOUNTS.find(a => a.id === selectedAccId)?.name ?? null;
    const paidNominal = method === "cash" ? (uangPas ? total : paid) : total;
    const changeNominal = method === "cash" ? (paidNominal - total) : 0;

    // (Opsional) persist ke backend di sini...

    // Build payload untuk PaymentSuccessScreen
    const result = {
        invoiceNo,
        createdAt: new Date().toISOString(),
        method,                       // "cash" | "transfer"
        accountName,                  // "Cash" | "Bank BCA QRIS" | dst.
        paid: paidNominal,
        change: changeNominal,
        payload,                      // items, subtotal, diskon, total, customer
    };

    // Navigate ke halaman sukses + bawa state
    router.replace({
        pathname: ROUTES.TASK_POINT_OF_SALE_PAYMENT_SUCCESS_PRODUCT_V2,
        params: { state: encodeURIComponent(JSON.stringify(result)) },
    });
  }, [payload, method, uangPas, paid, total, selectedAccId, router]);

  const shownAccounts = ACCOUNTS.filter(a => method === "cash" ? a.type === "cash" : a.type === "bank");

  return (
    <ThemedContainer>
        {/* Header */}
        <ThemedHeader title="Pembayaran" />

        {/* Metode */}
        <View style={{flexDirection: 'row'}}>
            <View style={payStyles.section}>
                <ThemedText type="SemiBold" size="md" style={{ marginBottom: 6 }}>Metode Pembayaran</ThemedText>
                <View style={payStyles.segment}>
                <View style={{flexDirection: 'row'}}>
                    <SegmentButton label="Tunai" active={method === "cash"} onPress={() => setMethod("cash")} />
                    <SegmentButton label="Transfer" active={method === "transfer"} onPress={() => setMethod("transfer")} />
                </View>
                </View>
            </View>
        </View>

        {/* Akun Kas */}
        <View style={payStyles.section}>
            <ThemedText type="SemiBold" size="md" style={{ marginBottom: 6 }}>Akun {method === "cash" ? "Kas" : "Bank"}</ThemedText>
            <View style={payStyles.accountWrap}>
            {shownAccounts.map(acc => (
                <TouchableOpacity key={acc.id} onPress={() => setSelectedAccId(acc.id)} style={[payStyles.accountChip, selectedAccId === acc.id && payStyles.accountChipActive]}>
                <ThemedText type="SemiBold" color={selectedAccId === acc.id ? "#fff" : undefined}>{acc.name}</ThemedText>
                </TouchableOpacity>
            ))}
            </View>
        </View>

        {/* Cash input */}
        {method === "cash" && (
            <View style={payStyles.section}>
            <ThemedText type="SemiBold" size="md" style={{ marginBottom: 6 }}>Nominal Bayar</ThemedText>
            <View style={payStyles.rowBetween}>
                <View style={payStyles.inputWrap}>
                <TextInput
                    value={uangPas ? String(total) : payStr}
                    onChangeText={(t) => { setUangPas(false); setPayStr(t); }}
                    keyboardType="numeric"
                    placeholder="0"
                    style={payStyles.input}
                />
                </View>
                <TouchableOpacity onPress={() => setUangPas(v => !v)} style={[payStyles.pillBtn, uangPas && payStyles.pillBtnActive]}>
                <ThemedText type="SemiBold" color={uangPas ? "#fff" : undefined}>Uang Pas</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={payStyles.hintRow}>
                {change >= 0 ? (
                <ThemedText size="sm" color={"#059669"}>Kembalian: {formatCurrency(change)}</ThemedText>
                ) : (
                <ThemedText size="sm" color={"#ef4444"}>Kurang: {formatCurrency(Math.abs(change))}</ThemedText>
                )}
            </View>
            </View>
        )}

        {/* Totals + Action */}
        <View style={payStyles.totalsCard}>
            <View style={payStyles.totalRow}><ThemedText type="SemiBold">Subtotal</ThemedText><ThemedText type="SemiBold">{formatCurrency(subtotal)}</ThemedText></View>
            <View style={payStyles.totalRow}><ThemedText type="SemiBold">Diskon</ThemedText><ThemedText type="SemiBold">{formatCurrency(discountAmount)}</ThemedText></View>
            <View style={payStyles.totalRow}><ThemedText type="SemiBold">Total Dibayar</ThemedText><ThemedText type="SemiBold">{formatCurrency(total)}</ThemedText></View>
            <TouchableOpacity style={payStyles.payBtn} onPress={onPay}>
            <ThemedText type="SemiBold" color="#fff">Bayar</ThemedText>
            </TouchableOpacity>
        </View>
    </ThemedContainer>
  );
};

const SegmentButton: React.FC<{ label: string; active?: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[segStyles.btn, active && segStyles.active]}>
    <ThemedText type="SemiBold" color={active ? "#fff" : undefined}>{label}</ThemedText>
  </TouchableOpacity>
);

const payStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Color.Background?.Background || "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  segment: { backgroundColor: "#f3f4f6", borderRadius: 12, padding: 4 },
  accountWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  accountChip: { paddingHorizontal: 12, height: 40, borderRadius: 10, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  accountChipActive: { backgroundColor: "#2563eb" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  inputWrap: { flex: 1, height: 48, borderRadius: 12, backgroundColor: "#f3f4f6", justifyContent: "center", paddingHorizontal: 10 },
  input: { height: 48 },
  pillBtn: { height: 48, paddingHorizontal: 14, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#e5e7eb" },
  pillBtnActive: { backgroundColor: "#2563eb" },
  hintRow: { marginTop: 6 },
  totalsCard: { margin: 16, padding: 14, borderRadius: 16, backgroundColor: "white", gap: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  payBtn: { marginTop: 8, height: 46, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center" },
});

const segStyles = StyleSheet.create({
  btn: { height: 40, paddingHorizontal: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  active: { backgroundColor: "#2563eb" },
});

export default PaymentScreen;