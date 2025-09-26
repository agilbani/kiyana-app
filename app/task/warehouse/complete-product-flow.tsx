import {
    CustomDropdown,
    ThemedButton,
    ThemedContainer,
    ThemedHeader,
} from "@/components";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import {
    getDetailProduct,
    getSewingEmployee,
    proccessProduct,
} from "@/services/productionService";
import { getPositionBottom } from "@/utils/bottomPosition";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface employee {
    name: string;
    value: any;
}

interface detailDataInterface {
    reject_reason: any;
    id: string;
}

const steps = ["Pola", "Sample", "Hasil Jadi"];

const CompleteProductFlow = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [currentStep, setCurrentStep] = useState(1);
    const [images, setImages] = useState<{
        [key: number]: ImagePicker.ImagePickerAsset[];
    }>({
        0: [],
        1: [],
        2: [],
    });
    console.log("cek images", images);

    const [loading, setLoading] = useState(false);
    const [listEmployee, setListEmployee] = useState<Array<employee>>([]);
    const [selectedEmploye, setSelectedEmploye] = useState(undefined);
    const [dataDetail, setDataDetail] = useState<detailDataInterface>();

    // Pick image
    const pickImage = async () => {
        if (images[currentStep].length >= 2) {
            Alert.alert("Limit reached", "You can only upload up to 3 images.");
            return;
        }

        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                "Permission required",
                "Media library access is needed."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0]; // store the object
            setImages((prev) => ({
                ...prev,
                [currentStep]: [...prev[currentStep], selectedAsset],
            }));
        }
    };

    // Delete image
    const deleteImage = (uri: string) => {
        setImages((prev) => ({
            ...prev,
            [currentStep]: prev[currentStep].filter(
                (asset) => asset.uri !== uri
            ),
        }));
    };

    const proccessStep = async () => {
        console.log("cek img", images[currentStep]);
        const formData = new FormData();
        let formatFile = [];
        for (let i = 0; i < images[currentStep].length; i++) {
            formatFile.push({
                uri: images[currentStep][i].uri,
                name: images[currentStep][i].fileName,
                type: `${
                    images[currentStep][i].mimeType
                        ? images[currentStep][i].mimeType
                        : `image/${images[currentStep][i].fileName
                              .split(".")
                              .pop()
                              ?.toLowerCase()}`
                }`,
            });
        }
        if (currentStep === 0) {
            formatFile.forEach((item: any, index: any) => {
                formData.append(`pattern_images[${index}]`, item);
            });
            setLoading(true);
            const res = await proccessProduct(formData, id, "pattern-images");
            console.log("res pola", res);

            setLoading(false);
            if (res && res.success) {
                setCurrentStep(1);
            }
        } else if (currentStep === 1) {
            if (selectedEmploye === undefined) {
                return Alert.alert(
                    "Peringatan",
                    "Silahkan pilih karyawan yang bertugas terlebih dahulu"
                );
            }
            formatFile.forEach((item: any, index: any) => {
                formData.append(`cutting_images[${index}]`, item);
            });
            formData.append("sewing_by", selectedEmploye);
            setLoading(true);
            const res = await proccessProduct(formData, id, "cutting-images");
            console.log("res sample", res);
            setLoading(false);
            if (res && res.success) {
                setCurrentStep(2);
            }
        } else {
            formatFile.forEach((item: any, index: any) => {
                formData.append(`product_results[${index}]`, item);
            });
            setLoading(true);
            const res = await proccessProduct(
                formData,
                id,
                "product-result-images"
            );
            console.log("res result", res);
            setLoading(false);
            if (res && res.success) {
                if (dataDetail?.reject_reason !== null) {
                    ShowToastMessage("Perbaikan berhasil dilakukan");
                    router.back();
                } else {
                    ShowToastMessage("Berhasil menambahkan");
                    router.back();
                }
            }
        }
    };

    const getDetail = async () => {
        const getDetail = getDetailProduct(id);
        const getEmployee = getSewingEmployee();
        const [detail, employee] = await Promise.all([getDetail, getEmployee]);
        console.log("detail", detail);

        if (detail && detail.success) {
            setDataDetail(detail.data);
            if (detail.data.pattern_images !== null) {
                syncImagesFromBE(0, detail.data.pattern_images);
            }
            if (detail.data.cutting_images !== null) {
                syncImagesFromBE(1, detail.data.cutting_images);
            }
            if (detail.data.product_results !== null) {
                syncImagesFromBE(2, detail.data.product_results);
            }
            if (detail.data.sewing_by?.id) {
                setSelectedEmploye(detail.data.sewing_by?.id);
            }
            if (detail.data?.status === "Mulai") {
                setCurrentStep(0);
            } else if (detail.data?.status === "Pola") {
                setCurrentStep(0);
            } else if (detail.data?.status === "Sample") {
                setCurrentStep(1);
            } else {
                setCurrentStep(2);
            }
        }
        if (employee && employee.success) {
            if (employee.data.length > 0) {
                let data = [];
                for (let i = 0; i < employee.data.length; i++) {
                    data.push({
                        name: `${employee.data[i].first_name} ${employee.data[i].last_name}`,
                        value: employee.data[i].id,
                    });
                }
                setListEmployee(data);
            }
        }
    };

    const syncImagesFromBE = (step: number, imageUrls: string[]) => {
        setImages((prev) => ({
            ...prev,
            [step]: imageUrls.map((url) => ({
                uri: `${PATH}${url}`,
                width: 0, // optional, fill if BE provides
                height: 0, // optional
                type: "image", // or mime type if BE provides
                fileName: url.split("/").pop() || `step-${step}-img`,
            })),
        }));
    };

    const handleGoBack = (
        currentStep: number,
        setCurrentStep: (step: number) => void
    ) => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;

            setImages((prev) => ({
                ...prev,
                [currentStep]: [],
                // [prevStep]: [],
            }));

            setCurrentStep(prevStep);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Lihat Produk Baru" />
            <View style={{ flex: 1, padding: 16 }}>
                {/* Stepper */}
                <View style={styles.stepper}>
                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;

                        return (
                            <React.Fragment key={idx}>
                                <TouchableOpacity
                                    style={styles.stepContainer}
                                    onPress={() => setCurrentStep(idx)}
                                    disabled={idx > currentStep} // optional: only allow going back or current
                                >
                                    {isCompleted && (
                                        <View
                                            style={[
                                                styles.circle,
                                                isCompleted &&
                                                    styles.completedCircle,
                                                isActive &&
                                                    !isCompleted &&
                                                    styles.activeCircle,
                                            ]}
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={14}
                                                color="#fff"
                                            />
                                        </View>
                                    )}
                                    <Text
                                        style={[
                                            styles.stepText,
                                            isActive && styles.activeStepText,
                                            isCompleted &&
                                                styles.completedStepText,
                                        ]}
                                    >
                                        {step}
                                    </Text>
                                </TouchableOpacity>

                                {/* Line between steps */}
                                {idx < steps.length - 1 && (
                                    <View
                                        style={[
                                            styles.line,
                                            idx < currentStep &&
                                                styles.activeLine,
                                        ]}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </View>

                {currentStep === 1 && (
                    <View style={{ flexDirection: "column", marginTop: 10 }}>
                        <Text style={{ fontSize: 14 }}>Pilih karyawan</Text>
                        <CustomDropdown
                            items={listEmployee}
                            onSelectItem={(item) =>
                                setSelectedEmploye(item.value)
                            }
                            value={selectedEmploye}
                        />
                    </View>
                )}

                {/* Image Picker Section */}
                <Text style={styles.label}>
                    Upload Foto {steps[currentStep]} untuk melanjutkan (max 2)
                </Text>

                <FlatList
                    horizontal
                    style={{ width: "100%" }}
                    data={images[currentStep]}
                    keyExtractor={(asset) => asset.uri}
                    renderItem={({ item }) => (
                        <View style={styles.imageBox}>
                            <Image
                                source={{ uri: item.uri }}
                                style={styles.image}
                            />
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => deleteImage(item.uri)}
                            >
                                <Text style={{ color: "white", fontSize: 12 }}>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListFooterComponent={() =>
                        images[currentStep].length < 2 && (
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={pickImage}
                            >
                                <Text style={{ color: "#666" }}>+ Add</Text>
                            </TouchableOpacity>
                        )
                    }
                />
            </View>
            <View
                style={{
                    position: "absolute",
                    bottom: getPositionBottom().bottom,
                    backgroundColor: Color.Base.White,
                    padding: 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                {currentStep !== 0 ? (
                    <ThemedButton
                        title="Sebelumnya"
                        onPress={() =>
                            handleGoBack(currentStep, setCurrentStep)
                        }
                        style={{ flex: 1 }}
                    />
                ) : (
                    <View />
                )}
                <ThemedButton
                    title="Selanjutnya"
                    onPress={() => proccessStep()}
                    disabled={images[currentStep].length === 0}
                    loading={loading}
                    style={{ flex: 1 }}
                />
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    completedStepText: {
        color: "#007bff",
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
        backgroundColor: "#fff",
    },
    circleText: {
        fontSize: 12,
        color: "#666",
    },
    activeCircle: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    completedCircle: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    stepContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    container: { flex: 1, backgroundColor: "#fff" },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    step: {
        paddingHorizontal: 8,
    },
    stepText: {
        fontSize: 16,
        color: "#666",
    },
    activeStepText: {
        fontWeight: "bold",
        color: "#000",
    },
    activeStep: {}, // in case you want extra styling on active step container
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ddd",
        marginHorizontal: 4,
    },
    activeLine: {
        backgroundColor: "#007bff",
    },
    label: { fontSize: 16, marginVertical: 10 },
    addBtn: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    imageBox: {
        marginRight: 10,
    },
    image: { width: 120, height: 120, borderRadius: 8 },
    deleteBtn: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
    },
});

export default CompleteProductFlow;
