import {
    ThemedBadge,
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedImage,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { getListProduct } from "@/services/productionService";
import GlobalStyles from "@/styles/common";
import { Product } from "@/types/warehouse";
import { scale } from "@/utils/scaleSize";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const ProductItem = React.memo(({ item, onPress }: any) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.productWrapper}
        >
            <View style={styles.rowStart}>
                <ThemedImage
                    source={{ uri: `${PATH}${item.images[0]}` }}
                    width={50}
                    height={50}
                    style={styles.image}
                />
                <ThemedGap width="sm" />
                <View style={GlobalStyles.flex}>
                    <ThemedText type="SemiBold" size="md">
                        {item.name}
                    </ThemedText>
                    <ThemedGap height="xs" />
                    <ThemedText
                        type="Medium"
                        size="xs"
                        color={Color.Text.Secondary}
                    >
                        Kategori: {item.category.name}
                    </ThemedText>
                    <ThemedText
                        type="Medium"
                        size="xs"
                        color={Color.Text.Secondary}
                    >
                        Material: {item.material.name}
                    </ThemedText>
                    <ThemedText
                        type="Medium"
                        size="xs"
                        color={Color.Text.Secondary}
                    >
                        Warna: {item.color} - {item.size.name}
                    </ThemedText>
                </View>
            </View>
            <ThemedGap height="sm" />
            <View style={styles.rowEnd}>
                <ThemedBadge
                    text={item.status}
                    backgroundColor={Color.Green[400]}
                    textColor={Color.Base.White}
                />
            </View>
        </TouchableOpacity>
    );
});

const ListOfProductScreen = () => {
    const renderProductItem = useCallback(
        ({ item }: any) => (
            <ProductItem
                item={item}
                onPress={() => {
                    if (item.status == "Disetujui") {
                        return;
                    } else if (item.status == "Ditolak") {
                        router.push({
                            pathname: ROUTES.TASK_COMPLETE_ADD_PRODUCTS,
                            params: { id: item.id },
                        });
                    } else if (item.status === "Konfirmasi") {
                        router.push({
                            pathname: ROUTES.TASK_COMPLETE_ADD_PRODUCTS,
                            params: { id: item.id },
                        });
                    } else {
                        router.push({
                            pathname: ROUTES.TASK_COMPLETE_FLOW_PRODUCTS,
                            params: { id: item.id },
                        });
                    }
                }}
            />
        ),
        []
    );
    const [listProduct, setListProduct] = useState<Product[]>([]);

    const getList = async () => {
        const res = await getListProduct();
        if (res.success) {
            setListProduct(res.data ?? []);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getList();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    return (
        <ThemedContainer>
            <ThemedHeader title="Daftar Produk" />
            <View style={styles.container}>
                <FlatList
                    data={listProduct}
                    renderItem={renderProductItem}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <ThemedGap height="sm" />}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={10}
                    removeClippedSubviews={Platform.OS === "android"}
                    ListEmptyComponent={() => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText>Belum ada Produk Baru</ThemedText>
                        </View>
                    )}
                />
            </View>
        </ThemedContainer>
    );
};

export default ListOfProductScreen;

const styles = StyleSheet.create({
    container: {
        padding: scale(20),
        ...GlobalStyles.flex,
    },
    productWrapper: {
        backgroundColor: Color.Gray[50],
        padding: scale(12),
        borderWidth: 1,
        borderColor: Color.Gray[200],
        borderRadius: Radius.xs,
    },
    image: {
        borderRadius: Radius.xs,
    },
    rowStart: {
        justifyContent: "flex-start",
        ...GlobalStyles.rowCenter,
    },
    rowEnd: {
        justifyContent: "flex-end",
        ...GlobalStyles.rowCenter,
    },
});
