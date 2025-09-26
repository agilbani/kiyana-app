import {
    CustomDropdown,
    ThemedButton,
    ThemedContainer,
    ThemedHeader,
    ThemedText,
    TimePickerField,
} from "@/components";
import Color from "@/constants/Color";
import { scale } from "@/utils/scaleSize";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const user = [
    {
        name: "fulan",
        value: "fulan",
    },
    {
        name: "fulana",
        value: "fulana",
    },
];

interface Employee {
    id: number;
    user_id: string;
    clock_in: Date | null;
    clock_out: Date | null;
}

const EditAttendance = () => {
    const [type, setType] = useState("in");
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([
        {
            id: Date.now(),
            user_id: "",
            clock_in: null,
            clock_out: null,
        },
    ]);

    const addMoreEmployee = () => {
        setEmployees([
            ...employees,
            { id: Date.now(), user_id: "", clock_in: null, clock_out: null },
        ]);
    };

    const onDelete = (id: any) => {
        if (employees.length > 1) {
            setEmployees((prev: any) =>
                prev.filter((row: any) => row.id !== id)
            );
        }
    };

    const handleChange = (id: number, field: keyof Employee, value: any) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === id ? { ...emp, [field]: value } : emp
            )
        );
    };
    const handleSubmit = () => {
        // Convert Date objects to string for API
        const payload = employees.map((emp) => ({
            ...emp,
            clock_in: emp.clock_in ? emp.clock_in.toISOString() : null,
            clock_out: emp.clock_out ? emp.clock_out.toISOString() : null,
        }));

        console.log("Submitting employees:", payload);
        // Call your API here
    };
    return (
        <ThemedContainer>
            <ThemedHeader title="Perbaikan Absensi" />
            <View style={styles.page}>
                <FlatList
                    data={employees}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingHorizontal: 16,
                        paddingBottom: 100,
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                marginTop: 15,
                                gap: 10,
                                paddingBottom: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: Color.Gray[300],
                            }}
                        >
                            <CustomDropdown
                                label="Nama Karyawan"
                                items={user}
                                onSelectItem={(items: any) =>
                                    handleChange(
                                        item.id,
                                        "user_id",
                                        items.value
                                    )
                                }
                                value={item.user_id}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View style={{ width: "49%" }}>
                                    <TimePickerField
                                        label="Jam Masuk"
                                        value={item.clock_in}
                                        onChange={(date) =>
                                            handleChange(
                                                item.id,
                                                "clock_in",
                                                date
                                            )
                                        }
                                    />
                                </View>
                                <View style={{ width: "49%" }}>
                                    <TimePickerField
                                        label="Jam Keluar"
                                        value={item.clock_out}
                                        onChange={(date) =>
                                            handleChange(
                                                item.id,
                                                "clock_out",
                                                date
                                            )
                                        }
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignSelf: "center",
                                    marginBottom: 12,
                                }}
                                onPress={() => onDelete(item.id)}
                            >
                                <View
                                    style={{
                                        borderRadius: 8,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        backgroundColor: Color.Red[500],
                                    }}
                                >
                                    <ThemedText color={Color.Base.White}>
                                        Hapus Data
                                    </ThemedText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={{ marginTop: 20 }}>
                            {/* <Button
                                title="Add Employee"
                                onPress={addMoreEmployee}
                            /> */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignSelf: "center",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 8,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderWidth: 1,
                                        borderColor: Color.Gray[300],
                                    }}
                                    onPress={addMoreEmployee}
                                >
                                    <ThemedText
                                        type="SemiBold"
                                        size="sm"
                                        color={Color.Base.Black}
                                        numberOfLines={1}
                                    >
                                        Tambahkan ke produksi item
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 30 }} />
                            <ThemedButton
                                textColor={Color.Base.White}
                                title="Submit"
                                onPress={handleSubmit}
                            />
                        </View>
                    }
                />
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    spacing: {
        marginLeft: scale(4),
    },
    card: {
        width: "100%",
        borderRadius: 6,
        padding: 8,
        backgroundColor: Color.Base.White,
        elevation: 2,
        gap: 15,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Base.White,
    },
});

export default EditAttendance;
