import { ThemedGap, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { scale } from "@/utils/scaleSize";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface DropdownItem {
    label: string;
    value: string;
}

interface DropdownProps {
    label?: string;
    items: DropdownItem[];
    value: string | undefined;
    onValueChange: (value: string) => void;
    placeholder?: string;
    styleContainer?: ViewStyle;
    stylePicker?: ViewStyle;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    items,
    value,
    onValueChange,
    placeholder = "Pilih opsi",
    styleContainer,
    stylePicker,
}) => {
    return (
        <View style={[styles.container, styleContainer]}>
            {label && (
                <>
                    <ThemedText
                        type="Regular"
                        size="sm"
                        color={Color.Gray[600]}
                        style={styles.spacing}
                    >
                        {label}
                    </ThemedText>
                    <ThemedGap height="xxs" />
                </>
            )}

            <View style={[styles.pickerWrapper, stylePicker]}>
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    style={styles.picker}
                >
                    {/* Placeholder item */}
                    <Picker.Item label={placeholder} value="" />

                    {items.map((item) => (
                        <Picker.Item
                            key={item.value.toString()}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default Dropdown;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: "#333",
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    picker: {
        height: 55,
        width: "100%",
    },
    spacing: {
        marginLeft: scale(4),
    },
});
