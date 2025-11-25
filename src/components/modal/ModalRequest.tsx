import Color from "@/constants/Color";
import { AntDesign } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui";

const ModalRequest = ({ visible, onClose, onPressMats, onPressAcc }: any) => {
    return (
        <Modal transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.container}>
                <View
                    style={{
                        width: "100%",
                        borderRadius: 12,
                        padding: 14,
                        backgroundColor: Color.Base.White,
                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <ThemedText size="lg" type="Medium">
                            Pilih Opsi Permintaan
                        </ThemedText>
                        <TouchableOpacity activeOpacity={0.9} onPress={onClose}>
                            <AntDesign name="closecircle" size={20} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ paddingVertical: 10 }}
                        onPress={onPressMats}
                    >
                        <ThemedText size="md">Permintaan Bahan</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ paddingVertical: 10 }}
                        onPress={onPressAcc}
                    >
                        <ThemedText size="md">Permintaan Aksesoris</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
});

export default ModalRequest;
