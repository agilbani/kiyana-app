import Color from "@/constants/Color";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { ThemedText } from "../ui";

type Props = {
    visible: boolean;
    uri: string;
    onClose: () => void;
};

const { width, height } = Dimensions.get("window");

const ZoomableImage = ({ uri }: { uri: string }) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedX = useSharedValue(0);
    const savedY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            if (scale.value < 1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
            }
        });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedX.value + e.translationX;
            translateY.value = savedY.value + e.translationY;
        })
        .onEnd(() => {
            savedX.value = translateX.value;
            savedY.value = translateY.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector
                gesture={Gesture.Simultaneous(pinchGesture, panGesture)}
            >
                <Animated.Image
                    source={{ uri }}
                    style={[
                        { width, height, resizeMode: "contain" },
                        animatedStyle,
                    ]}
                />
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

export const ModalRejectImage: React.FC<Props> = ({
    visible,
    onClose,
    uri,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <ZoomableImage uri={uri} />
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <ThemedText size="md" type="Medium">
                        Tutup
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    closeBtn: {
        borderRadius: 6,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.Base.White,
        width: "30%",
        alignSelf: "center",
        paddingVertical: 15,
    },
    overlay: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ModalRejectImage;
