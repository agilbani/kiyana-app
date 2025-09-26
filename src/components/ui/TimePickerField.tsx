import Color from "@/constants/Color";
import { scale } from "@/utils/scaleSize";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

interface Props {
    label: string;
    value: Date | null;
    onChange: (date: Date) => void;
}

const TimePickerField: React.FC<Props> = ({ label, value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (_: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={{ marginBottom: 12 }}>
            <ThemedText
                type="Regular"
                size="md"
                color={Color.Gray[600]}
                style={{ marginLeft: scale(4) }}
            >
                {label}
            </ThemedText>

            <TouchableOpacity
                style={{
                    padding: 12,
                    marginTop: 6,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                }}
                onPress={() => setShowPicker(true)}
            >
                <ThemedText
                    type={"Regular"}
                    size="md"
                    color={value ? Color.Base.Black : Color.Gray[300]}
                    style={{ marginLeft: scale(4) }}
                    numberOfLines={1}
                >
                    {value
                        ? value.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "Pilih Jam"}
                </ThemedText>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="time"
                    is24Hour
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleChange}
                />
            )}
        </View>
    );
};

export default TimePickerField;
