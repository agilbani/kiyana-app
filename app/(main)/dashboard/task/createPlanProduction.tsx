import {
    CustomDropdown,
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedHeader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { getCuttingEmployee, getListProduct } from "@/services/masterService";
import { createProductionPlan } from "@/services/productionService";
import { getProductVariant } from "@/services/productVariantService";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
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
            sku: "",
            qty: 0,
            unit: "Pcs",
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

    const addMoreProductItem = () => {
        setProductItem([
            ...productItem,
            { id: Date.now(), sku: "", qty: 0, unit: "Pcs" },
        ]);
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

    const getList = async () => {
        const getEmployee = getCuttingEmployee();
        const getProduct = getListProduct();
        const getListVariant = getProductVariant();
        const [cuttingEmployee, product, listProductVariant] =
            await Promise.all([getEmployee, getProduct, getListVariant]);

        console.log("res product", product);
        console.log("res cuttingEmployee", cuttingEmployee);
        console.log("res listProductVariant", listProductVariant);
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
                    value: product.data[i].id,
                    data: product.data[i],
                });
            }
            setListProduct(arr);
        }

        if (listProductVariant.success) {
            let arr = [];
            for (let i = 0; i < listProductVariant?.data?.length; i++) {
                arr.push({
                    name: `${listProductVariant?.data[i].sku} - ${listProductVariant.data[i].color}`,
                    value: listProductVariant.data[i].id,
                });
            }
            setListVariant(arr);
        }
    };

    const onSubmit = async () => {
        let itemProduction = [];
        for (let i = 0; i < productItem.length; i++) {
            itemProduction.push({
                product_variant_id: productItem[i].sku,
                qty: productItem[i].qty,
                unit: productItem[i].unit,
            });
        }
        const payload = {
            date: moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            cutting_by: selectedEmployee,
            product_id: selectedProduct,
            items: itemProduction,
        };
        console.log("cek payload", payload);
        setLoading(true);
        const res = await createProductionPlan(payload);
        setLoading(false);
        if (res.success) {
            ShowToastMessage("Rencana Produksi Berhasil Dibuat");
            router.back();
        }
    };

    useEffect(() => {
        getList();
    }, []);
    console.log("create plan");
    return (
        <ThemedContainer>
            <StatusBar
                backgroundColor={Color.Base.White}
                barStyle="dark-content"
            />
            <ThemedHeader title="Buat Rencana Produksi" />
            <View style={styles.page}>
                <ScrollView
                    contentContainerStyle={styles.containerStyle}
                    showsVerticalScrollIndicator={false}
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
                            setMaterial(item.data.material.name);
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
                        <View key={`${index}`} style={styles.parentViewProduct}>
                            <View style={styles.viewDropdown}>
                                <CustomDropdown
                                    items={listVariant}
                                    value={v.sku}
                                    onSelectItem={(item: any) =>
                                        updateRow(v.id, "sku", item.value)
                                    }
                                    placeholderText="Pilih salah satu opsi"
                                    containerStyle={{
                                        borderRadius: 12,
                                        width: "100%",
                                        marginTop: -1,
                                    }}
                                    maxHeight={200}
                                    widthdropdown="100%"
                                />
                            </View>
                            <View style={styles.viewInputQty}>
                                <View
                                    style={{
                                        width: "100%",
                                        borderRadius: 12,
                                        marginTop: 3,
                                    }}
                                >
                                    <TextInput
                                        placeholder="0"
                                        style={{
                                            height: 45,
                                            backgroundColor: Color.Base.White,
                                        }}
                                        value={v.qty}
                                        onChangeText={(text) => {
                                            updateRow(
                                                v.id,
                                                "qty",
                                                Number(text)
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.viewInputUnit}>
                                <View
                                    style={{
                                        width: "100%",
                                        borderRadius: 12,
                                        marginTop: 3,
                                    }}
                                >
                                    <TextInput
                                        placeholder="Pcs"
                                        style={{
                                            height: 45,
                                            backgroundColor: Color.Base.White,
                                        }}
                                        value={v.unit}
                                        onChangeText={(text) => {
                                            updateRow(v.id, "unit", text);
                                        }}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{
                                    width: "7%",
                                    alignItems: "flex-end",
                                    position: "absolute",
                                    top: 18,
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
                <View style={[styles.footer, { bottom: insets.bottom }]}>
                    <ThemedButton
                        loading={loading}
                        disabled={loading}
                        title="Buat"
                        onPress={onSubmit}
                    />
                </View>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
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
        flexDirection: "row",
        justifyContent: "space-between",
        position: "relative",
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
        paddingBottom: 50,
        paddingTop: 24,
        paddingHorizontal: 16,
        gap: 15,
    },
    page: {
        flex: 1,
    },
});

export default CreatePlanProduction;
