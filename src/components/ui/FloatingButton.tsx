import Color from "@/constants/Color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface FloatingActionButtonProps {
    onPress: () => void;
    style?: ViewStyle;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    style,
}) => {
    return (
        <TouchableOpacity
            style={[styles.fab, style]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
    );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        backgroundColor: Color.Red[500],
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5, // shadow on Android
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
    },
});
