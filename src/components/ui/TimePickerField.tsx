import Color from "@/constants/Color";
import { scale } from "@/utils/scaleSize";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

interface Props {
    label: string;
    value: string | null; // format: HH:mm
    onChange: (time: string) => void; // return format HH:mm
    disable?: boolean;
}

const TimePickerField: React.FC<Props> = ({
    label,
    value,
    onChange,
    disable = false,
}) => {
    const [showPicker, setShowPicker] = useState(false);

    // ubah string "HH:mm" jadi Date
    const parseToDate = (time: string | null): Date => {
        const now = new Date();

        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            now.setHours(0, 0, 0, 0);
            return now;
        }

        const [hour, minute] = time.split(":").map(Number);

        if (
            isNaN(hour) ||
            isNaN(minute) ||
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) {
            now.setHours(0, 0, 0, 0); // fallback ke 00:00
            return now;
        }

        now.setHours(hour, minute, 0, 0);
        return now;
    };

    // format Date ke "HH:mm"
    const formatToTimeString = (date: Date): string => {
        const h = date.getHours().toString().padStart(2, "0");
        const m = date.getMinutes().toString().padStart(2, "0");
        //   const s = date.getSeconds().toString().padStart(2, "0");
        return `${h}:${m}`;
    };

    const handleChange = (_: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            onChange(formatToTimeString(selectedDate));
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
                disabled={disable}
            >
                <ThemedText
                    type="Regular"
                    size="md"
                    color={value ? Color.Base.Black : Color.Gray[300]}
                    style={{ marginLeft: scale(4) }}
                    numberOfLines={1}
                >
                    {value || "Pilih Jam"}
                </ThemedText>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={parseToDate(value)}
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
