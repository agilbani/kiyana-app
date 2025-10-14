import {
    CustomDropdown,
    ThemedButton,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedKeyboardAvoiding,
    ThemedText,
} from "@/components";
import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp as authContext } from "@/context/AppContext";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { createProduction } from "@/services/productionService";
import { getTaskById } from "@/services/taskService";
import GlobalStyles from "@/styles/common";
import { BatchInput } from "@/types/form";
import { scale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { IcClose, IcScan } from "@assets/icons";
import ILCamera from "@assets/images/permissions/ILCamera.png";
import { CameraView } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const DetailTaskScreen = () => {
    const { user } = authContext();
    console.log("user [id]", user);

    const { id } = useLocalSearchParams<{ id: any }>();
    console.log("id detail", id);

    const [isScanning, setIsScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const [currentBatch, setCurrentBatch] = useState<BatchInput>({
        batch: "",
        qty: 0,
        production_item_id: "",
        cutting_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        cutting_by: user?.id,
    });

    const [batches, setBatches] = useState<BatchInput[]>([]);
    const [loadingAction, setLoadingAction] = useState<boolean>(false);
    const [detailData, setDetailData] = useState<any>({});
    const [listItems, setListItems] = useState<any>([]);
    const [loadings, setLoadings] = useState<boolean>(false);

    const { granted, loading, requestPermission } = useCameraPermission();

    useEffect(() => {
        if (!granted) {
            requestPermission();
        }
    }, [granted]);

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setIsScanning(false);
        setCurrentBatch((prev) => ({
            ...prev,
            batch: data,
        }));
    };

    function checkBatchExists(array: Array<BatchInput>, newObj: BatchInput) {
        return array.some((item) => item.batch === newObj.batch);
    }

    const handleAddBatch = () => {
        if (!currentBatch.batch || currentBatch.qty <= 0) return;
        const isExist = checkBatchExists(batches, currentBatch);
        if (!isExist) {
            setBatches((prev) => [...prev, currentBatch]);
            setCurrentBatch({
                ...currentBatch,
                batch: "",
                qty: 0,
                production_item_id: "",
            });
        } else {
            Alert.alert(
                "Gagal menambahkan Batch",
                "Barcode Batch sudah tersedia"
            );
        }
    };

    const handleSubmit = async () => {
        console.log("Submit All Batches: ", batches);
        setLoadingAction(true);
        const res = await createProduction(batches);
        console.log("resres", res);

        setLoadingAction(false);
        if (res.success) {
            ShowToastMessage(res.message);
            router.replace(ROUTES.DASHBOARD);
        } else {
            ShowToastMessage(res.message);
        }
    };

    const getDetail = async () => {
        setLoadings(true);
        const result = await getTaskById(id);
        setLoadings(false);
        if (result.success && result.data) {
            console.log("Task fetched:", result.data);
            setDetailData(result);
            const items = result.data.items
                .filter((v: any) => {
                    return v.status === "Sedang Dipotong";
                })
                .map((data: any) => ({
                    name: `${data.sku ?? ""} | ${data?.variant ?? ""} - ${
                        data.qty ?? ""
                    } ${data.unit ?? ""}`,
                    value: `${data.id}`,
                }));
            setListItems(items);
        } else {
            console.warn("Failed:", result.statusCode, result.message);
        }
    };
    console.log("cek listItems", listItems);
    console.log("cek currentBatch", currentBatch);

    useEffect(() => {
        getDetail();
    }, []);

    if (loading || granted === null) {
        return (
            <View style={[GlobalStyles.flex, GlobalStyles.center]}>
                <ActivityIndicator size="large" />
                <ThemedText type="Medium">Memeriksa izin kamera...</ThemedText>
            </View>
        );
    }

    if (!granted) {
        return (
            <PermissionScreen
                icon={ILCamera}
                title="Aktifkan Kamera"
                description="Aplikasi memerlukan kamera untuk selfie absensi."
                onAllow={requestPermission}
            />
        );
    }

    return (
        <View style={styles.page}>
            <ThemedHeader title="Pencatatan Mandiri" />
            <View style={styles.container}>
                <ThemedKeyboardAvoiding withFlex={false}>
                    <View style={GlobalStyles.rowCenter}>
                        <View style={GlobalStyles.flex}>
                            <ThemedInput
                                label="Barcode"
                                placeholder="Hasil scan atau input manual"
                                value={currentBatch.batch}
                                onChangeText={(text) =>
                                    setCurrentBatch({
                                        ...currentBatch,
                                        batch: text,
                                    })
                                }
                                style={{ height: 45 }}
                            />
                        </View>
                        <ThemedGap width="sm" />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.scanWrapper}
                            onPress={() => {
                                setIsScanning(true);
                                setScanned(false);
                            }}
                        >
                            <IcScan />
                        </TouchableOpacity>
                    </View>
                    <ThemedGap height="md" />
                    <CustomDropdown
                        items={listItems}
                        value={currentBatch.production_item_id}
                        onSelectItem={(item: any) => {
                            setCurrentBatch({
                                ...currentBatch,
                                production_item_id: `${item.value}`,
                            });
                        }}
                        label="Pilih Item"
                        labelSize="sm"
                        placeholderText="Pilih salah satu item"
                        containerStyle={{
                            borderRadius: 12,
                            width: "100%",
                            marginTop: -1,
                        }}
                        maxHeight={200}
                        widthdropdown="100%"
                    />
                    <ThemedGap height="md" />
                    <ThemedInput
                        label="Jumlah Selesai"
                        placeholder="Masukkan jumlah selesai"
                        keyboardType="numeric"
                        value={String(currentBatch.qty || "")}
                        onChangeText={(text) =>
                            setCurrentBatch({
                                ...currentBatch,
                                qty: parseInt(text) || 0,
                            })
                        }
                        style={{ height: 45 }}
                    />
                    <ThemedGap height="md" />
                    {/* <ThemedTextarea
                        label="Catatan"
                        placeholder="Tambahkan catatan (opsional)"
                        multiline
                        value={currentBatch.notes}
                        onChangeText={(text) =>
                            setCurrentBatch({ ...currentBatch, notes: text })
                        }
                    />
                    <ThemedGap height="xl" /> */}
                    <ThemedButton
                        title="Tambah Batch"
                        onPress={handleAddBatch}
                    />
                </ThemedKeyboardAvoiding>
                <ThemedGap height="xl" />
                <FlatList
                    data={batches}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item, index }) => (
                        <View style={styles.batchItem}>
                            <ThemedText type="Bold">
                                Batch #{index + 1}
                            </ThemedText>
                            <ThemedText>Barcode: {item.batch}</ThemedText>
                            <ThemedText>Qty: {item.qty}</ThemedText>
                            {/* <ThemedText>Catatan: {item.notes}</ThemedText> */}
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={{ marginVertical: scale(80) }}>
                            <ThemedText
                                color={Color.Text.Secondary}
                                style={GlobalStyles.center}
                            >
                                Belum ada batch ditambahkan
                            </ThemedText>
                        </View>
                    }
                />
                <ThemedGap height="xl" />
                <ThemedButton
                    title="Submit"
                    onPress={handleSubmit}
                    disabled={batches.length === 0}
                    loading={loadingAction}
                />
            </View>

            {/* Modal Kamera untuk Scan Barcode */}
            <Modal visible={isScanning} animationType="slide">
                <CameraView
                    onBarcodeScanned={
                        scanned ? undefined : handleBarcodeScanned
                    }
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417", "code128", "code39"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                <Pressable
                    onPress={() => setIsScanning(false)}
                    style={styles.closeScanner}
                >
                    <IcClose />
                </Pressable>
            </Modal>
        </View>
    );
};

export default DetailTaskScreen;

const styles = StyleSheet.create({
    page: {
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.flex,
    },
    container: {
        padding: scale(20),
        ...GlobalStyles.flex,
    },
    scanWrapper: {
        paddingTop: scale(16),
    },
    batchItem: {
        backgroundColor: Color.Background.Background,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        borderRadius: scale(12),
        padding: scale(12),
        marginBottom: scale(10),
    },
    closeScanner: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: scale(8),
        borderRadius: Radius.rounded,
    },
});
