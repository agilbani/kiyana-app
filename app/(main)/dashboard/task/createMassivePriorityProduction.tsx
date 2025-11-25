import { ThemedDatePicker, ThemedHeader } from "@/components";
import CustomDropDown from "@/components/ui/CustomDropdown";
import Color from "@/constants/Color";
import {
    checkProductionStatus,
    createPriorityBulk,
    getCuttingEmployee,
} from "@/services/masterService";
import { usePositionBottom } from "@/utils/bottomPosition";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ItemData = {
    id: number;
    product?: any;
    total?: string;
    sku?: string;
    deadline?: string;
    production_status?: string;
};

const CreateMassivePriorityProduction = () => {
    const { bottom } = usePositionBottom();
    const router = useRouter();
    const [data, setData] = useState<ItemData[]>([{ id: Date.now() }]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [listEmployee, setListEmployee] = useState<any>([]);
    //  const sku = "K-QOF2SKBR";

    const requiredFields: (keyof ItemData)[] = [
        "product",
        "total",
        "sku",
        "deadline",
        "production_status",
    ];

    // fungsi validasi
    const isFormValid =
        data.length > 0 &&
        data.every((item) => requiredFields.every((key) => !!item[key]));

    const handleScan = async (barcode: string) => {
        if (activeIndex === null) return;
        setCameraVisible(false);

        try {
            // contoh request API setelah scan
            LoadingManager.show();
            const res = await checkProductionStatus(barcode);
            LoadingManager.hide();
            // console.log("res scan", res);

            const updated = [...data];
            updated[activeIndex] = {
                ...updated[activeIndex],
                sku: res.data.variant_info?.sku,
                product: `${res.data.variant_info?.sku} - ${res.data.variant_info?.color} - ${res.data.variant_info?.size}`,
                production_status: res.data.production_status,
            };
            setData(updated);
        } catch (err) {
            // console.error(err);
        }
    };

    const addItem = () => {
        setData((prev) => [...prev, { id: Date.now() }]);
    };

    const updateItem = (index: number, key: keyof ItemData, value: string) => {
        const updated = [...data];
        updated[index][key] = value;
        setData(updated);
    };

    const deleteItem = (index: number) => {
        // minimal 1 form tersisa
        if (data.length === 1) return alert("Minimal harus ada 1 data");
        setData((prev) => prev.filter((_, i) => i !== index));
    };

    const resetData = () => {
        setData([
            {
                id: Date.now(),
                product: "",
                total: "",
                sku: "",
                deadline: "",
                production_status: "",
            },
        ]);
    };

    const getEmployee = async () => {
        LoadingManager.show();
        const employeeList = await getCuttingEmployee();
        LoadingManager.hide();
        if (employeeList.success) {
            let arr = [];
            for (let i = 0; i < employeeList.data.length; i++) {
                arr.push({
                    name: `${employeeList.data[i].first_name} ${employeeList.data[i].last_name}`,
                    value: employeeList.data[i].id,
                });
            }
            setListEmployee(arr);
        }
    };

    const handleSubmit = async () => {
        const filteredData = data.filter(
            (item) =>
                item.deadline &&
                item.product &&
                item.production_status &&
                item.sku &&
                item.total
        );
        const payload = {
            cutting_by: selectedEmployee,
            data: filteredData,
        };
        //   console.log("payload", payload);
        LoadingManager.show();
        const res = await createPriorityBulk(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
            resetData();
        } else {
            ShowToastMessage(res.message);
        }
    };

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    useEffect(() => {
        getEmployee();
    }, []);

    if (!permission?.granted) {
        return (
            <View style={styles.center}>
                <Text>Meminta izin kamera...</Text>
            </View>
        );
    }

    return (
        <View
            style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
        >
            <StatusBar
                barStyle={"dark-content"}
                backgroundColor={Color.Base.White}
            />
            <ThemedHeader title="Penambahan Prioritas" />
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                <CustomDropDown
                    label="Nama Karyawan (Tukang Potong)"
                    items={listEmployee}
                    onSelectItem={(val: any) => setSelectedEmployee(val.value)}
                    value={selectedEmployee}
                    maxHeight={200}
                />
                {data.map((item, index) => (
                    <View
                        key={item.id}
                        style={[styles.card, { gap: 10, marginTop: 10 }]}
                    >
                        {/* Tombol Hapus */}
                        {data.length > 1 && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteItem(index)}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    ×
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => {
                                setActiveIndex(index);
                                setCameraVisible(true);
                            }}
                            //  onPress={() => {
                            //      setActiveIndex(index);
                            //      setTimeout(() => {
                            //          handleScan(sku);
                            //      }, 500);
                            //  }}
                        >
                            <Text style={styles.scanText}>📷 Scan Produk</Text>
                        </TouchableOpacity>

                        <View>
                            <Text>Nama Produk</Text>
                            <TextInput
                                placeholder="Produk | SKU"
                                style={styles.input}
                                value={item.product || ""}
                                editable={false}
                            />
                        </View>
                        <View>
                            <ThemedDatePicker
                                onChange={(date: any) =>
                                    updateItem(
                                        index,
                                        "deadline",
                                        moment(date, "DD-MM-YYYY").format(
                                            "YYYY-MM-DD"
                                        )
                                    )
                                }
                                minimumDate="today"
                            />
                        </View>

                        <View>
                            <Text>Masukkan jumlah yang ditambahkan</Text>
                            <TextInput
                                placeholder="Jumlah"
                                keyboardType="numeric"
                                style={styles.input}
                                value={item.total || ""}
                                onChangeText={(text) =>
                                    updateItem(index, "total", text)
                                }
                            />
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addItem}>
                    <Text style={styles.addText}>Tambah Data +</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={[styles.footer, { bottom }]}>
                <TouchableOpacity
                    style={[
                        styles.footerButton,
                        {
                            backgroundColor: isFormValid
                                ? "#0abf04"
                                : Color.Gray[300],
                        },
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid}
                >
                    <Text style={styles.footerText}>Simpan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.footerButton,
                        { backgroundColor: "#e53935" },
                    ]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.footerText}>Batalkan</Text>
                </TouchableOpacity>
            </View>
            {/* Modal Kamera */}
            <Modal visible={cameraVisible} animationType="slide">
                <CameraView
                    style={{ flex: 1 }}
                    onBarcodeScanned={({ data }) => {
                        handleScan(data);
                    }}
                />
                <TouchableOpacity
                    onPress={() => setCameraVisible(false)}
                    style={{
                        position: "absolute",
                        bottom: 50,
                        alignSelf: "center",
                        backgroundColor: "#0008",
                        padding: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "white" }}>Tutup Kamera</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f3f4f6" },
    deleteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#e53935",
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginTop: 3,
    },
    scanButton: {
        backgroundColor: "#e8f3ff",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
    },
    scanText: { color: "#007bff", fontWeight: "600" },
    addButton: {
        backgroundColor: "#009688",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },
    addText: { color: "white", fontWeight: "600" },
    footer: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: Color.Base.White,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    footerButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    footerText: { color: "white", fontWeight: "600" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default CreateMassivePriorityProduction;
