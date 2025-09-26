import {
    CustomDropdown,
    ThemedButton,
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedInput,
    ThemedKeyboardAvoiding,
    ThemedText,
} from "@/components";
import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { getSewnEmployee } from "@/services/masterService";
import { assignSewnTask } from "@/services/productionService";
import GlobalStyles from "@/styles/common";
import { BatchInput } from "@/types/form";
import { scale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { IcClose, IcScan } from "@assets/icons";
import ILCamera from "@assets/images/permissions/ILCamera.png";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

interface Employee {
    name: string;
    value: string;
}

const AssignTaskSewn = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [listEmployee, setListEmployee] = useState<Employee[]>([]);

    const [currentBatch, setCurrentBatch] = useState<BatchInput>({
        batch: "",
        qty: 0,
    });
    const [batches, setBatches] = useState<BatchInput[]>([]);
    const [loadingAction, setLoadingAction] = useState<boolean>(false);

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
        if (!currentBatch.batch) return;
        const isExist = checkBatchExists(batches, currentBatch);
        if (!isExist) {
            setBatches((prev) => [...prev, currentBatch]);
            setCurrentBatch({
                ...currentBatch,
                batch: "",
                qty: 0,
            });
        } else {
            Alert.alert(
                "Gagal menambahkan Batch",
                "Barcode Batch sudah tersedia"
            );
        }
    };

    const getListSewn = async () => {
        const res = await getSewnEmployee();
        console.log("list sewn", res);
        if (res.success) {
            let arr = [];
            for (let i = 0; i < res.data.length; i++) {
                arr.push({
                    name: `${res.data[i].first_name} ${res.data[i].last_name}`,
                    value: res.data[i].id,
                });
            }
            setListEmployee(arr);
        }
    };

    const handleSubmit = async () => {
        let newBatch: string[] = [];
        batches.map((v) => {
            newBatch.push(v.batch);
        });
        console.log("cek newBatch", newBatch);
        const payload = {
            employee_id: selectedEmployee,
            batchs: newBatch,
        };
        setLoadingAction(true);
        const res = await assignSewnTask(payload);
        setLoadingAction(false);
        if (res.success) {
            ShowToastMessage("Daftar batch telah diberikan ke penjahit");
            router.back();
        }
    };

    useEffect(() => {
        getListSewn();
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
        <ThemedContainer>
            <StatusBar translucent barStyle="dark-content" />
            <ThemedHeader title="Tambahkan tugas" />
            <View style={styles.container}>
                <CustomDropdown
                    items={listEmployee}
                    onSelectItem={(item) => setSelectedEmployee(item.value)}
                    value={selectedEmployee}
                    label="Pilih Penjahit"
                />
                <ThemedGap height="md" />
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
        </ThemedContainer>
    );
};

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

export default AssignTaskSewn;
