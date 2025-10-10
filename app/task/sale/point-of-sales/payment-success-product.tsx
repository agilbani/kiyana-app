// app/(pos)/PaymentSuccessScreen.tsx
import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import { ROUTES } from "@/constants/Routes";
import {
    printBluetooth
} from "@/customLibrary/ThermalPrinter";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

// ===== Types (samakan dengan PaymentScreen) =====
type CartItem = {
  productId: string;
  variantId: string;
  displayName: string;
  price: number;
  qty: number;
};

type Customer = {
  id: string;
  name: string;
  contact?: string;
  address?: string;
};

type PaymentPayload = {
  items: CartItem[];
  subtotal: number;
  discountType: "percent" | "nominal";
  discountValue: number;
  discountAmount: number;
  total: number;
  customer?: Customer | null;
};

type PaymentResult = {
  invoiceNo: string;           // ddMMyyyyHHmmss (03102025151116)
  createdAt: string;           // ISO string
  method: "cash" | "transfer";
  accountName?: string | null; // contoh: "Cash", "Bank BCA QRIS"
  paid: number;                // nominal dibayar
  change: number;              // change jika cash (>=0), 0 untuk transfer
  payload: PaymentPayload;
};

// ===== Helpers =====
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const generateInvoiceNumber = (d = new Date()) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  const HH = String(d.getHours()).padStart(2, "0");
  const MM = String(d.getMinutes()).padStart(2, "0");
  const SS = String(d.getSeconds()).padStart(2, "0");
  return `${dd}${mm}${yyyy}${HH}${MM}${SS}`;
};

const formatDateTimeID = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const sanitizePhoneForWA = (raw?: string) => {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
};

// ESC/POS text builder (sesuai mini-markup library yang kamu pakai)
const buildEscPosPayload = (tx: PaymentResult) => {
  const {
    invoiceNo,
    createdAt,
    method,
    accountName,
    payload: { items, subtotal, discountAmount, total, customer },
    paid,
    change,
  } = tx;

  const nowLine = formatDateTimeID(createdAt);
  const divider = "--------------------------------";
  const lineItems = items
    .map((it) => {
      const qtyPrice = `${it.qty} x ${formatCurrency(it.price)}`;
      const lineTotal = formatCurrency(it.qty * it.price).replace("Rp", "Rp");
      // Baris 1: Nama item
      // Baris 2: qty x price .... line total
      const rightPad = 28 - qtyPrice.length;
      const spaces = rightPad > 0 ? " ".repeat(rightPad) : " ";
      return (
        `${it.displayName}\n` +
        `${qtyPrice}${spaces}${lineTotal}\n`
      );
    })
    .join("");

  const isCash = method === "cash";

  return (
    `[C]<b>WARUNG INDO</b>\n` +
    `[C]Jl. Melati No.1, Sleman\n` +
    `[C]0812-0000-0000\n` +
    `[L]\n` +
    `[L]No. Faktur: ${invoiceNo}\n` +
    `[L]Tanggal  : ${nowLine}\n` +
    `[L]Metode   : ${method === "cash" ? "Tunai" : "Transfer"}\n` +
    (accountName ? `[L]Akun     : ${accountName}\n` : "") +
    (customer?.name ? `[L]Pelanggan: ${customer.name}\n` : "") +
    (customer?.contact ? `[L]Kontak   : ${customer.contact}\n` : "") +
    `${divider}\n` +
    `${lineItems}` +
    `${divider}\n` +
    `[L]Subtotal               ${formatCurrency(subtotal)}\n` +
    `[L]Diskon                 ${formatCurrency(discountAmount)}\n` +
    `[L]<b>Total</b>                 <b>${formatCurrency(total)}</b>\n` +
    (isCash ? `[L]Dibayar                ${formatCurrency(paid)}\n` : "") +
    (isCash && change >= 0
      ? `[L]Kembalian              ${formatCurrency(change)}\n`
      : "") +
    `[L]\n` +
    `[C]Terima kasih & sampai jumpa!\n`
  );
};

