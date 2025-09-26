import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import { ConfirmationModal } from "@/components/modal/ModalConfirmation";
import { RejectModal } from "@/components/modal/ModalRejectProduct";
import { RepairModal } from "@/components/modal/ModalRepairProduct";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import { ROUTES } from "@/constants/Routes";
import {
    approveNewProduct,
    deleteNewProduct,
    getDetailProduct,
    rejectNewProduct,
    repairNewProduct,
} from "@/services/productionService";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Entypo, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

interface items {
    label: string;
    images: Array<string>;
    sewingBy?: string;
}

type ButtonOption = {
    label: string;
    color: string;
    icon?: string;
    onPress: () => void;
};

const ConfirmNewProduct = () => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 360;
    const { id } = useLocalSearchParams<{ id: string }>();
    const [items, setItems] = useState<items[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [showRepair, setShowRepeair] = useState(false);
    const [typeConfirm, setTypeConfirm] = useState("confirmation");
    const [isLoading, setIsLoading] = useState(false);
    const [dataProduct, setDataProduct] = useState<any>({});

    const [loadingFetch, setLoadingFetch] = useState(false);

    const buttonOptions: ButtonOption[] = [
        {
            label: "Ubah",
            color: "#7B5CFF",
            onPress: () => handleEdit(),
        },
        {
            label: "Setujui",
            color: "#28A745",
            icon: "check-circle",
            onPress: () => {
                setTypeConfirm("confirmation");
                setShowConfirmation(true);
            },
        },
        {
            label: "Tolak",
            color: Color["Red-Primary"],
            icon: "x-circle",
            onPress: () => setShowReject(true),
        },
        {
            label: "Hapus",
            color: Color["Red-Primary"],
            onPress: () => {
                setTypeConfirm("delete");
                setShowConfirmation(true);
            },
        },
    ];

    const buttonOptionsRejected: ButtonOption[] = [
        {
            label: "Ubah",
            color: "#7B5CFF",
            onPress: () => handleEdit(),
        },
        {
            label: "Mulai Perbaikan",
            color: "#28A745",
            icon: "lab-flask",
            onPress: () => {
                setShowRepeair(true);
            },
        },
        {
            label: "Hapus",
            color: Color["Red-Primary"],
            onPress: () => {
                setTypeConfirm("delete");
                setShowConfirmation(true);
            },
        },
    ];

    const handleEdit = () => {
        router.replace({
            pathname: ROUTES.TASK_ADD_PRODUCTS,
            params: { data: JSON.stringify(dataProduct) },
        });
    };

    const handleApprove = async () => {
        setIsLoading(true);
        const res = await approveNewProduct(dataProduct?.id);
        setIsLoading(false);
        if (res.success) {
            ShowToastMessage("Produk telah disetujui");
            router.back();
        } else {
            ShowToastMessage("Produk gagal disetujui");
        }
        setShowConfirmation(false);
    };

    const handleRepair = async (status: any) => {
        const payload = {
            status,
        };
        setIsLoading(true);
        const res = await repairNewProduct(dataProduct?.id, payload);
        setIsLoading(false);
        setShowRepeair(false);
        if (res.success) {
            ShowToastMessage("Silahkan mulai perbaikan produk");
            router.replace({
                pathname: ROUTES.TASK_COMPLETE_FLOW_PRODUCTS,
                params: { id: dataProduct?.id },
            });
        }
    };

    const handleReject = async (revisionAt: any, reason: any) => {
        const payload = {
            should_revision: revisionAt,
            reject_reason: reason,
        };
        console.log("payload reject", payload);

        setIsLoading(true);
        const res = await rejectNewProduct(dataProduct?.id, payload);
        console.log("cek res reject", res);

        setIsLoading(false);
        if (res.success) {
            ShowToastMessage("Produk telah ditolak");
            router.back();
        }
        setShowReject(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        const res = await deleteNewProduct(dataProduct?.id);
        setIsLoading(false);
        if (res.success) {
            ShowToastMessage("Produk telah dihapus");
            router.back();
        }
        setShowConfirmation(false);
    };

    const getDetail = async () => {
        setLoadingFetch(true);
        const res = await getDetailProduct(id);
        setLoadingFetch(false);
        console.log("res detail", res);
        if (res.success && res.data) {
            let arr = [
                {
                    label: "Pola",
                    images: res.data?.pattern_images ?? [],
                },
                {
                    label: "Sample",
                    images: res.data?.cutting_images ?? [],
                    sewingBy: "Rido Jahit",
                },
                {
                    label: "Hasil Produk",
                    images: res.data?.product_results ?? [],
                },
            ];
            setItems(arr);
            setDataProduct(res.data);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Lihat Produk Baru" />
            {loadingFetch ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator color="red" />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View style={{ padding: 16 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 15,
                            }}
                        >
                            <View style={styles.viewStatus}>
                                <ThemedText
                                    size="md"
                                    color={Color.Border.Purple}
                                >
                                    {dataProduct?.status}
                                </ThemedText>
                            </View>
                        </View>
                        {dataProduct?.status === "Ditolak" &&
                            dataProduct?.reject_reason.length > 0 && (
                                <View
                                    style={{
                                        width: "100%",
                                        borderRadius: 4,
                                        padding: 10,
                                        borderWidth: 1,
                                        borderColor: Color.Gray[300],
                                    }}
                                >
                                    {dataProduct?.reject_reason.map(
                                        (v: any, index: any) => (
                                            <View
                                                key={`${index}`}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: 5,
                                                        height: 5,
                                                        borderRadius: 2.5,
                                                        backgroundColor:
                                                            Color.Base.Black,
                                                    }}
                                                />
                                                <ThemedText
                                                    size="xs"
                                                    color={Color.Base.Black}
                                                >
                                                    {v}
                                                </ThemedText>
                                            </View>
                                        )
                                    )}
                                </View>
                            )}
                        <View
                            style={[
                                styles.viewCard,
                                {
                                    marginTop: 15,
                                },
                            ]}
                        >
                            {items.map((v, index) => (
                                <View key={`${index}`} style={styles.viewItems}>
                                    <ThemedText
                                        size="lg"
                                        type="SemiBold"
                                        color={Color.Base.Black}
                                    >
                                        {v.label}
                                    </ThemedText>
                                    {v.label === "Sample" && (
                                        <ThemedText>
                                            Dijahit oleh: Rido Jahit
                                        </ThemedText>
                                    )}
                                    <View
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            gap: 8,
                                        }}
                                    >
                                        {v.images.length ? (
                                            v.images.map(
                                                (v: any, index: any) => (
                                                    <Image
                                                        key={`${index}`}
                                                        source={{
                                                            uri: `${PATH}${v}`,
                                                        }}
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            resizeMode: "cover",
                                                        }}
                                                    />
                                                )
                                            )
                                        ) : (
                                            <>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            paddingVertical: 5,
                                                            paddingHorizontal: 10,
                                                            borderWidth: 1,
                                                            borderColor:
                                                                Color
                                                                    .Yellow[300],
                                                            backgroundColor:
                                                                Color
                                                                    .Yellow[50],
                                                            borderRadius: 4,
                                                        }}
                                                    >
                                                        <ThemedText
                                                            size="sm"
                                                            color={
                                                                Color
                                                                    .Yellow[500]
                                                            }
                                                        >
                                                            Belum ada {v.label}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View
                            style={[
                                styles.container,
                                isSmallScreen && styles.containerSmall,
                            ]}
                        >
                            {dataProduct?.status === "Ditolak" ? (
                                <>
                                    {buttonOptionsRejected.map((btn, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.button,
                                                { backgroundColor: btn.color },
                                                isSmallScreen &&
                                                    styles.buttonSmall,
                                            ]}
                                            onPress={btn.onPress}
                                        >
                                            {btn.icon && (
                                                <Entypo
                                                    name={btn.icon}
                                                    size={14}
                                                    color="#fff"
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text
                                                style={[
                                                    styles.text,
                                                    isSmallScreen &&
                                                        styles.textSmall,
                                                ]}
                                            >
                                                {btn.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {buttonOptions.map((btn, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.button,
                                                { backgroundColor: btn.color },
                                                isSmallScreen &&
                                                    styles.buttonSmall,
                                            ]}
                                            onPress={btn.onPress}
                                        >
                                            {btn.icon && (
                                                <Feather
                                                    name={btn.icon}
                                                    size={14}
                                                    color="#fff"
                                                    style={styles.icon}
                                                />
                                            )}
                                            <Text
                                                style={[
                                                    styles.text,
                                                    isSmallScreen &&
                                                        styles.textSmall,
                                                ]}
                                            >
                                                {btn.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            )}
            <ConfirmationModal
                visible={showConfirmation}
                title={
                    typeConfirm === "confirmation"
                        ? "Setujui Produk"
                        : "Hapus Produk"
                }
                type={typeConfirm}
                message="Apakah Anda yakin ingin melakukan ini?"
                onCancel={() => setShowConfirmation(false)}
                onConfirm={() => {
                    if (typeConfirm === "confirmation") {
                        handleApprove();
                    } else {
                        handleDelete();
                    }
                }}
                isLoading={isLoading}
            />
            <RepairModal
                visible={showRepair}
                onCancel={() => setShowRepeair(false)}
                onConfirm={(status: any) => {
                    handleRepair(status);
                }}
            />
            <RejectModal
                visible={showReject}
                onCancel={() => setShowReject(false)}
                onConfirm={(options, reason) => {
                    console.log("Selected:", options, "Reason:", reason);
                    // setShowReject(false);
                    handleReject(options, reason);
                }}
            />
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    viewStatus: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderColor: Color.Border.Purple,
        borderWidth: 1,
        backgroundColor: Color.Purple[100],
    },
    textSmall: {
        fontSize: 12,
    },
    buttonSmall: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    containerSmall: {
        justifyContent: "center", // biar tengah di layar kecil
    },
    container: {
        flexDirection: "row",
        marginTop: 20,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        marginRight: 8,
    },
    icon: {
        marginRight: 6,
    },
    text: {
        color: "#fff",
        fontWeight: "600",
    },
    viewCard: {
        width: "100%",
        borderWidth: 1,
        borderColor: Color.Gray[300],
        borderRadius: 4,
    },
    viewItems: {
        width: "100%",
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        borderBottomColor: Color.Gray[300],
        borderBottomWidth: 1,
    },
});

export default ConfirmNewProduct;
