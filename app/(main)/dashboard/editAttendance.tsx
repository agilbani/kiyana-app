import {
    CustomDropdown,
    ThemedButton,
    ThemedContainer,
    ThemedDatePicker,
    ThemedHeader,
    ThemedText,
    TimePickerField,
} from "@/components";
import Color from "@/constants/Color";
import {
    editAttendance,
    getInfoAttendance,
} from "@/services/attendanceService";
import { getAllEmployee } from "@/services/masterService";
import { ShowToastMessage } from "@/utils/toastMessage";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const user = [
    { name: "fulan", value: "fulan" },
    { name: "fulana", value: "fulana" },
];

interface Employee {
    id: number;
    user_id: string;
    selectedDate: string;
    clock_in: string;
    clock_out: string;
}

const defaultEmployee = (): Employee => ({
    id: Date.now(),
    user_id: "",
    selectedDate: "",
    clock_in: "",
    clock_out: "",
});

const EditAttendance = () => {
    const [employees, setEmployees] = useState<Employee[]>([defaultEmployee()]);
    const [listEmployee, setListEmployee] = useState<any>([]);
    const [loadingIds, setLoadingIds] = useState<number[]>([]); // track loading per employee
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingGetEmployee, setLoadingGetEmployee] = useState(false);

    const addMoreEmployee = () => {
        setEmployees((prev) => [...prev, defaultEmployee()]);
    };

    const onDelete = (id: number) => {
        if (employees.length > 1) {
            setEmployees((prev) => prev.filter((row) => row.id !== id));
        }
    };

    const handleChange = (id: number, field: keyof Employee, value: any) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === id ? { ...emp, [field]: value } : emp
            )
        );
    };

    const resetEmployee = (id: number) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === id ? { ...defaultEmployee(), id } : emp
            )
        );
    };

    const fetchInfoAttendance = async (emp: Employee) => {
        if (!emp.user_id || !emp.selectedDate) return;

        setLoadingIds((prev) => [...prev, emp.id]); // set loading
        const payload = {
            employeeId: emp.user_id,
            date: moment(emp.selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
        };

        try {
            const res = await getInfoAttendance(payload);
            // console.log("res presensi", res);

            if (res.success && res.data) {
                setEmployees((prev) =>
                    prev.map((e) =>
                        e.id === emp.id
                            ? {
                                  ...e,
                                  clock_in: res.data.clock_in
                                      ? res.data.clock_in
                                      : "",
                                  clock_out: res.data.clock_out
                                      ? res.data.clock_out
                                      : "",
                              }
                            : e
                    )
                );
            } else {
                Alert.alert(
                    "Data Tidak Ditemukan",
                    "Tidak ditemukan data presensi user pada tanggal yang dipilih"
                );
                resetEmployee(emp.id);
            }
        } catch (error) {
            Alert.alert("Error", "Terjadi kesalahan saat memuat data absensi");
            resetEmployee(emp.id);
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== emp.id)); // remove loading
        }
    };

    const getListEmployee = async () => {
        setLoadingGetEmployee(true);
        const res = await getAllEmployee();
        setLoadingGetEmployee(false);
        //   console.log("res employee", res);
        if (res.success) {
            let arr = [];
            for (let i = 0; i < res.data.length; i++) {
                arr.push({
                    name: `${res.data[i].first_name} ${res.data[i].last_name}`,
                    value: res.data[i].id,
                });
            }
            setListEmployee(arr);
        }
    };

    useEffect(() => {
        getListEmployee();
        setEmployees([defaultEmployee()]);
    }, []);

    // Refetch setiap kali user_id atau selectedDate berubah
    useEffect(() => {
        employees.forEach((emp) => {
            if (emp.user_id && emp.selectedDate) {
                fetchInfoAttendance(emp);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        employees
            .map((e) => `${e.id}-${e.user_id}-${e.selectedDate}`)
            .join(","),
    ]);

    const handleSubmit = async () => {
        const allFilled = employees.every(
            (emp) => emp.user_id && emp.selectedDate
        );

        if (!allFilled) {
            Alert.alert(
                "Peringatan",
                "Lengkapi semua data karyawan sebelum submit"
            );
            return;
        }

        const payload = employees.map((emp) => ({
            employee_id: emp.user_id,
            date: moment(emp.selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            clock_in: emp.clock_in,
            clock_out: emp.clock_out,
        }));

        //   console.log("Submitting employees:", payload);
        const obj = {
            attendances: payload,
        };
        // panggil API submit disini
        setLoadingSubmit(true);
        const res = await editAttendance(obj);
        //   console.log("res edit presensi", res);

        setLoadingSubmit(false);
        if (res.success) {
            ShowToastMessage(res.message);
            router.back();
        } else {
            ShowToastMessage(res.message);
        }
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
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const isLoading = loadingIds.includes(item.id);
                        return (
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
                                    items={listEmployee}
                                    onSelectItem={(selected: any) =>
                                        handleChange(
                                            item.id,
                                            "user_id",
                                            selected.value
                                        )
                                    }
                                    value={item.user_id}
                                    maxHeight={200}
                                />

                                <ThemedDatePicker
                                    label="Pilih tanggal pengajuan"
                                    onChange={(date: Date) =>
                                        handleChange(
                                            item.id,
                                            "selectedDate",
                                            date
                                        )
                                    }
                                />

                                {isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={Color.Red[500]}
                                    />
                                ) : (
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
                                                disable={
                                                    !item.clock_in &&
                                                    !item.clock_out
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
                                                disable={
                                                    !item.clock_in &&
                                                    !item.clock_out
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

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
                        );
                    }}
                    ListFooterComponent={
                        <View style={{ marginTop: 20 }}>
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
                                        Tambahkan karyawan
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 30 }} />
                            <ThemedButton
                                textColor={Color.Base.White}
                                title="Submit"
                                onPress={handleSubmit}
                                loading={loadingSubmit}
                            />
                        </View>
                    }
                />
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Color.Base.White,
    },
});

export default EditAttendance;
