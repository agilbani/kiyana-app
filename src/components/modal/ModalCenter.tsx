import Color from "@/constants/Color";
import { Modal, StyleSheet, View } from "react-native";

const ModalCenter = ({ visible, children, onClose }: any) => {
    return (
        <Modal transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.content}>{children}</View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        width: "95%",
        backgroundColor: Color.Base.White,
        padding: 16,
        borderRadius: 16,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
});

export default ModalCenter;
