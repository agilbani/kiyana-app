import {
    CustomDropdown,
    ThemedBottomSheet,
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { getCustomer } from "@/services/customerService";
import { getProductVariant } from "@/services/productVariantService";
import { addSelling } from "@/services/sellingService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import { formatRupiahDisplay, formatRupiahInput } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Feather, Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";

const paymentOptions = [
    {
        name: "Transfer",
        value: "Transfer",
    },
    {
        name: "Cash",
        value: "Cash",
    },
];

const statusPaymentOptions = [
    {
        name: "Belum Dibayar",
        value: "Belum Dibayar",
    },
    {
        name: "Sudah Dibayar",
        value: "Sudah Dibayar",
    },
    {
        name: "Pending Konfirmasi",
        value: "Pending Konfirmasi",
    },
];

type ImageData = {
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    name?: string;
};

interface stateType {
    name: string;
    value: string;
    price?: any;
    stock?: any;
}

type FormValues = {
    invoice_number: string;
    selling_at: string;
    discount: string;
    tax: string;
    payment_method: string;
    payment_status: string;
    cash: string;
    change: string;
    sub_total: string;
    total: string;
    customer_id: string;
    shipmentName: string;
    shipmentAddress: string;
    file: ImageData[];
};

const schema = yup.object().shape({
    invoice_number: yup.string().required("Faktur penjualan harus diisi"),
    selling_at: yup.string().required("Tanggal penjualan harus diisi"),
    discount: yup.string().required("Diskon harus diisi"),
    tax: yup.string().required("Pajak harus diisi"),
    payment_method: yup.string().required("Metode pembayaran harus diisi"),
    payment_status: yup.string().required("Status pembayaran harus diisi"),
    cash: yup.string().required("Jumlah pembayaran harus diisi"),
    change: yup.string().required("Jumlah kembalian harus diisi"),
    sub_total: yup.string().optional(),
    total: yup.string().optional(),
    customer_id: yup.string().required("Pelanggan harus diisi"),
    shipmentName: yup.string().required("Jasa pengiriman harus diisi"),
    shipmentAddress: yup.string().required("Alamat pengiriman harus diisi"),
    file: yup.array().of(
        yup.object().shape({
            uri: yup.string().required(),
            width: yup.number().optional(),
            height: yup.number().optional(),
            type: yup.string().optional(),
            fileName: yup.string().optional(),
        })
    ),
});

const POSMenuScreen = () => {
    const ref = useRef<ThemedBottomSheet | null>(null);
    const { bottom } = usePositionBottom();
    const cameraRef = useRef<CameraView>(null);
    const {
        control,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            file: [],
            invoice_number: "",
            selling_at: "",
            discount: "",
            tax: "12",
            payment_method: "",
            payment_status: "",
            cash: "",
            change: "",
            sub_total: "",
            total: "",
            customer_id: "",
            shipmentName: "",
            shipmentAddress: "",
        },
        // resolver: yupResolver(schema),
    });
    const formValues = watch();
    // console.log("cek formValues", formValues);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFetching, setLoadingFetching] = useState(true);
    const [subTotal, setSubTotal] = useState("0");
    const [total, setTotal] = useState("0");
    const [priceDisc, setPriceDisc] = useState("0");
    const [priceTax, setPriceTax] = useState("0");
    const [accessories, setAccessories] = useState<any>([
        {
            id: Date.now(),
            accessory_id: "",
            qty: 0,
            price: 0,
            stock: 0,
        },
    ]);
    // console.log("cek accessories", accessories);

    const [listProductVariant, setListProductVarian] = useState<stateType[]>(
        []
    );
    const [listCustomer, setListCustomer] = useState<stateType[]>([]);

    const addMoreAccessories = () => {
        setAccessories([
            ...accessories,
            { id: Date.now(), accessory_id: "", qty: 0, price: 0, stock: 0 },
        ]);
    };

    const onDelete = (id: any) => {
        setAccessories((prev: any) => prev.filter((row: any) => row.id !== id));
    };

    const updateRow = (id: any, fieldOrFields: any, value?: any) => {
        setAccessories((prev: any) =>
            prev.map((row: any) => {
                if (row.id !== id) return row;

                if (typeof fieldOrFields === "string") {
                    return { ...row, [fieldOrFields]: value };
                }

                if (typeof fieldOrFields === "object") {
                    return { ...row, ...fieldOrFields };
                }

                return row;
            })
        );
    };

    const getData = async () => {
        const getCustomerList = getCustomer();
        const getProductVariantList = getProductVariant();
        const [customer, product] = await Promise.all([
            getCustomerList,
            getProductVariantList,
        ]);
        setLoadingFetching(false);
        if (customer.success && customer.data.length > 0) {
            let data = [];
            for (let i = 0; i < customer.data.length; i++) {
                data.push({
                    name: customer.data[i].name,
                    value: customer.data[i].id,
                });
            }
            setListCustomer(data);
        }
        if (product.success && product.data.length > 0) {
            let data = [];
            for (let i = 0; i < product.data.length; i++) {
                data.push({
                    name: `${product.data[i].sku} - ${product.data[i].size.name} - ${product.data[i].color}`,
                    value: product.data[i].id,
                    price: product.data[i].price,
                    stock: product.data[i].stock,
                });
            }
            setListProductVarian(data);
        }
    };

    const calculateTotals = (formValues: any, accessories: any[]) => {
        const subTotal = accessories.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        const discountPercent = parseFloat(formValues.discount) || 0;
        const discountAmount = (discountPercent / 100) * subTotal;

        const taxPercent = parseFloat(formValues.tax) || 0;
        const taxableAmount = subTotal - discountAmount;
        const taxAmount = (taxPercent / 100) * taxableAmount;

        const total = taxableAmount + taxAmount;

        return {
            subTotal,
            total,
            discount: discountAmount,
            tax: taxAmount,
        };
    };

    const pickImage = async () => {
        if (formValues.file.length >= 1) {
            Alert.alert("Limit reached", "You can only upload up to 3 images.");
            return;
        }

        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                "Permission required",
                "Media library access is needed."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            const updated = [selectedAsset];
            setValue("file", updated, { shouldValidate: true });
        }
    };

    const removeAttachment = (index: number) => {
        const updated = formValues.file.filter((_, i) => i !== index);
        setValue("file", updated, { shouldValidate: true });
    };

    const renderImage = ({
        item,
        index,
    }: {
        item: ImageData;
        index: number;
    }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item.uri }}
                style={styles.image}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAttachment(index)}
            >
                <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    const onSubmit = async (data: any) => {
        //   console.log("data form", data);
        ref.current?.hide();

        setLoading(true);
        const res = await addSelling(data, accessories);
        //   console.log("res post selling", res);

        setLoading(false);
        if (res.success) {
            ShowToastMessage("Data penjualan berhasil ditambahkan");
            reset();
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
    };

    useEffect(() => {
        const { subTotal, total, discount, tax } = calculateTotals(
            formValues,
            accessories
        );

        setSubTotal(subTotal.toString());
        setTotal(total.toString());
        setPriceDisc(discount.toString());
        setPriceTax(tax.toString());
        setValue("sub_total", subTotal.toString());
        setValue("total", total.toString());
    }, [formValues.discount, formValues.tax, accessories]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Buat Penjualan" />
            {loadingFetching ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator color="red" size="large" />
                </View>
            ) : (
                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content}>
                            <ThemedText type="SemiBold" size="md">
                                Formulir Transaksi Kasir
                            </ThemedText>
                            <ThemedText
                                type="Regular"
                                size="sm"
                                color={Color.Gray[500]}
                            >
                                Lengkapi informasi berikut untuk mencatat
                                transaksi.
                            </ThemedText>
                            <ThemedGap height="lg" />
                            <ThemedText>Bukti Pembayaran</ThemedText>
                            <Controller
                                control={control}
                                name="file"
                                render={() => (
                                    <FlatList
                                        horizontal
                                        data={formValues.file}
                                        keyExtractor={(_, i) => `${i}`}
                                        renderItem={renderImage}
                                        ListFooterComponent={
                                            formValues.file.length < 1 ? (
                                                <TouchableOpacity
                                                    style={
                                                        styles.imageContainer
                                                    }
                                                    onPress={pickImage}
                                                >
                                                    <View
                                                        style={
                                                            styles.placeholder
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="add"
                                                            size={30}
                                                            color="#aaa"
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            ) : null
                                        }
                                    />
                                )}
                            />
                            {errors.file && (
                                <ThemedText color={Color.Red[500]}>
                                    {errors.file.message}
                                </ThemedText>
                            )}
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="invoice_number"
                                rules={{
                                    required: "Faktur Penjualan wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemedInput
                                        label="Faktur Penjualan"
                                        placeholder="Masukkan Faktur Penjualan"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.invoice_number?.message}
                                        editable={!loading}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="selling_at"
                                rules={{
                                    required: "Tanggal Penjualan wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemedDatePicker
                                        label="Tanggal Penjualan"
                                        onChange={onChange}
                                        error={errors.selling_at?.message}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="discount"
                                rules={{
                                    required: "Diskon wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemedInput
                                        label="Diskon"
                                        placeholder="Masukkan Diskon"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        editable
                                        error={errors?.discount?.message}
                                        value={value}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="tax"
                                rules={{
                                    required: "Pajak Penjualan wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemedInput
                                        label="Pajak"
                                        placeholder="Masukkan Pajak"
                                        onChangeText={onChange}
                                        value={value}
                                        onBlur={onBlur}
                                        error={errors?.tax?.message}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="payment_method"
                                rules={{
                                    required: "Metode Pembayaran wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <CustomDropdown
                                        label="Metode Pembayaran"
                                        items={paymentOptions}
                                        onSelectItem={(item) =>
                                            onChange(item.value)
                                        }
                                        value={value}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="payment_status"
                                rules={{
                                    required: "Status Pembayaran wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <CustomDropdown
                                        label="Status Pembayaran"
                                        items={statusPaymentOptions}
                                        onSelectItem={(item) =>
                                            onChange(item.value)
                                        }
                                        value={value}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="cash"
                                rules={{
                                    required: "Jumlah Pembayaran wajib diisi",
                                }}
                                render={({ field, fieldState }) => (
                                    <ThemedInput
                                        label="Jumlah Pembayaran"
                                        placeholder="Contoh: 100.000"
                                        keyboardType="numeric"
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={(text) =>
                                            field.onChange(
                                                formatRupiahInput(text)
                                            )
                                        }
                                        error={fieldState.error?.message}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="change"
                                rules={{
                                    required: "Jumlah kembalian wajib diisi",
                                }}
                                render={({ field, fieldState }) => (
                                    <ThemedInput
                                        label="Jumlah Kembalian"
                                        placeholder="Contoh: 100.000"
                                        keyboardType="numeric"
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={(text) =>
                                            field.onChange(
                                                formatRupiahInput(text)
                                            )
                                        }
                                        error={fieldState.error?.message}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="customer_id"
                                rules={{
                                    required: "Pelanggan wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <CustomDropdown
                                        label="Pelanggan"
                                        items={listCustomer}
                                        onSelectItem={(item) =>
                                            onChange(item.value)
                                        }
                                        value={value}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="shipmentName"
                                rules={{
                                    required: "Jasa Pengiriman wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemedInput
                                        label="Jasa Pengiriman"
                                        placeholder="Masukkan Jasa Pengiriman"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.shipmentName?.message}
                                        editable={!loading}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <Controller
                                control={control}
                                name="shipmentAddress"
                                rules={{
                                    required: "Alamat Pengiriman wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <ThemedInput
                                        label="Alamat Pengiriman"
                                        placeholder="Masukkan Alamat Pengiriman"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.shipmentAddress?.message}
                                        editable={!loading}
                                        style={{ height: 45 }}
                                    />
                                )}
                            />
                            <ThemedGap height="md" />
                            <View>
                                <ThemedText
                                    type="Regular"
                                    size="sm"
                                    color={Color.Gray[500]}
                                    numberOfLines={1}
                                >
                                    Aksesoris
                                </ThemedText>
                                {accessories.map((v: any, index: any) => (
                                    <View
                                        key={`${index}`}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: "100%",
                                                paddingVertical: 8,
                                                paddingRight: 8,
                                                flexDirection: "row",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <CustomDropdown
                                                items={listProductVariant}
                                                value={v.accessory_id}
                                                onSelectItem={(item: any) =>
                                                    updateRow(v.id, {
                                                        accessory_id:
                                                            item.value,
                                                        price: item.price,
                                                        stock: item.stock,
                                                    })
                                                }
                                                placeholderText="Pilih salah satu opsi"
                                                containerStyle={{
                                                    borderRadius: 4,
                                                    width: "100%",
                                                }}
                                                maxHeight={200}
                                                widthdropdown="100%"
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View
                                                style={{ gap: 4, width: "30%" }}
                                            >
                                                <ThemedText>Harga</ThemedText>
                                                <ThemedText>
                                                    {formatRupiahDisplay(
                                                        v.price
                                                    )}
                                                </ThemedText>
                                            </View>
                                            <View
                                                style={{ gap: 4, width: "30%" }}
                                            >
                                                <ThemedText>
                                                    Sisa Stok
                                                </ThemedText>
                                                <ThemedText>
                                                    {v.stock}
                                                </ThemedText>
                                            </View>
                                            <View
                                                style={{
                                                    width: "25%",
                                                    paddingHorizontal: 8,
                                                    flexDirection: "row",
                                                    alignItems: "flex-start",
                                                    marginTop: 18,
                                                    borderWidth: 1,
                                                    borderColor:
                                                        Color.Gray[300],
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        borderRadius: 4,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    <TextInput
                                                        placeholder="0"
                                                        style={{
                                                            height: 35,
                                                        }}
                                                        value={v.qty}
                                                        onChangeText={(
                                                            text
                                                        ) => {
                                                            updateRow(
                                                                v.id,
                                                                "qty",
                                                                Number(text)
                                                            );
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    width: "10%",
                                                    marginTop: 26,
                                                    alignItems: "flex-end",
                                                }}
                                                onPress={() => onDelete(v.id)}
                                            >
                                                <Feather
                                                    name="trash-2"
                                                    color={"red"}
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignSelf: "center",
                                    marginTop: 10,
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 8,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderWidth: 1,
                                        borderColor: Color.Gray[300],
                                    }}
                                    onPress={addMoreAccessories}
                                >
                                    <ThemedText
                                        type="SemiBold"
                                        size="sm"
                                        color={Color.Base.Black}
                                        numberOfLines={1}
                                    >
                                        Tambahkan ke
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    gap: 15,
                                    marginTop: 30,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <ThemedText>Sub Total</ThemedText>
                                    <ThemedText>
                                        {formatRupiahDisplay(subTotal)}
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <ThemedText>
                                        Diskon ({formValues.discount}%)
                                    </ThemedText>
                                    <ThemedText>
                                        - {formatRupiahDisplay(priceDisc)}
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <ThemedText>
                                        Pajak ({formValues.tax}%)
                                    </ThemedText>
                                    <ThemedText>
                                        + {formatRupiahDisplay(priceTax)}
                                    </ThemedText>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "100%",
                                    height: 1,
                                    marginVertical: 15,
                                    backgroundColor: Color.Gray[200],
                                }}
                            />
                            <View style={{ gap: 15 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <ThemedText
                                        size="lg"
                                        type="Medium"
                                        color={Color.Green[500]}
                                    >
                                        Total Harga
                                    </ThemedText>
                                    <ThemedText
                                        size="lg"
                                        type="Medium"
                                        color={Color.Green[500]}
                                    >
                                        {formatRupiahDisplay(total)}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}

            <View style={[styles.footer, { bottom: bottom }]}>
                <ThemedButton
                    title="Simpan Transaksi"
                    disabled={!isValid}
                    loading={loading}
                    onPress={() => ref.current?.show()}
                />
            </View>

            <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    style={GlobalStyles.center}
                >
                    Simpan Transaksi
                </ThemedText>
                <ThemedGap height="md" />
                <ThemedText
                    type="Medium"
                    size="md"
                    color={Color.Text.Secondary}
                >
                    Apakah kamu yakin ingin menyimpan transaksi ini? Pastikan
                    semua data telah sesuai.
                </ThemedText>
                <ThemedGap height="xl" />
                <ThemedButton
                    onPress={handleSubmit(onSubmit)}
                    title="Ya, Simpan Sekarang"
                />
                <ThemedGap height="md" />
                <ThemedButton
                    variant="outline"
                    title="Batal"
                    onPress={() => ref.current?.hide()}
                />
            </ThemedBottomSheet>
        </ThemedContainer>
    );
};

export default POSMenuScreen;

const styles = StyleSheet.create({
    placeholder: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    imageContainer: {
        marginRight: 10,
        marginTop: 15,
        position: "relative",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    container: {
        backgroundColor: Color.Purple[50],
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(12),
        ...GlobalStyles.flex,
    },
    content: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(24),
        borderRadius: Radius.xs,
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