// WhatsApp plain text builder
const buildWhatsAppMessage = (tx: PaymentResult) => {
  const {
    invoiceNo,
    createdAt,
    method,
    accountName,
    payload: { items, subtotal, discountAmount, total, customer },
    paid,
    change,
  } = tx;

  const lines: string[] = [];
  lines.push("WARUNG INDO");
  lines.push("Jl. Melati No.1, Sleman");
  lines.push("Telp: 0812-0000-0000");
  lines.push("");
  lines.push(`Nomor Faktur: ${invoiceNo}`);
  lines.push(`Tanggal     : ${formatDateTimeID(createdAt)}`);
  lines.push(
    `Metode      : ${method === "cash" ? "Tunai" : "Transfer"}${
      accountName ? ` (${accountName})` : ""
    }`
  );
  if (customer?.name) lines.push(`Pelanggan   : ${customer.name}`);
  if (customer?.contact) lines.push(`Kontak      : ${customer.contact}`);
  lines.push("--------------------------------");

  items.forEach((it) => {
    lines.push(`${it.displayName}`);
    lines.push(
      `${it.qty} x ${formatCurrency(it.price)}  =  ${formatCurrency(
        it.qty * it.price
      )}`
    );
  });

  lines.push("--------------------------------");
  lines.push(`Subtotal    : ${formatCurrency(subtotal)}`);
  lines.push(`Diskon      : ${formatCurrency(discountAmount)}`);
  lines.push(`Total       : ${formatCurrency(total)}`);
  if (method === "cash") {
    lines.push(`Dibayar     : ${formatCurrency(paid)}`);
    if (change >= 0) lines.push(`Kembalian   : ${formatCurrency(change)}`);
  }
  lines.push("");
  lines.push("Terima kasih & sampai jumpa!");

  return lines.join("\n");
};

