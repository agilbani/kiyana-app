import {
    CustomDropdown,
    ThemedBottomSheet,
    ThemedButton,
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import Radius from "@/constants/Radius";
import {
    getAccessories,
    getCategory,
    getColor,
    getMaterial,
} from "@/services/masterService";
import { addNewProduct, editNewProduct } from "@/services/productionService";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface stateType {
    name: string;
    value: string;
}

type ImageData = {
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    name?: string;
};

interface Product {
    id?: string;
}

const AddProductScreen = () => {
    const ref = useRef<ThemedBottomSheet | null>(null);
    const { data } = useLocalSearchParams();

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [detailProduct, setDetailProduct] = useState<Product>({});

    const [category, setCategory] = useState<stateType[]>([]);
    const [listColor, setListColor] = useState<stateType[]>([]);
    const [listMaterial, setListMaterial] = useState<stateType[]>([]);
    const [dataAccessories, setDataAccessories] = useState<stateType[]>([]);
    const [dataSize, setDataSize] = useState<stateType[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<any>(undefined);
    const [selectedSize, setSelectedSize] = useState<any>(undefined);
    const [selectedColor, setSelectedColor] = useState<any>(undefined);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(undefined);
    const [attachments, setAttachments] = useState<any>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [accessories, setAccessories] = useState<any>([
        {
            id: Date.now(),
            accessory_id: "",
            qty: 0,
        },
    ]);

    const addMoreAccessories = () => {
        setAccessories([
            ...accessories,
            { id: Date.now(), accessory_id: "", qty: 0 },
        ]);
    };

    const onDelete = (id: any) => {
        setAccessories((prev: any) => prev.filter((row: any) => row.id !== id));
    };

    const updateRow = (id: any, field: any, value: any) => {
        setAccessories((prev: any) =>
            prev.map((row: any) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const getData = async () => {
        const fetchCategory = getCategory();
        const fetchColor = getColor();
        const fetMaterial = getMaterial();
        const fetchAccessories = getAccessories();
        const [category, color, material, accessories] = await Promise.all([
            fetchCategory,
            fetchColor,
            fetMaterial,
            fetchAccessories,
        ]);
        if (category.success && category.data.length > 0) {
            let data = [];
            for (let i = 0; i < category.data.length; i++) {
                data.push({
                    name: category.data[i].name,
                    value: category.data[i].id,
                    sizes: category.data[i].sizes,
                });
            }
            setCategory(data);
        }
        if (color.success && color.data.length > 0) {
            let data = [];
            for (let i = 0; i < color.data.length; i++) {
                data.push({
                    name: color.data[i].name,
                    value: color.data[i].id,
                });
            }
            setListColor(data);
        }
        if (material.success && material.data.length > 0) {
            let data = [];
            for (let i = 0; i < material.data.length; i++) {
                data.push({
                    name: material.data[i].name,
                    value: material.data[i].id,
                });
            }
            setListMaterial(data);
        }
        if (accessories.success && accessories.data.length > 0) {
            let data = [];
            for (let i = 0; i < accessories.data.length; i++) {
                data.push({
                    name: accessories.data[i].name,
                    value: accessories.data[i].id,
                });
            }
            setDataAccessories(data);
        }
    };

    const pickImage = async () => {
        if (attachments.length >= 2) {
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
            const updated = [...attachments, selectedAsset];
            setAttachments(updated);
        }
    };

    const removeAttachment = (index: number) => {
        const updated = attachments.filter((_: any, i: any) => i !== index);
        setAttachments(updated);
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

    const handleSubmit = async () => {
        const dataColor = listColor.filter((v) => {
            return v.value === selectedColor;
        });
        let formatFile = [];
        for (let i = 0; i < attachments.length; i++) {
            formatFile.push({
                uri: attachments[i].uri,
                name: attachments[i].fileName,
                type: attachments[i].mimeType,
            });
        }
        const cleanedData = accessories.map(({ id, ...rest }: any) => rest);

        const formData = new FormData();
        formData.append("name", productName);
        formData.append("color", dataColor[0].name);
        formData.append("material_id", selectedMaterial);
        formData.append("category_id", selectedCategory);
        formData.append("size_id", selectedSize);
        formData.append("description", description);
        // formData.append("accessories", cleanedData);
        cleanedData.forEach((item: any, index: any) => {
            formData.append(
                `accessories[${index}][accessory_id]`,
                item.accessory_id
            );
            formData.append(`accessories[${index}][qty]`, item.qty);
        });
        formatFile.forEach((item: any, index: any) => {
            formData.append(`images[${index}]`, item);
        });
        console.log("payload add", formData);

        setLoading(true);
        let res: any = {};
        if (isEdit) {
            res = await editNewProduct(formData, detailProduct?.id ?? "");
        } else {
            res = await addNewProduct(formData);
        }
        setLoading(false);
        console.log("res", res);

        if (res.success) {
            ShowToastMessage(res.message);
            router.back();
        } else {
            alert("Gagal menambahkan produk");
        }
    };

    const syncImagesFromBE = (imageUrls: string[]) => {
        let arr = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const mime = imageUrls[i].match(/\.([a-zA-Z0-9]+)(?:\?|#)?$/);
            arr.push({
                uri: `${PATH}${imageUrls[i]}`,
                width: 0,
                height: 0,
                mimeType: mime ? `image/${mime[1]}` : "image/jpeg",
                fileName: imageUrls[i].split("/").pop(),
            });
        }
        setAttachments(arr);
    };

    const getDataSize = (item: any) => {
        let size = [];
        for (let i = 0; i < item.sizes.length; i++) {
            size.push({
                name: item.sizes[i].name,
                value: item.sizes[i].id,
            });
        }
        setDataSize(size);
        return size;
    };

    useEffect(() => {
        if (data && listColor.length > 0 && category.length > 0) {
            const detailData = JSON.parse(data as string);
            setDetailProduct(detailData);
            const findColor = listColor.filter((v) => {
                return v.name === detailData?.color;
            });
            const findCategory = category.filter((v) => {
                return v.value === detailData?.category?.id;
            });
            if (getDataSize(findCategory[0]).length > 0) {
                setSelectedSize(detailData?.size?.id);
            }

            setProductName(detailData?.name);
            setDescription(detailData?.description);
            setSelectedCategory(detailData?.category?.id);
            setSelectedColor(findColor.length ? findColor[0].value : undefined);
            setSelectedMaterial(detailData?.material_id);
            syncImagesFromBE(detailData?.images);
            const acc = detailData?.accessories.map((v: any) => {
                v.qty = `${Number(v.qty)}`;
            });
            setAccessories(detailData.accessories);
            setIsEdit(true);
        }
    }, [data, listColor, category]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Tambah Produk Baru" />
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 100,
                    }}
                >
                    <View style={styles.content}>
                        <ThemedText type="SemiBold" size="md">
                            Formulir Tambah Produk
                        </ThemedText>
                        <ThemedText
                            type="Regular"
                            size="sm"
                            color={Color.Gray[500]}
                        >
                            Lengkapi informasi berikut untuk menambahkan produk
                            ke sistem.
                        </ThemedText>
                        <ThemedGap height="lg" />
                        <View style={{ gap: 15 }}>
                            <ThemedInput
                                label="Nama Produk"
                                placeholder="Masukkan nama produk"
                                style={{ height: 45 }}
                                value={productName}
                                onChangeText={(text) => setProductName(text)}
                            />
                            <CustomDropdown
                                items={category}
                                value={selectedCategory}
                                onSelectItem={(item: any) => {
                                    setSelectedCategory(item.value);
                                    let size = [];
                                    for (
                                        let i = 0;
                                        i < item.sizes.length;
                                        i++
                                    ) {
                                        size.push({
                                            name: item.sizes[i].name,
                                            value: item.sizes[i].id,
                                        });
                                    }
                                    setDataSize(size);
                                }}
                                label="Kategori"
                                placeholderText="Pilih kategori"
                            />
                            <CustomDropdown
                                items={dataSize}
                                value={selectedSize}
                                onSelectItem={(item: any) =>
                                    setSelectedSize(item.value)
                                }
                                label="Ukuran"
                                placeholderText="Pilih ukuran"
                                disabled={dataSize.length === 0}
                            />
                            <CustomDropdown
                                items={listColor}
                                value={selectedColor}
                                onSelectItem={(item: any) =>
                                    setSelectedColor(item.value)
                                }
                                label="Warna"
                                placeholderText="Pilih warna"
                            />
                            <CustomDropdown
                                items={listMaterial}
                                value={selectedMaterial}
                                onSelectItem={(item: any) =>
                                    setSelectedMaterial(item.value)
                                }
                                label="Bahan"
                                placeholderText="Pilih bahan"
                            />
                            <ThemedTextarea
                                label="Deskripsi"
                                placeholder="Deskripsi singkat produk"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                            />
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
                                            marginTop: -10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: "60%",
                                                paddingVertical: 8,
                                                paddingRight: 8,
                                                flexDirection: "row",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <CustomDropdown
                                                items={dataAccessories}
                                                value={v.accessory_id}
                                                onSelectItem={(item: any) =>
                                                    updateRow(
                                                        v.id,
                                                        "accessory_id",
                                                        item.value
                                                    )
                                                }
                                                placeholderText="Pilih salah satu opsi"
                                                containerStyle={{
                                                    borderRadius: 4,
                                                    width: "95%",
                                                }}
                                                widthdropdown="95%"
                                            />
                                        </View>
                                        <View
                                            style={{
                                                width: "25%",
                                                paddingHorizontal: 8,
                                                flexDirection: "row",
                                                alignItems: "flex-start",
                                                marginTop: 7,
                                                borderWidth: 1,
                                                borderColor: Color.Gray[300],
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
                                        <TouchableOpacity
                                            style={{
                                                width: "10%",
                                                marginTop: 7,
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
                                ))}
                            </View>
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
                            <View style={{ width: "100%" }}>
                                <FlatList
                                    horizontal
                                    data={attachments}
                                    keyExtractor={(_, i) => `${i}`}
                                    renderItem={renderImage}
                                    ListFooterComponent={
                                        attachments.length < 2 ? (
                                            <TouchableOpacity
                                                style={styles.imageContainer}
                                                onPress={pickImage}
                                            >
                                                <View
                                                    style={styles.placeholder}
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
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <ThemedButton
                    title="Simpan Produk"
                    onPress={() => ref.current?.show()}
                    loading={loading}
                />
            </View>

            <ThemedBottomSheet ref={ref} onClose={() => ref.current?.hide()}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    style={GlobalStyles.center}
                >
                    Simpan Produk
                </ThemedText>
                <ThemedGap height="md" />
                <ThemedText
                    type="Medium"
                    size="md"
                    color={Color.Text.Secondary}
                >
                    Apakah kamu yakin ingin menyimpan produk baru ini? Pastikan
                    semua informasi sudah benar.
                </ThemedText>
                <ThemedGap height="xl" />
                <ThemedButton
                    title="Ya, Simpan Sekarang"
                    onPress={() => {
                        ref.current?.hide();
                        handleSubmit();
                    }}
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

export default AddProductScreen;

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
    imageContainer: {
        marginRight: 10,
        marginTop: 10,
        position: "relative",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#fff",
        borderRadius: 10,
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
        bottom: 0,
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
