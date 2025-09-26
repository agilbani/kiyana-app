import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ValidationModalProps {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({
    visible,
    message,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancel]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirm]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ValidationModal;

const styles = StyleSheet.create({
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
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
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
