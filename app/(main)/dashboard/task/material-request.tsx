import {
    SelectInput,
    ThemedButton,
    ThemedHeader,
    ThemedInput,
} from "@/components";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { useApp } from "@/context/AppContext";
import { getMaterial, materialRequest } from "@/services/masterService";
import { getMaterialVariant } from "@/services/warehouseService";
import { hasMenuAccess } from "@/utils/helpher";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, StatusBar, View } from "react-native";

const MaterialRequest = () => {
    const { user } = useApp();
    const [listMats, setListMats] = useState<any>([]);
    const [listVariant, setListVariant] = useState<any>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [selectedMaterialVariant, setSelectedMaterialVariant] =
        useState<any>(null);
    const [qty, setQty] = useState("");

    const getData = async () => {
        LoadingManager.show();
        const [material, materialVariant] = await Promise.all([
            getMaterial(),
            getMaterialVariant(),
        ]);
        LoadingManager.hide();
        setListMats(material.data || []);
        setListVariant(materialVariant || []);
        //   console.log("cek material", material);
        //   console.log("cek materialVariant", materialVariant);
    };

    const filteredVariant = useMemo(() => {
        if (!selectedMaterial) return [];

        return listVariant
            .filter((variant: any) => variant.material_id === selectedMaterial)
            .map((variant: any) => ({
                name: `${variant.material.name ?? ""} - ${
                    variant.color.name ?? ""
                }`,
                value: variant.id,
            }));
    }, [listVariant, selectedMaterial]);

    const submitRequest = async () => {
        const payload = {
            material_id: selectedMaterial,
            material_variant_id: selectedMaterialVariant,
            qty: Number(qty),
        };
        //   console.log("payload request", payload);
        LoadingManager.show();
        const res = await materialRequest(payload);
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

    useEffect(() => {
        if (
            !hasMenuAccess(user?.role?.name, MENU_PERMISSION.MATERIAL_REQUEST)
        ) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.Base.White,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <ThemedHeader title="Permintaan Bahan" />
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

export default MaterialRequest;
