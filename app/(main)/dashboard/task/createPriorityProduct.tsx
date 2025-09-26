import {
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import CustomDropDown from "@/components/ui/CustomDropdown";
import Color from "@/constants/Color";
import { useApp } from "@/context/AppContext";
import { getCuttingEmployee } from "@/services/masterService";
import { createProductionPriority } from "@/services/productionService";
import {
    getDetailProductVariant,
    getProductionItems,
    getProductVariant,
} from "@/services/productVariantService";
import { usePositionBottom } from "@/utils/bottomPosition";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

interface Variant {
    id?: any;
}

const CreatePriorityProduct = () => {
    const { user } = useApp();
    const { bottom } = usePositionBottom();
    const [listEmployee, setListEmployee] = useState<any>([]);
    const [listVariant, setListVariant] = useState<any>([]);
    const [qty, setQty] = useState("");
    const [selectedVariant, setSelectedVariant] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [detailVariant, setDetailVariant] = useState<any>({});
    const [listProductItems, setListProductItems] = useState<any>([]);
    const [selectedProductItems, setSelectedProductItems] = useState("");
    const [loadingGetStatus, setLoadingGetStatus] = useState(false);
    const [totalMaterial, setTotalMaterial] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    console.log("cek detailVariant===", detailVariant);

    const getData = async () => {
        const employeeList = getCuttingEmployee();
        const variantList = getProductVariant();
        const [employee, variant] = await Promise.all([
            employeeList,
            variantList,
        ]);
        console.log("cek employee", employee);
        console.log("cek variant", variant);
        if (employee.success) {
            let arr = [];
            for (let i = 0; i < employee.data.length; i++) {
                arr.push({
                    name: `${employee.data[i].first_name} ${employee.data[i].last_name}`,
                    value: employee.data[i].id,
                });
            }
            setListEmployee(arr);
        }

        if (variant.success) {
            let arr = [];
            for (let i = 0; i < variant.data.length; i++) {
                arr.push({
                    name: `${variant.data[i].sku} - ${variant.data[i].product.name} | ${variant.data[i].color} | ${variant.data[i].size.name}`,
                    value: variant.data[i].id,
                });
            }
            setListVariant(arr);
        }
    };

    const checkDetailVariant = async (id: string) => {
        setLoadingGetStatus(true);
        const res = await getDetailProductVariant(id);
        console.log("detail variant", res);
        setLoadingGetStatus(false);
        if (res.success) {
            if (res.data.production_status === "Sedang ada produksi") {
                setDetailVariant(res.data);
            } else {
                setDetailVariant({});
                const qtyMaterial =
                    Number(res?.data?.product?.material_usages) * Number(qty);
                setTotalMaterial(`${qtyMaterial}`);
            }
        }
    };

    const getListProductionItems = async () => {
        const params = {
            product_variant_id: detailVariant?.id,
            total: qty,
        };
        const res = await getProductionItems(params);
        setLoadingGetStatus(false);
        console.log("cek prod items", res);
        if (res.success && res.data.length > 0) {
            let arr = [];
            for (let i = 0; i < res.data.length; i++) {
                arr.push({
                    name: `${res.data[i].production_plan.code}`,
                    value: res.data[i].id,
                });
            }
            setListProductItems(arr);
        }
    };

    const createPlan = async () => {
        setIsSubmit(true);
        let payload = {
            product_variant_id: selectedVariant,
            created_by: user?.id,
            total: Number(qty),
            deadline: moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            production_status:
                Object.keys(detailVariant).length > 0
                    ? "Sedang ada produksi"
                    : "Tidak ada produksi yang relevan",
        };

        if (Object.keys(detailVariant).length > 0) {
            payload.production_item_id = selectedProductItems;
        } else {
            payload.material_usages = Number(totalMaterial);
            payload.cutting_by = selectedEmployee;
        }
        console.log("cek payload create", payload);
        const res = await createProductionPriority(payload);
        setIsSubmit(false);
        if (res.success) {
            ShowToastMessage("Produk prioritas berhasil dibuat");
            router.back();
        }
    };

    const validate = () => {
        let disable = false;
        const obj = {
            selectedDate,
            selectedVariant,
            qty,
        };
        const dataEmpty = Object.keys(obj).filter(
            (data) => obj[data] == "" || obj[data] == undefined
        );
        if (dataEmpty.length > 0) {
            disable = true;
        } else {
            disable = false;
        }
        if (Object.keys(detailVariant).length > 0) {
            if (selectedProductItems == "") {
                disable = true;
            }
        } else {
            if (totalMaterial == "") {
                disable = true;
            } else if (selectedEmployee == "") {
                disable = true;
            } else {
                disable = false;
            }
        }
        return disable;
    };

    useEffect(() => {
        if (Object.keys(detailVariant).length > 0 && qty !== "") {
            getListProductionItems();
        }
    }, [qty, detailVariant]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <ThemedContainer>
            <View style={styles.page}>
                <ThemedHeader title="Buat Produk Prioritas" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: 24,
                        paddingHorizontal: 16,
                        paddingBottom: 100,
                        gap: 15,
                    }}
                >
                    <CustomDropDown
                        label="Produk Variant"
                        items={listVariant}
                        onSelectItem={(item: any) => {
                            setSelectedVariant(item.value);
                            checkDetailVariant(item.value);
                        }}
                        value={selectedVariant}
                        maxHeight={200}
                    />
                    <View style={{ gap: 4 }}>
                        <ThemedText size="md">Dibuat Oleh</ThemedText>
                        <TextInput
                            placeholder=""
                            style={styles.txtInput}
                            editable={false}
                            value={`${user?.first_name} ${user?.last_name}`}
                        />
                    </View>
                    <View style={{ gap: 4 }}>
                        <ThemedText size="md">Jumlah</ThemedText>
                        <TextInput
                            placeholder="Masukkan jumlah"
                            style={[
                                styles.txtInput,
                                { backgroundColor: Color.Base.White },
                            ]}
                            value={qty}
                            onChangeText={(text: string) => setQty(text)}
                            keyboardType="number-pad"
                        />
                    </View>
                    <ThemedDatePicker
                        label="Deadline"
                        minimumDate={new Date()}
                        onChange={(date: any) => setSelectedDate(date)}
                    />
                    <View style={{ gap: 4 }}>
                        <ThemedText size="md">Status Produksi</ThemedText>
                        {loadingGetStatus ? (
                            <ThemedLoader />
                        ) : (
                            <ThemedText size="md" type="Medium">
                                {Object.keys(detailVariant).length > 0
                                    ? "Sedang ada produksi"
                                    : "Tidak ada produksi yang relevan"}
                            </ThemedText>
                        )}
                    </View>
                    {Object.keys(detailVariant).length > 0 ? (
                        <CustomDropDown
                            label="Data Produksi"
                            items={listProductItems}
                            onSelectItem={(item: any) =>
                                setSelectedProductItems(item.value)
                            }
                            value={selectedProductItems}
                        />
                    ) : (
                        <>
                            <View style={{ gap: 4 }}>
                                <ThemedText size="md">Jumlah Bahan</ThemedText>
                                <TextInput
                                    placeholder="Masukkan jumlah"
                                    style={[
                                        styles.txtInput,
                                        { backgroundColor: Color.Base.White },
                                    ]}
                                    value={totalMaterial}
                                    onChangeText={(text: string) =>
                                        setTotalMaterial(text)
                                    }
                                    keyboardType="number-pad"
                                />
                            </View>
                            <CustomDropDown
                                label="Nama Karyawan (Tukang Potong)"
                                items={listEmployee}
                                onSelectItem={(val: any) =>
                                    setSelectedEmployee(val.value)
                                }
                                value={selectedEmployee}
                            />
                        </>
                    )}
                </ScrollView>
                <View style={[styles.footer, { bottom }]}>
                    <ThemedButton
                        title="Buat"
                        textColor={Color.Base.White}
                        onPress={createPlan}
                        loading={isSubmit}
                        disabled={validate()}
                    />
                </View>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        width: "100%",
        backgroundColor: Color.Base.White,
        paddingHorizontal: 24,
        paddingVertical: 12,
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
    page: {
        flex: 1,
        backgroundColor: Color.Base.White,
    },
});

export default CreatePriorityProduct;
