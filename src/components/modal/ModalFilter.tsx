import { CustomDropdown, ThemedButton, ThemedHeader } from "@/components";
import Color from "@/constants/Color";
import {
    batchOptions,
    filterStatus,
    filterStatusSelling,
    monthOptions,
} from "@/constants/Dummy/Options";
import { generateYears } from "@/utils/helpher";
import moment from "moment";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";

interface ModalFilterProps {
    visible: boolean;
    state: any;
    onClose: () => void;
    setState: (data: any) => void;
    listVariant: any;
    listProduct?: any;
    showBatch?: boolean;
    type?: string;
    onConfirm: (data: any) => void;
}

const ModalFilter: React.FC<ModalFilterProps> = ({
    visible,
    onClose,
    state,
    setState,
    listVariant,
    listProduct,
    showBatch = true,
    type = "production",
    onConfirm,
}) => {
    const years = generateYears();
    const [params, setParams] = useState({
        status: "",
        month: moment().format("MM"),
        year: moment().format("YYYY"),
        isBatchRejected: "Tidak",
        product: "",
        variant: "",
    });
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <ThemedHeader
                    title="Filter Monitoring"
                    onPressBack={() => onClose()}
                />
                <ScrollView
                    contentContainerStyle={{ padding: 16, gap: 15 }}
                    showsVerticalScrollIndicator={false}
                >
                    <CustomDropdown
                        label="Status"
                        items={
                            type === "production"
                                ? filterStatus
                                : filterStatusSelling
                        }
                        onSelectItem={(item: any) =>
                            setParams({ ...params, status: item.value })
                        }
                        value={params.status}
                        maxHeight={150}
                    />
                    <CustomDropdown
                        label="Bulan"
                        items={monthOptions}
                        onSelectItem={(item: any) =>
                            setParams({ ...params, month: item.value })
                        }
                        value={params.month}
                        maxHeight={150}
                    />
                    <CustomDropdown
                        label="Tahun"
                        items={years}
                        onSelectItem={(item: any) =>
                            setParams({ ...params, year: item.value })
                        }
                        value={params.year}
                        maxHeight={150}
                    />
                    {showBatch && (
                        <CustomDropdown
                            label="Batch Rejected"
                            items={batchOptions}
                            onSelectItem={(item: any) =>
                                setParams({
                                    ...params,
                                    isBatchRejected: item.value,
                                })
                            }
                            value={params.isBatchRejected}
                        />
                    )}
                    <CustomDropdown
                        label="Produk"
                        items={listProduct}
                        onSelectItem={(item: any) =>
                            setParams({ ...params, product: item.value })
                        }
                        value={params.product}
                    />
                    <CustomDropdown
                        label="Varian"
                        items={listVariant}
                        onSelectItem={(item: any) =>
                            setParams({ ...params, variant: item.value })
                        }
                        value={params.variant}
                    />
                    <ThemedButton
                        title="Terapkan"
                        onPress={() => onConfirm(params)}
                        textColor={Color.Base.White}
                        style={{ marginTop: 20 }}
                    />
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.Base.White,
    },
});

export default ModalFilter;
