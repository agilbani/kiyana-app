// components/RunningText.tsx
import Color from "@/constants/Color";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface RunningTextProps {
    texts: string[]; // array kalimat (contoh: ["Kalimat 1", "Kalimat 2", "Kalimat 3"])
    duration?: number; // durasi tiap kalimat dalam ms (default 4000)
    textStyle?: object; // style tambahan untuk teks
}

const RunningText: React.FC<RunningTextProps> = ({
    texts,
    duration = 4000,
    textStyle,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;

    const currentText = texts[currentIndex];

    const animateText = () => {
        translateX.setValue(300); // mulai dari kanan layar
        Animated.timing(translateX, {
            toValue: -300, // bergerak ke kiri
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                // lanjut ke kalimat berikutnya
                setCurrentIndex((prev) => (prev + 1) % texts.length);
            }
        });
    };

    useEffect(() => {
        animateText();
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            <Animated.Text
                style={[
                    styles.text,
                    textStyle,
                    {
                        transform: [{ translateX }],
                    },
                ]}
                numberOfLines={1}
            >
                {currentText}
            </Animated.Text>
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
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        position: "absolute",
    },
});
