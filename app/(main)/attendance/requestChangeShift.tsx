import {
    CustomDropdown,
    ThemedButton,
    ThemedDatePicker,
    ThemedGap,
    ThemedHeader,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import { useApp } from "@/context/AppContext";
import {
    getCurrentAttendance,
    getListAttendance,
    getListShift,
    postRequestChangeAttendance,
} from "@/services/attendanceService";
import { getMonthDateRange } from "@/utils/helpher";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";

const RequestChangeShift = () => {
    const { user, updateUser } = useApp();

    const [selectedShift, setSelectedShift] = useState("");
    const [reason, setReason] = useState("");
    const [currentAttendanceId, setCurrentAttendanceId] = useState("");
    const [toAttendanceId, setToAttendanceId] = useState("");
    const [listShift, setListShif] = useState<any>([]);
    const [listHost, setListHost] = useState<any>([]);
    const [listSignedHost, setListSignedHost] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<any>("");
    const [endDate, setEndDate] = useState<any>("");
    const [isPermanent, setIsPermanent] = useState<boolean>(false);

    const getAttendanceHost = async () => {
        const tomorrow = moment().add(1, "day");
        const rangeDate = getMonthDateRange();
        const paramsAll = {
            start_date: rangeDate?.startDate,
            end_date: rangeDate?.endDate,
            current: true,
        };
        const paramsTomorrow = {
            start_date: tomorrow.format("YYYY-MM-DD"),
            end_date: rangeDate?.endDate,
            current: false,
        };
        setLoading(true);
        const getCurrHost = getListAttendance(paramsAll);
        const getAllHost = getListAttendance(paramsTomorrow);
        setLoading(false);
        const [currentHost, allHost] = await Promise.all([
            getCurrHost,
            getAllHost,
        ]);
        console.log("cek currentHost", currentHost);
        console.log("cek allHost", allHost);

        if (currentHost.success) {
            let hostData = [];
            const datas = currentHost.data.filter((v: any) => {
                return v.start_time !== null && v.end_time !== null;
            });
            for (let i = 0; i < datas.length; i++) {
                hostData.push({
                    name: `${datas[i].date} - ${datas[i].start_time} - ${datas[i].end_time}`,
                    value: datas[i].id,
                });
            }

            setListSignedHost(hostData);
        }
        if (allHost.success) {
            let hostData = [];
            for (let i = 0; i < allHost.data.length; i++) {
                hostData.push({
                    name: `${allHost.data[i].date} - ${allHost.data[i].start_time} - ${allHost.data[i].end_time} - ${allHost.data[i].employee?.name}`,
                    value: allHost.data[i].id,
                });
            }

            setListHost(hostData);
        }
    };

    const getAttendanceShift = async () => {
        setLoading(true);
        const getCurrShift = getCurrentAttendance("shifted");
        const getAllShift = getListShift();
        setLoading(false);
        const [currShift, allShift] = await Promise.all([
            getCurrShift,
            getAllShift,
        ]);
        if (allShift.success) {
            let data = [];
            let filtered = allShift.data.filter((v: any) => {
                return v.id !== user?.shift_id;
            });
            for (let i = 0; i < filtered.length; i++) {
                data.push({
                    name: filtered[i].name,
                    value: filtered[i].id,
                });
            }
            setListShif(data);
        }
    };

    const validation = () => {
        let disabled = false;
        if (user?.is_host) {
            if (toAttendanceId === "") {
                disabled = true;
            }
            if (reason == "") {
                disabled = true;
            }
        } else {
            if (selectedShift === "") {
                disabled = true;
            }
            if (reason == "") {
                disabled = true;
            }
            if (startDate == "") {
                disabled = true;
            }
        }
        return disabled;
    };

    const onSubmit = async () => {
        let payload = user?.is_host
            ? {
                  from_attendance_id: currentAttendanceId,
                  to_attendance_id: toAttendanceId,
                  reason,
              }
            : {
                  from_shift_id: user?.shift_id,
                  to_shift_id: selectedShift,
                  reason,
                  start_date: startDate,
                  end_date: endDate,
                  is_temporary: endDate ? true : false,
              };

        setIsSubmit(true);
        const res = await postRequestChangeAttendance(
            payload,
            user?.is_host ? "host" : "shifted"
        );
        setIsSubmit(false);
        if (res.success) {
            Alert.alert(
                "Pengajuan Berhasil",
                "Permintaan perubahan jadwal berhasil dikirimkam, silahkan tunggu persetujuan admin.",
                [
                    {
                        text: "Oke",
                        onPress: () => router.back(),
                    },
                ]
            );
        } else {
            Alert.alert(
                "Pengajuan Gagal",
                "Permintaan perubahan jadwal gagal.",
                [
                    {
                        text: "Oke",
                        onPress: () => router.back(),
                    },
                ]
            );
        }
    };

    useEffect(() => {
        if (user?.is_host) {
            getAttendanceHost();
        } else {
            getAttendanceShift();
        }
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.Base.White,
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <ThemedHeader title="Ajukan Pergantian Shift" />
            <View style={{ padding: 16, flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <ThemedText>Nama Karyawan</ThemedText>
                    <ThemedGap height="xxs" />
                    <View style={styles.viewDisabled}>
                        <ThemedText size="md">{`${user?.first_name} ${user?.last_name}`}</ThemedText>
                    </View>
                    <ThemedGap height="xl" />
                    <ThemedText>Divisi Karyawan</ThemedText>
                    <ThemedGap height="xxs" />
                    <View style={styles.viewDisabled}>
                        <ThemedText size="md">
                            {user?.division?.name}
                        </ThemedText>
                    </View>
                    <ThemedGap height="xl" />
                    {/** View Shift */}
                    {!user?.is_host ? (
                        <View style={{ gap: 14 }}>
                            <CustomDropdown
                                label="Pilih Shift"
                                items={listShift}
                                onSelectItem={(selected: any) =>
                                    setSelectedShift(selected.value)
                                }
                                value={selectedShift}
                                maxHeight={200}
                            />
                            <ThemedDatePicker
                                label="Tanggal Mulai"
                                minimumDate="today"
                                onChange={(date: any) =>
                                    setStartDate(
                                        moment(date, "DD-MM-YYYY").format(
                                            "YYYY-MM-DD"
                                        )
                                    )
                                }
                            />
                            <ThemedDatePicker
                                label="Tanggal Selesai (kosongkan jika permanen)"
                                minimumDate="today"
                                onChange={(date: any) =>
                                    setEndDate(
                                        moment(date, "DD-MM-YYYY").format(
                                            "YYYY-MM-DD"
                                        )
                                    )
                                }
                            />
                        </View>
                    ) : (
                        <>
                            <CustomDropdown
                                label="Pilih Jadwal Awal"
                                items={listSignedHost}
                                onSelectItem={(selected: any) =>
                                    setCurrentAttendanceId(selected.value)
                                }
                                value={currentAttendanceId}
                                maxHeight={200}
                            />
                            <ThemedGap height="xl" />
                            <CustomDropdown
                                label="Pilih Jadwal Pengganti"
                                items={listHost}
                                onSelectItem={(selected: any) =>
                                    setToAttendanceId(selected.value)
                                }
                                value={toAttendanceId}
                                maxHeight={200}
                            />
                        </>
                    )}
                    <ThemedGap height="xl" />
                    {/** View Host */}

                    <ThemedTextarea
                        label="Alasan"
                        placeholder="Tulis alasan pergantian shift"
                        multiline
                        value={reason}
                        onChangeText={(text: string) => setReason(text)}
                    />
                    <ThemedGap height="xl" />
                    <ThemedButton
                        onPress={onSubmit}
                        disabled={validation()}
                        loading={isSubmit}
                        title="Submit"
                        textColor={Color.Base.White}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    viewDisabled: {
        padding: 15,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        borderRadius: 8,
        backgroundColor: Color.Gray[100],
    },
});

export default RequestChangeShift;
