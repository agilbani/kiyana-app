import {
    ThemedContainer,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import ModalUpdateStock from "@/components/modal/ModalUpdateStock";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { useApp } from "@/context/AppContext";
import { getProductVariant } from "@/services/productVariantService";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { hasMenuAccess } from "@/utils/helpher";
import { scale } from "@/utils/scaleSize";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ProductVariant = () => {
    const { user } = useApp();
    const [listVariant, setListVariant] = useState<any>([]);
    const [selectedVarian, setSelectedVarian] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const getList = async () => {
        setListVariant([]);
        setLoading(true);
        const res = await getProductVariant();
        setLoading(false);
        if (res.success) {
            setListVariant(res.data);
            setSelectedVarian({});
        }
    };

    const filterData = () => {
        let data = [];
        if (keyword) {
            data = listVariant.filter((item: any) =>
                item.sku?.toLowerCase().includes(keyword.toLowerCase()),
            );
        } else {
            data = listVariant;
        }

        return data;
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.LIST_STOCK)) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    return (
        <ThemedContainer>
            <ModalUpdateStock
                visible={showModal}
                onClose={() => setShowModal(false)}
                currentStock={selectedVarian}
                onSuccess={() => {
                    setShowModal(false);
                    getList();
                }}
            />
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Color.Base.White}
            />
            <ThemedHeader title="Daftar Produk Variant" />
            <View style={styles.container}>
                <View
                    style={{
                        padding: 15,
                        backgroundColor: Color.Base.White,
                    }}
                >
                    <TextInput
                        placeholder="Cari Nama SKU"
                        value={keyword}
                        onChangeText={(text: string) => setKeyword(text)}
                        style={{
                            borderRadius: 8,
                            padding: 8,
                            borderWidth: 1,
                            borderColor: Color.Gray[300],
                        }}
                    />
                </View>
                <FlatList
                    data={filterData()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: 15, paddingHorizontal: 15 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.95}
                            style={styles.card}
                        >
                            <View
                                style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.Gray[200],
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <View
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#0496FF",
                                    }}
                                >
                                    <FontAwesome6
                                        name="shirt"
                                        size={17}
                                        color={Color.Base.White}
                                    />
                                </View>
                                <ThemedText size="md" type="SemiBold">
                                    {item.sku}
                                </ThemedText>
                            </View>
                            <View
                                style={[
                                    GlobalStyles.rowSpaceBetween,
                                    { paddingBottom: 0 },
                                ]}
                            >
                                <ThemedText
                                    size="xs"
                                    color={Color.Text.Secondary}
                                >
                                    Nama Produk
                                </ThemedText>
                                <ThemedText
                                    size="base"
                                    type="SemiBold"
                                    color={Color.Base.Black}
                                >
                                    {item.product.name} - {item.color} |{" "}
                                    {item.size.name}
                                </ThemedText>
                            </View>
                            <View
                                style={[
                                    GlobalStyles.rowSpaceBetween,
                                    { paddingBottom: 0 },
                                ]}
                            >
                                <ThemedText
                                    size="xs"
                                    color={Color.Text.Secondary}
                                >
                                    Harga Produk
                                </ThemedText>
                                <ThemedText
                                    size="base"
                                    type="SemiBold"
                                    color={Color.Base.Black}
                                >
                                    {formatRupiahDisplay(item.price)}
                                </ThemedText>
                            </View>
                            <View style={GlobalStyles.rowSpaceBetween}>
                                <View style={{ gap: 4 }}>
                                    <ThemedText
                                        size="xs"
                                        color={Color.Text.Secondary}
                                    >
                                        Total Stok
                                    </ThemedText>
                                    <ThemedText color={Color.Base.Black}>
                                        {item.stock}
                                    </ThemedText>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                    onPress={() => {
                                        setSelectedVarian(item);
                                        setShowModal(true);
                                    }}
                                >
                                    <View style={styles.btnUpdate}>
                                        <ThemedText
                                            size="md"
                                            type="Medium"
                                            color={Color.Base.White}
                                        >
                                            Update Stok
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => {
                        if (loading) {
                            return (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingVertical: 20,
                                    }}
                                >
                                    <ThemedLoader />
                                </View>
                            );
                        }
                    }}
                />
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    btnUpdate: {
        borderRadius: 6,
        backgroundColor: Color.Green[500],
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    card: {
        width: "100%",
        borderRadius: 16,
        backgroundColor: Color.Base.White,
        padding: 16,
        gap: 12,
    },
    container: {
        paddingVertical: scale(20),
        backgroundColor: "#F7F8FB",
        ...GlobalStyles.flex,
    },
});

export default ProductVariant;
