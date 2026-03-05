import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import ModalFilter from "@/components/modal/ModalFilter";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getListProduct } from "@/services/productionService";
import { getProductVariant } from "@/services/productVariantService";
import { getSelling } from "@/services/sellingService";
import { hasMenuAccess } from "@/utils/helpher";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import CardTransaction from "./component/CardTransaction";
import Widget from "./component/widget";

const ListTransaction = () => {
    const { user } = useApp();
    const [listSelling, setListSelling] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataWidget, setDataWidget] = useState({
        total_penjualan: "0",
        total_transaksi_dibatalkan: 0,
        total_transaksi_selesai: 0,
    });
    const [params, setParams] = useState({
        status: "",
        year: "",
        month: "",
        "productIds[]": [],
    });
    const [modalFilter, setModalFilter] = useState(false);
    const [listProduct, setListProduct] = useState<any>([]);
    const [listVariant, setListVariant] = useState<any>([]);

    const getList = async () => {
        setLoading(true);
        const res = await getSelling(params);
        setLoading(false);
        //   console.log("res selling", res);
        if (res.success) {
            setListSelling(res.data.data);
            setDataWidget(res.data.stats);
        }
    };

    const getData = async () => {
        const getProduct = getListProduct();
        const getListVariant = getProductVariant();
        const [product, listProductVariant] = await Promise.all([
            getProduct,
            getListVariant,
        ]);
        if (listProductVariant.success) {
            let arr = [];
            for (let i = 0; i < listProductVariant.data.length; i++) {
                arr.push({
                    name: `${listProductVariant.data[i].sku} - ${listProductVariant.data[i].color}`,
                    value: listProductVariant.data[i].id,
                });
            }
            setListVariant(arr);
        }
        //   console.log("res product", product);

        if (product.success) {
            let arr = [];
            for (let i = 0; i < product.data.length; i++) {
                arr.push({
                    name: `${product.data[i].sku} - ${product.data[i].color}`,
                    value: product.data[i].id,
                });
            }
            setListProduct(arr);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getList();
    }, [params]);

    useEffect(() => {
        if (!hasMenuAccess(user?.role?.name, MENU_PERMISSION.SELLING_REPORT)) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    return (
        <ThemedContainer>
            <ModalFilter
                visible={modalFilter}
                onClose={() => setModalFilter(false)}
                setState={(data: any) => {
                    //   console.log("applied data", data);
                }}
                listVariant={listVariant}
                listProduct={listProduct}
                showBatch={false}
                state={params}
                type="selling"
                onConfirm={(data: any) => {
                    setParams(data);
                    setModalFilter(false);
                }}
            />
            <View style={styles.container}>
                <ThemedHeader title="Penjualan" />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.push(ROUTES.TASK_POINT_OF_SALE)}
                        activeOpacity={0.9}
                        style={styles.btnAdd}
                    >
                        <ThemedText size="md" color={Color.Base.White}>
                            Buat Penjualan
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setModalFilter(true)}
                        activeOpacity={0.9}
                        style={[
                            styles.btnAdd,
                            { backgroundColor: Color.Base.White },
                        ]}
                    >
                        <FontAwesome name="filter" size={18} />
                    </TouchableOpacity>
                </View>
                <Widget data={dataWidget} />
                {loading ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <ActivityIndicator color="red" size="small" />
                    </View>
                ) : (
                    <ScrollView
                        style={{ padding: 16 }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {listSelling.map((v: any, index: any) => (
                            <CardTransaction
                                key={`${index}`}
                                keyComponent={v.id}
                                data={v}
                                onPress={() =>
                                    router.push({
                                        pathname: ROUTES.TASK_DETAIL_SALE,
                                        params: { id: v.id },
                                    })
                                }
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    btnAdd: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: Color.Purple[600],
    },
    card: {
        width: "100%",
        alignSelf: "center",
        borderRadius: 8,
        padding: 16,
        backgroundColor: Color.Base.White,
        gap: 8,
        borderWidth: 1,
        borderColor: Color.Gray[300],
    },
    container: {
        flex: 1,
        backgroundColor: Color.Background.Background,
    },
});

export default ListTransaction;