const PaymentSuccessScreen: React.FC = () => {
  const router = useRouter();
  const { state } = useLocalSearchParams<{ state?: string }>();

  // Parse state -> PaymentResult
  const tx: PaymentResult | null = useMemo(() => {
    try {
      if (!state) return null;
      return JSON.parse(decodeURIComponent(String(state)));
    } catch {
      return null;
    }
  }, [state]);

  if (!tx) {
    return (
      <ThemedContainer>
        <ThemedHeader title="Detail Pembayaran" />
        <View style={{ padding: 16 }}>
          <ThemedText type="SemiBold" color="#ef4444" style={{ marginBottom: 8 }}>
            Data pembayaran tidak ditemukan.
          </ThemedText>
          <Pressable onPress={() => router.replace(ROUTES.TASK_POINT_OF_SALE_V2)}>
            <ThemedText type="SemiBold" color="#2563eb">
              Kembali ke POS
            </ThemedText>
          </Pressable>
        </View>
      </ThemedContainer>
    );
  }

  const { payload } = tx;
  const isCash = tx.method === "cash";
  const customerPhone = sanitizePhoneForWA(payload.customer?.contact || "");

  const doPrint = async () => {
    try {
      const payloadStr: any = buildEscPosPayload(tx);
      await printBluetooth({ payload: payloadStr });
      Alert.alert("Sukses", "Struk berhasil dicetak.");
    } catch (e: any) {
      Alert.alert("Gagal Cetak", e?.message || String(e));
    }
  };

  const sendWhatsApp = async () => {
    try {
      const text = buildWhatsAppMessage(tx);
      const phone = customerPhone;
      const encoded = encodeURIComponent(text);

      // Prioritas ke app WhatsApp (schema)
      if (phone) {
        const deepLink = `whatsapp://send?phone=${phone}&text=${encoded}`;
        const can = await Linking.canOpenURL(deepLink);
        if (can) return Linking.openURL(deepLink);
        // Fallback ke wa.me
        return Linking.openURL(`https://wa.me/${phone}?text=${encoded}`);
      } else {
        const deepLink = `whatsapp://send?text=${encoded}`;
        const can = await Linking.canOpenURL(deepLink);
        if (can) return Linking.openURL(deepLink);
        return Linking.openURL(`https://wa.me/?text=${encoded}`);
      }
    } catch (e: any) {
      Alert.alert("Gagal", e?.message || String(e));
    }
  };

  return (
    <ThemedContainer>
      <ThemedHeader title="Pembayaran Berhasil" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {/* Success Banner */}
        <View style={styles.successCard}>
          <ThemedText type="SemiBold" size="lg" color="#065f46">
            ✅ Transaksi Sukses
          </ThemedText>
          <ThemedText size="sm" color="#065f46">
            {formatDateTimeID(tx.createdAt)}
          </ThemedText>
        </View>

        {/* Info Utama */}
        <View style={styles.sectionCard}>
          <Row label="Nomor Faktur" value={tx.invoiceNo} mono />
          <Row label="Metode" value={tx.method === "cash" ? "Tunai" : "Transfer"} />
          {tx.accountName ? <Row label="Akun" value={tx.accountName} /> : null}
          {payload.customer?.name ? (
            <Row label="Pelanggan" value={payload.customer.name} />
          ) : null}
          {payload.customer?.contact ? (
            <Row label="Kontak" value={payload.customer.contact} />
          ) : null}
        </View>

        {/* Ringkasan Nominal */}
        <View style={styles.sectionCard}>
          <Row label="Subtotal" value={formatCurrency(payload.subtotal)} />
          <Row label="Diskon" value={formatCurrency(payload.discountAmount)} />
          <Row
            label="Total Dibayar"
            value={formatCurrency(payload.total)}
            bold
          />
          {isCash ? (
            <>
              <Row label="Dibayar" value={formatCurrency(tx.paid)} />
              {tx.change >= 0 ? (
                <Row label="Kembalian" value={formatCurrency(tx.change)} bold />
              ) : (
                <Row
                  label="Kurang"
                  value={formatCurrency(Math.abs(tx.change))}
                  bold
                />
              )}
            </>
          ) : null}
        </View>

        {/* Aksi */}
        <View style={{ gap: 10 }}>
          <Pressable style={styles.btnPrimary} onPress={() => doPrint()}>
            <ThemedText type="SemiBold" color="#fff" style={{ textAlign: "center" }}>
              Cetak Struk
            </ThemedText>
          </Pressable>

          <Pressable style={styles.btnWhatsApp} onPress={sendWhatsApp}>
            <ThemedText type="SemiBold" color="#fff" style={{ textAlign: "center" }}>
              Kirim Struk ke WhatsApp
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.btnGhost}
            onPress={() => {
              router.replace(ROUTES.TASK_POINT_OF_SALE_V2);
            }}
          >
            <ThemedText type="SemiBold" style={{ textAlign: "center" }}>
              Selesai
            </ThemedText>
          </Pressable>
        </View>

        {/* Catatan Item (opsional ditampilkan) */}
        <View style={styles.sectionCard}>
          <ThemedText type="SemiBold" size="md" style={{ marginBottom: 8 }}>
            Rincian Item
          </ThemedText>
          {payload.items.map((it, idx) => (
            <View
              key={`${it.productId}-${it.variantId}-${idx}`}
              style={styles.itemRow}
            >
              <ThemedText style={{ flex: 1 }}>{it.displayName}</ThemedText>
              <ThemedText>
                {it.qty} x {formatCurrency(it.price)}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedContainer>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}> = ({ label, value, mono, bold }) => (
  <View style={styles.row}>
    <ThemedText color="#6b7280">{label}</ThemedText>
    <ThemedText
      type={bold ? "SemiBold" : undefined}
      style={mono ? { fontFamily: "Menlo" } : undefined}
    >
      {value}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  successCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    gap: 4,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  btnPrimary: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  btnWhatsApp: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhost: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PaymentSuccessScreen;
