import Color from "@/constants/Color";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    title: string;
    message: string;
    type: string;
    isLoading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export const ConfirmationModal: React.FC<Props> = ({
    visible,
    title,
    message,
    type = "confirmation",
    onCancel,
    onConfirm,
    isLoading,
}) => {
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
                    <View
                        style={[
                            styles.iconWrapper,
                            {
                                backgroundColor:
                                    type === "confirmation"
                                        ? "#E6F4EA"
                                        : Color.Red[100],
                            },
                        ]}
                    >
                        <Feather
                            name="alert-triangle"
                            size={28}
                            color={
                                type === "confirmation"
                                    ? "#28A745"
                                    : Color.Red[500]
                            }
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

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
                            style={[
                                styles.button,
                                {
                                    backgroundColor:
                                        type === "confirmation"
                                            ? "#28A745"
                                            : Color.Red[500],
                                },
                            ]}
                            disabled={isLoading}
                            onPress={onConfirm}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="red" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Konfirmasi
                                </Text>
                            )}
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
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    iconWrapper: {
        padding: 12,
        borderRadius: 50,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
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
        backgroundColor: "#28A745",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    cancelText: {
        color: "#000",
    },
});
