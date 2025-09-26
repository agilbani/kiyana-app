import {
    ThemedButton,
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import ModalEntry from "@/components/modal/ModalEntry";
import ModalReject from "@/components/modal/ModalReject";
import ModalRejectImage from "@/components/modal/ModalRejectImage";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import { useApp } from "@/context/AppContext";
import {
    approveProduction,
    getTaskByBatch,
    GetTaskByBatchResult,
    updateProduction,
} from "@/services/productionService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import { scale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const DetailProductionScreen = () => {
    const { user } = useApp();
    const { bottom } = usePositionBottom();
    console.log("cek user prod", user);

    //id = batch code
    const { id } = useLocalSearchParams<{ id: string }>();
    // console.log("cek code detail prod", id);
    const [detailProduction, setDetailProduction] =
        useState<GetTaskByBatchResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingAction, setLoadingAction] = useState<boolean>(false);
    const [showModalEntry, setShowModalEntry] = useState<boolean>(false);
    const [showModalReject, setShowModalReject] = useState<boolean>(false);
    const [showModalImageReject, setShowModalImageReject] =
        useState<boolean>(false);

    const handleStartSewing = async () => {
        setLoadingAction(true);
        const body = {
            sewing_by: Number(user?.id),
            start_sewing_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            body
        );
        setLoadingAction(false);
        if (res.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil memulai proses jahit ✅",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            getDetail();
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Gagal memulai proses jahit",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    };

    const handleFinishSewing = async () => {
        setLoadingAction(true);
        const body = {
            sewing_by: Number(user?.id),
            end_sewing_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            body
        );
        setLoadingAction(false);
        if (res?.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil menyelesaikan proses jahit ✅",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            router.back();
        }
    };

    const handleStartFinishing = async () => {
        setLoadingAction(true);
        const body = {
            finishing_by: Number(user?.id),
            start_finishing_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            body
        );
        setLoadingAction(false);
        if (res.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil memulai proses finishing ✅",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            getDetail();
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Gagal memulai proses finishing",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    };

    const handleFinishFinishing = async () => {
        setLoadingAction(true);
        const body = {
            finishing_by: Number(user?.id),
            end_finishing_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            body
        );
        console.log("res finish", res);

        setLoadingAction(false);
        if (res?.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil menyelesaikan proses finishing ✅",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            router.back();
        }
    };

    const handleApprove = async () => {
        const res = await approveProduction(id);
        if (res.success) {
            ShowToastMessage(res.message);
            getDetail();
        }
    };

    const handleReject = async () => {
        setShowModalReject(true);
    };

    async function getDetail() {
        setLoading(true);
        const result = await getTaskByBatch(id);
        console.log("res task", result);

        setLoading(false);
        if (result.success && result.data) {
            setDetailProduction(result);
            if (result.data.status === "Approved") {
                setShowModalEntry(true);
            }
            console.log("Task fetched:", result.data);
        } else {
            console.warn("Failed:", result.statusCode, result.message);
        }
    }

    function showButtonByRole() {
        const status = detailProduction?.data?.status;
        const isRejected =
            detailProduction?.data?.rejected === null ? false : true;
        const rejectedAt = detailProduction?.data?.rejected?.rejected_at;
        if (user?.role?.name === "Penjahit") {
            if (status === "Selesai Dipotong" || status === "Sedang Dijahit") {
                return (
                    <ButtonRoleSewing
                        data={data}
                        onStartSewing={() => handleStartSewing()}
                        onFinishSewing={() => handleFinishSewing()}
                        loading={loadingAction}
                    />
                );
            }
        } else if (user?.role?.name === "Finishing") {
            if (status === "Selesai Dijahit" || status === "Proses Finishing") {
                return (
                    <ButtonRoleFinishing
                        data={data}
                        onPressStart={() => handleStartFinishing()}
                        onPressFinish={() => handleFinishFinishing()}
                        loading={loadingAction}
                    />
                );
            }
        } else if (user?.role?.name === "Staff Gudang") {
            if (status === "Complated") {
                return (
                    <ButtonRoleWarehouse
                        data={data}
                        onPressApprove={() => {
                            if (data.status === "Approved") {
                                setShowModalEntry(true);
                            } else {
                                handleApprove();
                            }
                        }}
                        onPressReject={() => handleReject()}
                    />
                );
            }
        } else {
            // return (
            //     <ButtonRoleWarehouse
            //         data={data}
            //         onPressApprove={() => {
            //             if (data.status === "Approved") {
            //                 setShowModalEntry(true);
            //             } else {
            //                 handleApprove();
            //             }
            //         }}
            //         onPressReject={() => handleReject()}
            //     />
            // );
        }
    }

    useEffect(() => {
        if (id) {
            getDetail();
        }
    }, [id]);

    if (!detailProduction?.success || !detailProduction.data) {
        return (
            <View style={styles.page}>
                <StatusBar translucent barStyle="dark-content" />
                <ThemedHeader title="Detail Tugas" />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ThemedText>Data tidak ditemukan</ThemedText>
                </View>
            </View>
        );
    }
    const data = detailProduction.data;
    console.log("task detail", data);

    return (
        <View style={styles.page}>
            <StatusBar translucent barStyle="light-content" />
            <ThemedHeader title="Detail Produksi" />
            {loading ? (
                <ThemedLoader />
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.viewCard}>
                        <ThemedText type="Bold" size="lg">
                            Info Produksi
                        </ThemedText>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">Batch:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>{data?.batch}</ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">
                                Jumlah yang perlu diselesaikan:
                            </ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>{data?.qty}</ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">Warna:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {data?.production_item?.variant_metadata?.color}
                            </ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">Status:</ThemedText>
                            <ThemedText>{data?.status}</ThemedText>
                        </View>
                    </View>
                    <View style={styles.gap} />
                    <View style={styles.viewCard}>
                        <ThemedText type="Bold" size="lg">
                            Info Produk
                        </ThemedText>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">
                                Nama Produk:
                            </ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {
                                    data?.production_item?.variant_metadata
                                        ?.product?.name
                                }
                            </ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">SKU:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {data?.production_item?.variant_metadata?.sku}
                            </ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">Level:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {
                                    data?.production_item?.variant_metadata
                                        ?.product.level
                                }
                            </ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">Size:</ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {
                                    data?.production_item?.variant_metadata
                                        ?.size?.name
                                }
                            </ThemedText>
                        </View>
                        <View style={GlobalStyles.rowSpaceBetween}>
                            <ThemedText type="SemiBold">
                                Target Produksi:
                            </ThemedText>
                            <ThemedGap width="xs" />
                            <ThemedText>
                                {data?.production_item?.qty}{" "}
                                {data?.production_item?.unit}
                            </ThemedText>
                        </View>
                    </View>
                    {detailProduction.data.rejected !== null && (
                        <>
                            <View style={styles.gap} />
                            <View style={styles.viewCard}>
                                <ThemedText type="Bold" size="lg">
                                    Produk Ditolak
                                </ThemedText>
                                <ThemedText type="SemiBold">
                                    Alasan penolakan:
                                </ThemedText>
                                <ThemedText>
                                    {
                                        detailProduction.data.rejected
                                            ?.rejected_reason
                                    }
                                </ThemedText>
                                <ThemedGap width="xs" />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        setShowModalImageReject(true)
                                    }
                                >
                                    <Image
                                        source={{
                                            uri: `${PATH}${detailProduction?.data?.rejected?.attachment}`,
                                        }}
                                        style={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 6,
                                            resizeMode: "contain",
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            )}
            <ModalRejectImage
                visible={showModalImageReject}
                onClose={() => setShowModalImageReject(false)}
                uri={`${PATH}${detailProduction?.data?.rejected?.attachment}`}
            />
            <ModalEntry
                visible={showModalEntry}
                onClose={() => setShowModalEntry(false)}
                batch={id}
                onSuccessEntry={() => {
                    setShowModalEntry(false);
                    router.back();
                }}
            />
            <ModalReject
                visible={showModalReject}
                onClose={() => setShowModalReject(false)}
                batch={id}
                onSuccessReject={() => {
                    setShowModalEntry(false);
                    router.back();
                }}
            />
            <View style={[styles.footer, { bottom: bottom }]}>
                {showButtonByRole()}
            </View>
        </View>
    );
};

const ButtonRoleSewing = ({
    data,
    onStartSewing,
    onFinishSewing,
    loading,
}: any) => {
    return (
        <View style={styles.viewRowBtn}>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title="Mulai Jahit"
                    style={{ marginTop: 10 }}
                    disabled={data.start_sewing_at !== null}
                    onPress={onStartSewing}
                    loading={loading}
                />
            </View>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title="Selesai Jahit"
                    style={{ marginTop: 10 }}
                    disabled={
                        data.start_sewing_at === null ||
                        (data.start_sewing_at !== null &&
                            data.end_sewing_at !== null)
                    }
                    onPress={onFinishSewing}
                    loading={loading}
                />
            </View>
        </View>
    );
};

const ButtonRoleFinishing = ({
    data,
    onPressStart,
    onPressFinish,
    loading,
}: any) => {
    return (
        <View style={styles.viewRowBtn}>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title="Mulai Proses Finishing"
                    style={{ marginTop: 10 }}
                    disabled={data.start_finishing_at !== null}
                    onPress={onPressStart}
                    loading={loading}
                />
            </View>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title="Selesai Finishing"
                    style={{ marginTop: 10 }}
                    disabled={data.start_finishing_at === null}
                    onPress={onPressFinish}
                    loading={loading}
                />
            </View>
        </View>
    );
};

const ButtonRoleWarehouse = ({ data, onPressApprove, onPressReject }: any) => {
    return (
        <View style={styles.viewRowBtn}>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title={
                        data.status === "Complated" ? "Approve" : "Proses Entry"
                    }
                    style={{ marginTop: 10, borderRadius: 6 }}
                    // disabled={true}
                    onPress={onPressApprove}
                />
            </View>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title="Reject"
                    variant="outline"
                    style={{
                        marginTop: 10,
                        backgroundColor:
                            data.status === "Approved"
                                ? Color.Red[200]
                                : Color.Red[500],
                        borderWidth: 0,
                        borderRadius: 6,
                    }}
                    textColor={Color.Base.White}
                    disabled={data.status === "Approved"}
                    onPress={onPressReject}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        width: "100%",
        backgroundColor: Color.Base.White,
        borderTopColor: Color.Gray[300],
        borderTopWidth: 1,
    },
    gap: {
        width: "100%",
        height: 10,
        backgroundColor: Color.Gray[300],
    },
    viewRowBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    viewCard: {
        width: "100%",
        marginVertical: 20,
        paddingHorizontal: 15,
        gap: 10,
        backgroundColor: Color.Base.White,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Base.White,
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    },
});

export default DetailProductionScreen;
