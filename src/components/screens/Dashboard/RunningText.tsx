import Color from "@/constants/Color";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    LayoutChangeEvent,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface RunningTextProps {
    texts: string[];
    duration?: number;
    textStyle?: object;
}

const RunningText: React.FC<RunningTextProps> = ({
    texts,
    duration = 4000,
    textStyle,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [textWidth, setTextWidth] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;

    const currentText = texts[currentIndex];

    const animateText = () => {
        if (!containerWidth || !textWidth) return;

        translateX.setValue(containerWidth);
        Animated.timing(translateX, {
            toValue: -textWidth,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                setCurrentIndex((prev) => (prev + 1) % texts.length);
            }
        });
    };

    useEffect(() => {
        animateText();
    }, [currentIndex, containerWidth, textWidth]);

    const onContainerLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    const onTextLayout = (e: LayoutChangeEvent) => {
        setTextWidth(e.nativeEvent.layout.width);
    };

    return (
        <View style={styles.container} onLayout={onContainerLayout}>
            <Animated.View
                style={[
                    styles.animatedTextWrapper,
                    { transform: [{ translateX }] },
                ]}
            >
                <Text style={[styles.text, textStyle]} onLayout={onTextLayout}>
                    {currentText}
                </Text>
            </Animated.View>
        </View>
    );
};

export default RunningText;

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        backgroundColor: Color.Base.White,
        borderRadius: 6,
        width: "100%",
        height: 40,
        justifyContent: "center",
    },
    animatedTextWrapper: {
        position: "absolute",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
        color: "#333",
    },
});
