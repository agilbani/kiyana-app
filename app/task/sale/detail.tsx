import {
    ThemedBadge,
    ThemedContainer,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import { getDetailSelling } from "@/services/sellingService";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { calculateTax } from "@/utils/helpher";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const DetailSelling = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    console.log("id selling", id);

    const [info, setInfo] = useState<any>([]);
    const [image, setImage] = useState("");
    const [customerInfo, setCustomerInfo] = useState<any>([]);
    const [customerShipping, setCustomerShipping] = useState<any>([]);
    const [listItems, setListItems] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const getDetail = async () => {
        setLoading(true);
        const res = await getDetailSelling(id);
        setLoading(false);
        console.log("res detail selling", res);
        if (res.success) {
            const data = res.data;
            const arr = [
                {
                    label: "Status",
                    value: data?.status,
                },
                {
                    label: "Nomor Pembelian",
                    value: data?.sales_number,
                },
                {
                    label: "Faktur Pembelian",
                    value: data?.invoice_number,
                },
                {
                    label: "Tanggal Penjualan",
                    value: moment(
                        data?.selling_at,
                        "YYYY-MM-DD HH:mm:ss"
                    ).format("DD MMMM YYYY"),
                },
                {
                    label: "Dibuat Oleh",
                    value: data?.created_by.name,
                },
                {
                    label: "Metode Pembayaran",
                    value: data?.payment_method,
                },
                {
                    label: "Status Pembayaran",
                    value: data?.payment_status,
                },
                {
                    label: "Diskon",
                    value: formatRupiahDisplay(data.discount),
                },
                {
                    label: "Pajak",
                    value: formatRupiahDisplay(
                        calculateTax(data.sub_total, data.tax).taxAmount
                    ),
                },
                {
                    label: "Jumlah Pembayaran",
                    value: formatRupiahDisplay(data.cash),
                },
                {
                    label: "Jumlah Kembalian",
                    value: formatRupiahDisplay(data.change),
                },
            ];
            const customer = [
                {
                    label: "Nama Pembeli",
                    value: data.customer.name,
                },
                {
                    label: "Kontak Pembeli",
                    value: data.customer.contact,
                },
                {
                    label: "Alamat Pembeli",
                    value: data.customer.address,
                },
            ];
            const shipping = [
                {
                    label: "Janji Pengiriman",
                    value: data.shipment.name,
                },
                {
                    label: "Alamat Pengiriman",
                    value: data.shipment.address,
                },
            ];
            setImage(`${PATH}${data.file}`);
            setInfo(arr);
            setCustomerShipping(shipping);
            setCustomerInfo(customer);
            setListItems(data.items);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <ThemedContainer>
            <View style={styles.page}>
                <ThemedHeader title="Lihat Penjualan" />
                {loading ? (
                    <ThemedLoader />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingVertical: 24,
                            paddingHorizontal: 16,
                        }}
                    >
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText size="lg" type="SemiBold">
                                Lihat Penjualan
                            </ThemedText>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <View style={styles.viewBtnCancel}>
                                    <ThemedText
                                        size="xs"
                                        color={Color.Base.White}
                                    >
                                        Batalkan Penjualan
                                    </ThemedText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={{ uri: image }}
                            style={{
                                width: "100%",
                                height: 200,
                                borderRadius: 6,
                                resizeMode: "cover",
                                marginTop: 15,
                            }}
                        />
                        <View style={styles.card}>
                            {info.map((v: any, index: any) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={`${index}`}
                                    style={styles.rowBetween}
                                >
                                    <ThemedText size="md" type="Medium">
                                        {v.label}
                                    </ThemedText>
                                    {v.label === "Status" ? (
                                        <ThemedBadge
                                            text="Selesai"
                                            textColor={Color.Green[500]}
                                            backgroundColor={Color.Green[50]}
                                        />
                                    ) : (
                                        <ThemedText size="md">
                                            {v.value}
                                        </ThemedText>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.card}>
                            {customerInfo.map((v: any, index: any) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={`${index}`}
                                    style={styles.rowBetween}
                                >
                                    <ThemedText size="md" type="Medium">
                                        {v.label}
                                    </ThemedText>
                                    <ThemedText size="md">{v.value}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.card}>
                            {customerShipping.map((v: any, index: any) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    key={`${index}`}
                                    style={styles.rowBetween}
                                >
                                    <ThemedText size="md" type="Medium">
                                        {v.label}
                                    </ThemedText>
                                    <ThemedText size="md">{v.value}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.card}>
                            <ThemedText size="md" type="Medium">
                                Item Pembelian
                            </ThemedText>
                            {listItems.map((v: any, index: any) => (
                                <View
                                    style={[
                                        styles.viewItems,
                                        {
                                            borderBottomWidth:
                                                listItems.length === index + 1
                                                    ? 0
                                                    : 1,
                                        },
                                    ]}
                                >
                                    <View style={{ width: "60%", gap: 4 }}>
                                        <ThemedText size="sm" type="Medium">
                                            Item
                                        </ThemedText>
                                        <ThemedText size="sm" type="Medium">
                                            {v.item.sku} - {v.size} -{" "}
                                            {v.item.color}
                                        </ThemedText>
                                    </View>
                                    <View
                                        style={{
                                            width: "40%",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <View style={{ width: "50%" }}>
                                            <ThemedText size="sm" type="Medium">
                                                Harga
                                            </ThemedText>
                                            <ThemedText size="sm">
                                                {formatRupiahDisplay(v.price)}
                                            </ThemedText>
                                        </View>
                                        <View style={{ width: "50%" }}>
                                            <ThemedText size="sm" type="Medium">
                                                Kuantitas
                                            </ThemedText>
                                            <ThemedText size="sm">
                                                {v.qty}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    viewItems: {
        flexDirection: "row",
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Color.Gray[200],
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    card: {
        width: "100%",
        borderRadius: 8,
        backgroundColor: Color.Base.White,
        padding: 16,
        elevation: 2,
        marginTop: 15,
        gap: 15,
    },
    viewBtnCancel: {
        borderRadius: 6,
        backgroundColor: Color.Red[600],
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    page: {
        flex: 1,
        backgroundColor: Color.Gray[100],
    },
});

export default DetailSelling;
