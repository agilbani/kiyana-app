import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (selectedOptions: string[], reason: string) => void;
};

const OPTIONS = [
    {
        label: "Pola",
        value: "pola",
    },
    {
        label: "Hasil Potong",
        value: "hasil_potong",
    },
    {
        label: "Hasil Produk",
        value: "hasil_produk",
    },
];

export const RejectModal: React.FC<Props> = ({
    visible,
    onCancel,
    onConfirm,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [reason, setReason] = useState("");

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            setSelected(selected.filter((o) => o !== option));
        } else {
            setSelected([...selected, option]);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <Feather
                            name="alert-triangle"
                            size={28}
                            color="#DC3545"
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Tolak</Text>
                    <Text style={styles.message}>
                        Apakah Anda yakin ingin melakukan ini?
                    </Text>

                    {/* Checklist */}
                    <View style={styles.section}>
                        <Text style={styles.label}>
                            Perbaiki <Text style={{ color: "red" }}>*</Text>
                        </Text>
                        {OPTIONS.map((opt, index) => (
                            <TouchableOpacity
                                key={`${index}`}
                                style={styles.checkboxRow}
                                onPress={() => toggleOption(opt.value)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        selected.includes(opt.value) &&
                                            styles.checkboxSelected,
                                    ]}
                                >
                                    {selected.includes(opt.value) && (
                                        <Feather
                                            name="check"
                                            size={14}
                                            color="white"
                                        />
                                    )}
                                </View>
                                <Text style={styles.optionText}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Textarea */}
                    <View style={styles.section}>
                        <Text style={styles.label}>
                            Alasan Penolakan{" "}
                            <Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.textarea}
                            placeholder="Tuliskan alasan..."
                            value={reason}
                            onChangeText={(text) => setReason(text)}
                            multiline
                        />
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text
                                style={[styles.buttonText, styles.cancelText]}
                            >
                                Batal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => onConfirm(selected, reason)}
                        >
                            <Text style={styles.buttonText}>Konfirmasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },
    iconWrapper: {
        alignSelf: "center",
        backgroundColor: "#FDE7E9",
        padding: 12,
        borderRadius: 50,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontWeight: "600",
        marginBottom: 8,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#999",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    checkboxSelected: {
        backgroundColor: "#DC3545",
        borderColor: "#DC3545",
    },
    optionText: {
        fontSize: 14,
    },
    textarea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        minHeight: 80,
        padding: 8,
        textAlignVertical: "top",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    confirmButton: {
        backgroundColor: "#DC3545",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    cancelText: {
        color: "#000",
    },
});
