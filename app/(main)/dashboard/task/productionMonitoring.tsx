import {
    ThemedContainer,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import ModalDetailMonitoring from "@/components/modal/ModalDetailMonitoring";
import ModalFilter from "@/components/modal/ModalFilter";
import Color from "@/constants/Color";
import { MENU_PERMISSION } from "@/constants/Permission";
import { useApp } from "@/context/AppContext";
import { getListProduct } from "@/services/masterService";
import { getMonitoringProduct } from "@/services/productionService";
import { getProductVariant } from "@/services/productVariantService";
import GlobalStyles from "@/styles/common";
import { hasMenuAccess } from "@/utils/helpher";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const ProductionMonitoring = () => {
    const { user } = useApp();
    const [params, setParams] = useState({
        status: "",
        month: moment().format("MM"),
        year: moment().format("YYYY"),
        isBatchRejected: "Tidak",
        product: "",
        variant: "",
    });
    const [listProduct, setListProduct] = useState<any>([]);
    const [listVariant, setListVariant] = useState<any>([]);
    const [listMonitoring, setListMonitoring] = useState<any>([]);
    const [modalFilter, setModalFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalDetail, setModalDetail] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const getBadge = (status: any) => {
        let color = {
            wording: "",
            fontColor: "",
            bgColor: "",
        };
        switch (status) {
            case "completed":
                color.bgColor = Color.Green[50];
                color.fontColor = Color.Green[500];
                color.wording = "Completed";
                break;
            default:
                color.bgColor = Color.Gray[200];
                color.fontColor = Color.Base.Black;
                color.wording = "Selesai Dipotong";
                break;
        }
        return color;
    };

    const getList = async () => {
        setLoading(true);
        const getProduct = getListProduct();
        const getListVariant = getProductVariant();
        const getMonitoring = getMonitoringProduct(params);
        const [product, listProductVariant, monitoring] = await Promise.all([
            getProduct,
            getListVariant,
            getMonitoring,
        ]);
        //   console.log("cek monitoring", monitoring);
        setLoading(false);
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
        if (monitoring.success) {
            setListMonitoring(monitoring.data);
        }
    };

    useEffect(() => {
        getList();
    }, [params]);

    useEffect(() => {
        if (
            !hasMenuAccess(
                user?.role?.name,
                MENU_PERMISSION.PRODUCTION_MONITORING,
            )
        ) {
            Alert.alert(
                "Akses ditolak",
                "Anda tidak memiliki akses ke menu ini",
            );
            router.back();
        }
    }, []);

    return (
        <ThemedContainer>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Color.Base.White}
            />
            <ModalFilter
                visible={modalFilter}
                onClose={() => setModalFilter(false)}
                state={params}
                setState={(data) => {
                    setParams(data);
                    setTimeout(() => {
                        setModalFilter(false);
                    }, 500);
                }}
                listVariant={listVariant}
                listProduct={listProduct}
                onConfirm={() => console.log("")}
            />
            <ModalDetailMonitoring
                visible={modalDetail}
                onClose={() => setModalDetail(false)}
                data={selectedData}
            />
            <View style={styles.page}>
                <ThemedHeader title="Monitoring Produksi" />
                <View style={{ alignItems: "flex-end", padding: 16 }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => setModalFilter(true)}
                    >
                        <View style={styles.viewFilter}>
                            <FontAwesome name="filter" size={15} />
                        </View>
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ThemedLoader />
                ) : (
                    <FlatList
                        data={listMonitoring}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerStyle}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.cardItem}
                                onPress={() => {
                                    setSelectedData(item);
                                    setTimeout(() => {
                                        setModalDetail(true);
                                    }, 500);
                                }}
                            >
                                <View style={styles.titleCard}>
                                    <ThemedText size="md" type="SemiBold">
                                        {item.item.variant_metadata.sku} |{" "}
                                        {item.item.variant}
                                    </ThemedText>
                                </View>
                                <View style={GlobalStyles.rowSpaceBetween}>
                                    <ThemedText color={Color.Gray[500]}>
                                        Nomor Batch
                                    </ThemedText>
                                    <ThemedText type="SemiBold">
                                        {item.batch}
                                    </ThemedText>
                                </View>
                                <View style={GlobalStyles.rowSpaceBetween}>
                                    <ThemedText color={Color.Gray[500]}>
                                        Tanggal Transaksi
                                    </ThemedText>
                                    <ThemedText type="SemiBold">
                                        {moment(item.cutting_at).format(
                                            "DD-MM-YYYY",
                                        )}
                                    </ThemedText>
                                </View>
                                <View style={GlobalStyles.rowSpaceBetween}>
                                    <ThemedText color={Color.Gray[500]}>
                                        Jumlah Produksi
                                    </ThemedText>
                                    <ThemedText type="SemiBold">
                                        {item.qty}
                                    </ThemedText>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.badge,
                                                {
                                                    borderColor: getBadge(
                                                        item.status,
                                                    ).fontColor,
                                                    backgroundColor: getBadge(
                                                        item.status,
                                                    ).bgColor,
                                                },
                                            ]}
                                        >
                                            <ThemedText
                                                size="xs"
                                                color={
                                                    getBadge(item.status)
                                                        .fontColor
                                                }
                                            >
                                                {item.status}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    titleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
        borderBottomColor: Color.Gray[200],
        borderBottomWidth: 1,
    },
    cardItem: {
        width: "100%",
        borderRadius: 6,
        padding: 16,
        borderWidth: 1,
        borderColor: Color.Gray[100],
        backgroundColor: Color.Base.White,
        elevation: 1,
        gap: 12,
    },
    containerStyle: {
        paddingBottom: 100,
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 15,
    },
    viewFilter: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Color.Gray[300],
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 8,
    },
    page: {
        flex: 1,
    },
});

export default ProductionMonitoring;
