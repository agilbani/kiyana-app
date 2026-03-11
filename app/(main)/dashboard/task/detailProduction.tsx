import {
    ThemedButton,
    ThemedGap,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import ModalEndFinishing from "@/components/modal/ModalEndFinishing";
import ModalEntry from "@/components/modal/ModalEntry";
import ModalReject from "@/components/modal/ModalReject";
import ModalRejectImage from "@/components/modal/ModalRejectImage";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import { useApp } from "@/context/AppContext";
import { updateStatusFixing } from "@/services/masterService";
import {
    approveProduction,
    getTaskByBatch,
    GetTaskByBatchResult,
    updateProduction,
} from "@/services/productionService";
import { getListProduction } from "@/services/taskService";
import GlobalStyles from "@/styles/common";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { scale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Alert,
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
    //  console.log("cek user prod", user);

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
    const [enableStartProccess, setEnableStartProccess] =
        useState<boolean>(false);

    const [modalEnd, setModalEnd] = useState(false);

    const handleStartSewing = async () => {
        if (!enableStartProccess) {
            Alert.alert(
                "Tidak bisa memulai proses",
                "Anda telah memiliki 2 atau lebih tugas yang sedang dikerjakan, selesaikan tugas anda terlebih dahulu.",
                [
                    {
                        text: "Oke",
                        onPress: () => router.back(),
                    },
                ],
            );
            return false;
        }
        setLoadingAction(true);
        const formData = new FormData();
        formData.append("sewing_by", user?.id);
        formData.append(
            "start_sewing_at",
            moment(new Date()).format("YYYY-MM-DD HH:mm"),
        );
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            formData,
        );
        setLoadingAction(false);
        if (res.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil memulai proses jahit ✅",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            getDetail();
        } else {
            Alert.alert("Gagal memulai proses jahit", res.message);
        }
    };

    const handleFinishSewing = async () => {
        setLoadingAction(true);
        const formData = new FormData();
        formData.append("sewing_by", user?.id);
        formData.append(
            "end_sewing_at",
            moment(new Date()).format("YYYY-MM-DD HH:mm"),
        );
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            formData,
        );
        setLoadingAction(false);
        if (res?.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil menyelesaikan proses jahit ✅",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            router.back();
        } else {
            Alert.alert("Gagal memulai proses jahit", res.message);
        }
    };

    const handleStartFinishing = async () => {
        if (!enableStartProccess) {
            Alert.alert(
                "Tidak bisa memulai proses",
                "Anda telah memiliki 2 atau lebih tugas yang sedang dikerjakan, selesaikan tugas anda terlebih dahulu.",
                [
                    {
                        text: "Oke",
                        onPress: () => router.back(),
                    },
                ],
            );
            return false;
        }
        setLoadingAction(true);
        const body = {
            finishing_by: Number(user?.id),
            start_finishing_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        const formData = new FormData();
        formData.append("finishing_by", user?.id);
        formData.append(
            "start_finishing_at",
            moment(new Date()).format("YYYY-MM-DD HH:mm"),
        );
        const res = await updateProduction(
            detailProduction?.data?.batch!,
            formData,
        );
        //   console.log("res finishing", res);

        setLoadingAction(false);
        if (res.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Berhasil memulai proses finishing",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            getDetail();
        } else {
            Alert.alert("Gagal memulai proses jahit", res.message);
        }
    };

    const handleFinishFinishing = async (data: any) => {
        setModalEnd(false);
        //   setLoadingAction(true);
        const body = {
            finishing_by: Number(user?.id),
            end_finishing_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        const formData = new FormData();
        formData.append("finishing_by", user?.id);
        formData.append(
            "end_finishing_at",
            moment(new Date()).format("YYYY-MM-DD HH:mm"),
        );
        data.forEach((approval: any, index: number) => {
            formData.append(`approvals[${index}][qty]`, approval.qty);
            formData.append(`approvals[${index}][status]`, approval.status);
            formData.append(
                `approvals[${index}][attachments][0]`,
                approval.attachments,
            );
        });
        //   console.log("formdata finish", formData);

        const res = await updateProduction(
            detailProduction?.data?.batch!,
            formData,
        );
        //   console.log("res finish", res);

        setLoadingAction(false);
        if (res?.success) {
            ToastAndroid.showWithGravityAndOffset(
                "Proses finishing selesai",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            router.back();
        } else {
            Alert.alert("Gagal memulai proses jahit", res.message);
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

    const startFixing = async (batch: string, stage: string) => {
        //   console.log("lalal start");

        const payload = {
            batch: batch,
            stage: stage,
            status: "Being Repaired",
        };
        LoadingManager.show();
        const res = await updateStatusFixing(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            getDetail();
        } else {
            ShowToastMessage(res.message);
        }
    };

    const endFixing = async (batch: string, stage: string) => {
        const payload = {
            batch: batch,
            stage: stage,
            status: "Finished Repaired",
        };
        LoadingManager.show();
        const res = await updateStatusFixing(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            getDetail();
        } else {
            ShowToastMessage(res.message);
        }
    };

    async function getDetail() {
        setLoading(true);
        const result = await getTaskByBatch(id);
        //   console.log("res task", result);

        setLoading(false);
        if (result.success && result.data) {
            setDetailProduction(result);
            // console.log("Task fetched:", result.data);
        } else {
            console.warn("Failed:", result.statusCode, result.message);
        }
    }

    const checkStatus = async () => {
        let payload = {
            stage: user?.role?.name === "Penjahit" ? "sewing" : "finishing",
        };
        if (user?.role?.name === "Penjahit") {
            payload.sewing_by = user?.id;
            payload.beingSewn = true;
        } else {
            payload.finishing_by = user?.id;
            payload.beingFinishing = true;
        }
        const res = await getListProduction(payload);
        //   console.log("res proses", res);
        if (res.length >= 3) {
            setEnableStartProccess(false);
        } else {
            setEnableStartProccess(true);
        }
    };

    function showButtonByRole() {
        const status = detailProduction?.data?.status;
        if (user?.role?.name === "Penjahit") {
            let isRejected = false;
            if (detailProduction?.data.finishingBy !== null) {
                if (detailProduction?.data?.approvals.sewing === null) {
                    isRejected = false;
                } else if (
                    detailProduction?.data?.approvals.finishing?.status !==
                        "Approved" &&
                    detailProduction?.data?.approvals.sewing?.status !==
                        "Finished Repaired"
                ) {
                    isRejected = true;
                } else {
                    isRejected = false;
                }
            } else {
                isRejected = false;
            }
            const labelReject =
                detailProduction?.data?.approvals?.sewing?.status ?? "";
            if (
                status === "Selesai Dipotong" ||
                status === "Sedang Dijahit" ||
                isRejected
            ) {
                return (
                    <ButtonRoleSewing
                        data={data}
                        onStartSewing={() => {
                            if (isRejected) {
                                startFixing(
                                    detailProduction?.data?.batch ?? "",
                                    "sewing",
                                );
                            } else {
                                handleStartSewing();
                            }
                        }}
                        onFinishSewing={() => {
                            if (isRejected) {
                                endFixing(
                                    detailProduction?.data?.batch ?? "",
                                    "sewing",
                                );
                            } else {
                                handleFinishSewing();
                            }
                        }}
                        loading={loadingAction}
                        isRejected={isRejected}
                        labelReject={labelReject}
                    />
                );
            }
        } else if (user?.role?.name === "Finishing") {
            const isRejected =
                detailProduction?.data?.approvals.finishing === null
                    ? false
                    : detailProduction?.data?.approvals.finishing?.status ===
                            "Reject (Bisa Diperbaiki)" ||
                        detailProduction?.data?.approvals.finishing?.status ===
                            "Being Repaired"
                      ? true
                      : false;
            const labelReject =
                detailProduction?.data?.approvals.finishing?.status;

            if (
                status === "Selesai Dijahit" ||
                status === "Proses Finishing" ||
                isRejected
            ) {
                return (
                    <ButtonRoleFinishing
                        data={data}
                        onPressStart={() => {
                            //  if (isRejected) {
                            //      startFixing(
                            //          detailProduction?.data?.batch ?? "",
                            //          "finishing"
                            //      );
                            //  } else {
                            //      handleStartFinishing();
                            //  }
                            handleStartFinishing();
                        }}
                        onPressFinish={() => {
                            //  if (isRejected) {
                            //      endFixing(
                            //          detailProduction?.data?.batch ?? "",
                            //          "finishing"
                            //      );
                            //  } else {
                            //      //   handleFinishFinishing();
                            //      setModalEnd(true);
                            //  }
                            setModalEnd(true);
                        }}
                        loading={loadingAction}
                        // isRejected={isRejected}
                        // labelReject={labelReject}
                    />
                );
            }
        } else if (user?.role?.name === "Staff Gudang") {
            if (status === "Complated" || status === "Approved") {
                return (
                    <ButtonRoleWarehouse
                        data={data}
                        onPressApprove={() => {
                            setShowModalEntry(true);
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
            checkStatus();
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
    //  console.log("task detail", data);

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
                            <ThemedText>{data?.qty} pcs</ThemedText>
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
                            <ThemedText>{data?.qty} pcs</ThemedText>
                        </View>
                    </View>
                    {detailProduction.data?.approvals.finishing !== null &&
                        detailProduction.data?.approvals?.finishing?.status ===
                            "Reject (Bisa Diperbaiki)" &&
                        user?.role?.name === "Penjahit" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 10,
                                }}
                            >
                                <View />
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={{
                                        borderRadius: 6,
                                        paddingVertical: 4,
                                        paddingHorizontal: 8,
                                        backgroundColor: Color.Green[500],
                                    }}
                                    onPress={() => {
                                        if (
                                            detailProduction.data?.approvals
                                                ?.finishing?.status ===
                                            "Reject (Bisa Diperbaiki)"
                                        ) {
                                            startFixing(
                                                detailProduction?.data?.batch ??
                                                    "",
                                                "sewing",
                                            );
                                        } else {
                                            if (
                                                detailProduction.data?.approvals
                                                    ?.finishing?.status ===
                                                "Being Repaired"
                                            ) {
                                                endFixing(
                                                    detailProduction?.data
                                                        ?.batch ?? "",
                                                    "sewing",
                                                );
                                            }
                                        }
                                    }}
                                >
                                    <ThemedText color={Color.Base.White}>
                                        {detailProduction.data?.approvals
                                            ?.finishing?.status ===
                                        "Reject (Bisa Diperbaiki)"
                                            ? "Mulai"
                                            : "Selesai"}{" "}
                                        Perbaikan
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}
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
            <ModalEndFinishing
                show={modalEnd}
                onClose={() => setModalEnd(false)}
                submit={(data: any) => {
                    //   console.log("data end finishing", data);
                    handleFinishFinishing(data);
                }}
            />
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
    isRejected,
    labelReject,
}: any) => {
    return (
        <View style={styles.viewRowBtn}>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title={`Mulai ${isRejected ? "Perbaikan" : "Jahit"}`}
                    style={{ marginTop: 10 }}
                    disabled={
                        isRejected && labelReject !== "Being Repaired"
                            ? false
                            : data.start_sewing_at !== null
                    }
                    onPress={onStartSewing}
                    loading={loading}
                />
            </View>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title={`Selesai ${isRejected ? "Perbaikan" : "Jahit"}`}
                    style={{ marginTop: 10 }}
                    disabled={
                        isRejected && labelReject !== "Being Repaired"
                            ? // && labelReject.toLowerCase().includes("bisa diperbaiki")
                              true
                            : labelReject === "Being Repaired"
                              ? false
                              : data.start_sewing_at === null ||
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
    isRejected,
    labelReject,
}: any) => {
    return (
        <View style={styles.viewRowBtn}>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title={`Mulai Proses ${
                        isRejected ? "Perbaikan" : "Finishing"
                    }`}
                    style={{ marginTop: 10 }}
                    disabled={
                        isRejected &&
                        labelReject.toLowerCase().includes("bisa diperbaiki")
                            ? false
                            : data.start_finishing_at !== null
                    }
                    onPress={onPressStart}
                    loading={loading}
                />
            </View>
            <View style={{ width: "48%" }}>
                <ThemedButton
                    title={`Selesai ${isRejected ? "Perbaikan" : "Finishing"}`}
                    style={{ marginTop: 10 }}
                    disabled={
                        isRejected &&
                        labelReject.toLowerCase().includes("bisa diperbaiki")
                            ? true
                            : data.start_finishing_at === null
                    }
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
            <View style={{ width: "100%" }}>
                <ThemedButton
                    title={"Proses Entry"}
                    style={{ marginTop: 10, borderRadius: 6 }}
                    // disabled={true}
                    onPress={onPressApprove}
                />
            </View>
            {/* <View style={{ width: "48%" }}>
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
            </View> */}
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
