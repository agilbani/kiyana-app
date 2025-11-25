import {
    SelectInput,
    ThemedButton,
    ThemedHeader,
    ThemedInput,
} from "@/components";
import Color from "@/constants/Color";
import { accessoriesRequest, getAccessories } from "@/services/masterService";
import { getAccesoriceVariant } from "@/services/warehouseService";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StatusBar, View } from "react-native";

const AccessoriesRequest = () => {
    const [listMats, setListMats] = useState<any>([]);
    const [listVariant, setListVariant] = useState<any>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [selectedMaterialVariant, setSelectedMaterialVariant] =
        useState<any>(null);
    const [qty, setQty] = useState("");

    const getData = async () => {
        const [material, materialVariant] = await Promise.all([
            getAccessories(),
            getAccesoriceVariant(),
        ]);
        setListMats(material.data || []);
        setListVariant(materialVariant || []);
        //   console.log("cek material", material);
        //   console.log("cek materialVariant", materialVariant);
    };

    const filteredVariant = useMemo(() => {
        if (!selectedMaterial) return [];

        return listVariant
            .filter(
                (variant: any) => variant.accessories_id === selectedMaterial
            )
            .map((variant: any) => ({
                name: `${variant.accessory.name ?? ""} - ${
                    variant.color.name ?? ""
                }`,
                value: variant.id,
            }));
    }, [listVariant, selectedMaterial]);

    const submitRequest = async () => {
        const payload = {
            accessory_id: selectedMaterial,
            accessory_variant_id: selectedMaterialVariant,
            qty: Number(qty),
        };
        //   console.log("payload request", payload);
        LoadingManager.show();
        const res = await accessoriesRequest(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.Base.White,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <ThemedHeader title="Permintaan Aksesoris" />
            <View style={{ flex: 1, padding: 16, gap: 8 }}>
                <SelectInput
                    label="Pilih Bahan"
                    value={selectedMaterial}
                    options={listMats.map((c: any) => ({
                        label: c?.name,
                        value: c?.id,
                    }))}
                    placeholder="Pilih Bahan"
                    onSelect={(val) => setSelectedMaterial(val)}
                />
                <SelectInput
                    label="Pilih Variant Bahan"
                    value={selectedMaterialVariant}
                    options={filteredVariant.map((c: any) => ({
                        label: c?.name,
                        value: c?.value,
                    }))}
                    disabled={selectedMaterial === null}
                    placeholder="Pilih variant bahan"
                    onSelect={(val) => setSelectedMaterialVariant(val)}
                />
                <ThemedInput
                    label="Masukkan Jumlah"
                    placeholder="Masukkan jumlah yang diminta"
                    value={qty}
                    onChangeText={(text: any) => setQty(text)}
                    style={{ height: 50 }}
                />
                <ThemedButton
                    textColor={Color.Base.White}
                    title="Kirim Permintaan"
                    style={{ marginTop: 15 }}
                    onPress={submitRequest}
                />
            </View>
        </View>
    );
};

export default AccessoriesRequest;
