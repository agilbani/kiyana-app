import {
    CustomDropdown,
    ThemedButton,
    ThemedDatePicker,
    ThemedHeader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import {
    getCuttingEmployee,
    getListProduct,
    getProductProduction,
} from "@/services/masterService";
import { createProductionPlan } from "@/services/productionService";
import { getProductVariant } from "@/services/productVariantService";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CreatePlanProduction = () => {
    const insets = useSafeAreaInsets();
    const [productItem, setProductItem] = useState<any>([
        {
            id: Date.now(),
            material_details: [],
            product_variant_id: "",
        },
    ]);
    const [listEmployee, setListEmployee] = useState<any>([]);
    const [listProduct, setListProduct] = useState<any>([]);
    const [listVariant, setListVariant] = useState<any>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [material, setMaterial] = useState("");
    const [loading, setLoading] = useState(false);
    const [detailMaterial, setDetailMaterial] = useState<any>([]);

    const addMoreProductItem = () => {
        setProductItem((prev: any[]) => {
            // ambil data material_details dari item terakhir, kalau belum ada, buat array kosong
            const lastMaterialDetails =
                prev.length > 0 ? prev[prev.length - 1].material_details : [];

            return [
                ...prev,
                {
                    id: Date.now(),
                    product_variant_id: "",
                    // salin struktur material_details agar tidak mereferensi langsung array sebelumnya
                    material_details: lastMaterialDetails.map((m: any) => ({
                        ...m,
                    })),
                },
            ];
        });
    };

    const onDelete = (id: any) => {
        if (productItem.length > 1) {
            setProductItem((prev: any) =>
                prev.filter((row: any) => row.id !== id)
            );
        }
    };

    const updateRow = (id: any, field: any, value: any) => {
        setProductItem((prev: any) =>
            prev.map((row: any) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const updateMaterialQty = (parentId: any, index: number, value: string) => {
        setProductItem((prev: any[]) =>
            prev.map((item) => {
                if (item.id !== parentId) return item; // kalau bukan parent yang diubah, biarkan
                return {
                    ...item,
                    material_details: item.material_details.map(
                        (mat: any, i: number) =>
                            i === index ? { ...mat, qty: value } : mat
                    ),
                };
            })
        );
    };

    const getList = async () => {
        LoadingManager.show();
        const getEmployee = getCuttingEmployee();
        const getProduct = getListProduct();
        const getListVariant = getProductVariant();
        const [cuttingEmployee, product, listProductVariant] =
            await Promise.all([getEmployee, getProduct, getListVariant]);
        LoadingManager.hide();
        //   console.log("res product", product);
        //   console.log("res cuttingEmployee", cuttingEmployee);
        //   console.log("res listProductVariant", listProductVariant);
        if (cuttingEmployee.success) {
            let arr = [];
            for (let i = 0; i < cuttingEmployee.data.length; i++) {
                arr.push({
                    name: `${cuttingEmployee.data[i].first_name} ${cuttingEmployee.data[i].last_name}`,
                    value: cuttingEmployee.data[i].id,
                });
            }
            setListEmployee(arr);
        }

        if (product.success) {
            let arr = [];
            for (let i = 0; i < product.data.length; i++) {
                arr.push({
                    name: `${product.data[i].name}`,
                    value: product.data[i].slug,
                    data: product.data[i],
                });
            }
            setListProduct(arr);
        }

        if (listProductVariant.success) {
            setListVariant(listProductVariant?.data);
        }
    };

    const filteredVariant = useMemo(() => {
        if (!selectedProduct) return [];

        return listVariant
            .filter((variant: any) => variant.product.slug === selectedProduct)
            .map((variant: any) => ({
                name: `${variant.sku ?? ""} - ${variant.color ?? ""}`,
                value: variant.id,
            }));
    }, [listVariant, selectedProduct]);
    //  console.log("cek filteredVariant", filteredVariant);

    const getMaterialNeeded = async () => {
        LoadingManager.show();
        const res = await getProductProduction(selectedProduct);
        LoadingManager.hide();
        //   console.log("res material", res);
        if (res.success) {
            const materials = res.data.product_materials.map((item: any) => ({
                qty: item.usage_quantity,
                material_name: item.material.name,
                unit: item.material.unit.name,
            }));
            const getNameMats = res.data.product_materials
                .map((item: any) => item.material.name)
                .join(", ");
            setDetailMaterial(materials);
            setMaterial(getNameMats);
        }
    };

    const onSubmit = async () => {
        let itemProduction = [];
        for (let i = 0; i < productItem.length; i++) {
            itemProduction.push({
                product_variant_id: productItem[i].product_variant_id,
                material_details: productItem[i].material_details,
            });
        }
        let getProductId = listProduct.filter((item: any) => {
            return item.value === selectedProduct;
        });

        const payload = {
            date: moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            cutting_by: selectedEmployee,
            product_id: getProductId[0].data.id,
            items: itemProduction,
        };
        setLoading(true);
        const res = await createProductionPlan(payload);
        setLoading(false);
        if (res.success) {
            ShowToastMessage("Rencana Produksi Berhasil Dibuat");
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
    };

    const resetProductItem = () => {
        const arr = [
            {
                id: Date.now(),
                material_details: [],
                product_variant_id: "",
            },
        ];
        setProductItem(arr);
    };

    useEffect(() => {
        if (detailMaterial.length > 0) {
            let prodItem = [...productItem];

            prodItem[0].material_details = detailMaterial;
            setProductItem(prodItem);
        }
    }, [detailMaterial]);

    useEffect(() => {
        if (selectedProduct) {
            setTimeout(() => {
                getMaterialNeeded();
            }, 800);
        }
    }, [selectedProduct]);

    useEffect(() => {
        getList();
    }, []);
    //  console.log("create plan productItem", productItem);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.Base.White,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <StatusBar
                backgroundColor={Color.Base.White}
                barStyle="dark-content"
            />
            <ThemedHeader title="Buat Rencana Produksi" />
            <View style={styles.page}>
                <ScrollView
                    contentContainerStyle={styles.containerStyle}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    <ThemedDatePicker
                        labelSize="md"
                        label="Tanggal Pengerjaan"
                        onChange={(date: any) => setSelectedDate(date)}
                        minimumDate={new Date()}
                    />
                    <CustomDropdown
                        items={listEmployee}
                        onSelectItem={(item: any) =>
                            setSelectedEmployee(item.value)
                        }
                        value={selectedEmployee}
                        label="Nama Karyawan"
                        maxHeight={200}
                    />
                    <CustomDropdown
                        items={listProduct}
                        onSelectItem={(item: any) => {
                            setSelectedProduct(item.value);
                            resetProductItem();
                        }}
                        value={selectedProduct}
                        label="Produk"
                        maxHeight={200}
                    />
                    <View style={{ gap: 4 }}>
                        <ThemedText size="md">Jenis Bahan</ThemedText>
                        <TextInput
                            placeholder=""
                            style={styles.txtInput}
                            editable={false}
                            value={material}
                        />
                    </View>
                    {productItem.map((v: any, index: any) => (
                        <View key={`${index}`}>
                            <ThemedText>Produksi Item</ThemedText>
                            <View style={styles.cardMaterial}>
                                <View style={{ gap: 6 }}>
                                    <ThemedText>Product Variant</ThemedText>
                                    <TouchableOpacity
                                        style={{
                                            width: "7%",
                                            alignItems: "flex-end",
                                            position: "absolute",
                                            top: 0,
                                            left: "92%",
                                        }}
                                        onPress={() => onDelete(v.id)}
                                    >
                                        <Feather
                                            name="trash-2"
                                            color={"red"}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                    <CustomDropdown
                                        items={filteredVariant}
                                        value={v.product_variant_id}
                                        onSelectItem={(item: any) => {
                                            updateRow(
                                                v.id,
                                                "product_variant_id",
                                                item.value
                                            );
                                        }}
                                        placeholderText="Pilih salah satu opsi"
                                        containerStyle={{
                                            borderRadius: 12,
                                            width: "100%",
                                        }}
                                        maxHeight={200}
                                        widthdropdown="100%"
                                    />
                                </View>
                                {v.material_details.map(
                                    (mats: any, index: any) => (
                                        <View
                                            key={`${index}`}
                                            style={{ marginTop: 10 }}
                                        >
                                            <ThemedText>
                                                Kebutuhan Material
                                            </ThemedText>
                                            <View style={styles.viewNeed}>
                                                <View>
                                                    <ThemedText>
                                                        Nama Material
                                                    </ThemedText>
                                                    <View
                                                        style={
                                                            styles.viewMaterial
                                                        }
                                                    >
                                                        <ThemedText>
                                                            {mats.material_name}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                                <View>
                                                    <ThemedText>
                                                        Jumlah
                                                    </ThemedText>
                                                    <TextInput
                                                        value={mats.qty}
                                                        style={
                                                            styles.txtInputQty
                                                        }
                                                        placeholder="Masukkan Jumlah Kuantitas"
                                                        onChangeText={(
                                                            text: string
                                                        ) =>
                                                            updateMaterialQty(
                                                                v.id,
                                                                index,
                                                                text
                                                            )
                                                        }
                                                    />
                                                </View>
                                                <View>
                                                    <ThemedText>
                                                        Satuan
                                                    </ThemedText>
                                                    <View
                                                        style={
                                                            styles.viewSatuan
                                                        }
                                                    >
                                                        <ThemedText>
                                                            {mats.unit}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                )}
                            </View>
                        </View>
                    ))}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            alignSelf: "center",
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
                            onPress={addMoreProductItem}
                        >
                            <ThemedText
                                type="SemiBold"
                                size="sm"
                                color={Color.Base.Black}
                                numberOfLines={1}
                            >
                                Tambahkan ke produksi item
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={[styles.footer, { bottom: 0 }]}>
                    <ThemedButton
                        loading={loading}
                        disabled={loading}
                        title="Buat"
                        onPress={onSubmit}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    viewNeed: {
        gap: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        padding: 16,
        marginTop: 10,
    },
    cardMaterial: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        padding: 16,
        marginTop: 10,
    },
    viewSatuan: {
        backgroundColor: Color.Gray[300],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
    },
    txtInputQty: {
        marginTop: 10,
        backgroundColor: Color.Base.White,
        borderRadius: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: Color.Gray[200],
    },
    viewMaterial: {
        backgroundColor: Color.Gray[300],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
    },
    footer: {
        position: "absolute",
        backgroundColor: Color.Base.White,
        width: "100%",
        padding: 16,
    },
    viewInputUnit: {
        width: "15%",
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: Color.Gray[300],
        borderRadius: 12,
        position: "absolute",
        top: 6,
        left: "77%",
    },
    viewInputQty: {
        width: "15%",
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: Color.Gray[300],
        borderRadius: 12,
        position: "absolute",
        top: 6,
        left: "61%",
    },
    viewDropdown: {
        width: "60%",
        paddingVertical: 8,
        paddingRight: 4,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    parentViewProduct: {
        width: "100%",
        //   position: "relative",
    },
    txtInput: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        color: Color.Gray[400],
        borderColor: Color.Gray[400],
        backgroundColor: Color.Gray[200],
    },
    containerStyle: {
        paddingBottom: 100,
        paddingTop: 24,
        paddingHorizontal: 16,
        gap: 15,
    },
    page: {
        flex: 1,
    },
});

export default CreatePlanProduction;
