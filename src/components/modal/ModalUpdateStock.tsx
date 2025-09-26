import { ThemedButton, ThemedInput, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { updateStockVariant } from "@/services/productVariantService";
import { ShowToastMessage } from "@/utils/toastMessage";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface ModalUpdateStockProps {
    visible: boolean;
    onClose: () => void;
    currentStock?: any;
    onSuccess: () => void;
}

const ModalUpdateStock: React.FC<ModalUpdateStockProps> = ({
    visible,
    onClose,
    currentStock,
    onSuccess,
}) => {
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);

    const updateStock = async () => {
        setLoading(true);
        const res = await updateStockVariant({ stock }, currentStock?.id);
        setLoading(false);
        if (res.success) {
            ShowToastMessage("Stock berhasil diperbaharui");
            onSuccess();
            setStock("");
        }
    };

    useEffect(() => {
        if (visible) {
            setStock(`${currentStock?.stock}`);
        }
    }, [visible]);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ThemedText size="lg" type="SemiBold">
                            Update Stok
                        </ThemedText>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.9}>
                            <AntDesign name="closecircle" size={20} />
                        </TouchableOpacity>
                    </View>
                    <ThemedInput
                        label="Masukkan Jumlah Stok"
                        value={stock}
                        placeholder="Masukkan jumlah stok"
                        style={{ height: 50 }}
                        onChangeText={(text) => setStock(text)}
                    />
                    <ThemedButton
                        style={{ marginTop: 15 }}
                        textColor={Color.Base.White}
                        title="Submit"
                        loading={loading}
                        disabled={loading}
                        onPress={updateStock}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
});

export default ModalUpdateStock;
