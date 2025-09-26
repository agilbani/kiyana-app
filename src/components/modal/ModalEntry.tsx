import { ThemedButton, ThemedInput, ThemedText } from "@/components";
import { entryProduction } from "@/services/productionService";
import { ShowToastMessage } from "@/utils/toastMessage";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface ModalEntryProps {
    visible: boolean;
    batch: string;
    onClose: () => void;
    onSuccessEntry: () => void;
}

const ModalEntry: React.FC<ModalEntryProps> = ({
    visible,
    batch,
    onClose,
    onSuccessEntry,
}) => {
    const [count, setCount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmitEntry = async () => {
        setLoading(true);
        const res = await entryProduction(batch, { qty: Number(count) });
        setLoading(false);
        if (res.success) {
            ShowToastMessage(res.message);
            onSuccessEntry();
        } else {
            ShowToastMessage(res.message);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={{ width: "10%" }} />
                        <View
                            style={{
                                width: "80%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText size="lg" type="Bold">
                                Masukkan Jumlah
                            </ThemedText>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onClose}
                            style={{ width: "10%", alignItems: "flex-end" }}
                        >
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <ThemedInput
                        label="Jumlah Produk Entry"
                        placeholder="Masukkan jumlah produk entry"
                        keyboardType="numeric"
                        value={count}
                        onChangeText={(text) => setCount(text)}
                        style={{ height: 45 }}
                    />
                    <ThemedButton
                        title="Submit"
                        onPress={handleSubmitEntry}
                        loading={loading}
                        disabled={count === "" || count === "0"}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ModalEntry;

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    container: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 15,
    },
    message: {
        fontSize: 16,
        // textAlign: "center",
        // marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    cancel: {
        backgroundColor: "#e0e0e0",
    },
    confirm: {
        backgroundColor: "#007bff",
    },
    cancelText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "bold",
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
