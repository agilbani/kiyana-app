import { CustomDropdown, ThemedText, ThemedTextarea } from "@/components";
import Color from "@/constants/Color";
import {
    getDataLog,
    postAddStatus,
    postMuteUser,
} from "@/services/masterService";
import LoadingManager from "@/utils/LoadingManager";
import { ShowToastMessage } from "@/utils/toastMessage";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

type Employee = {
    id: number;
    name: string;
    role: string;
    image_url: string | null;
};
interface LogItem {
    id: string;
    message: string;
    source: string;
    type: string;
    title: string;
    employee: Employee;
    created_at: string;
}

const option = [
    {
        name: "1 Hari",
        value: 1,
    },
    {
        name: "3 Hari",
        value: 3,
    },
    {
        name: "7 Hari",
        value: 7,
    },
    {
        name: "14 Hari",
        value: 14,
    },
    {
        name: "30 Hari",
        value: 30,
    },
];

const LogActivity = () => {
    const insets = useSafeAreaInsets(); // <= kunci iOS
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [status, setStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [selectedDuration, setSelectedDuration] = useState(0);
    const [modalMute, setModalMute] = useState(false);

    const handleAddStatus = async () => {
        const payload = {
            message: status,
            title: status,
        };
        setShowModal(false);
        LoadingManager.show();
        const res = await postAddStatus(payload);
        LoadingManager.hide();
        if (res.success) {
            getData();
        }
    };

    const handleMuteUser = (user: any) => {
        // employee.id
        //   console.log("selected user", user);
        setSelectedData(user);
        setModalMute(true);
        //   Alert.alert(
        //       "Mute Pengguna",
        //       `Ingin mute ${user?.employee?.name}?`,
        //       [
        //           { text: "1 Hari", onPress: () => console.log("Muted 1 day") },
        //           { text: "3 Hari", onPress: () => console.log("Muted 2 days") },
        //           {
        //               text: "7 Hari",
        //               onPress: () => console.log("Muted 30 days"),
        //           },
        //           //  { text: "Banned", onPress: () => console.log("User banned") },
        //           //  { text: "Batal", style: "cancel" },
        //       ],
        //       { cancelable: true },
        //   );
    };

    const renderItem = ({ item }: { item: LogItem }) => {
        const isSystem = item.source === "manual_status";
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    { backgroundColor: isSystem ? "#EAF5FF" : "#F4F8EC" },
                ]}
                activeOpacity={0.8}
                onLongPress={() => {
                    if (isSystem) handleMuteUser(item);
                }}
            >
                <View style={styles.row}>
                    <Ionicons
                        name={
                            !isSystem
                                ? "briefcase-outline"
                                : "chatbubble-outline"
                        }
                        size={18}
                        color={!isSystem ? "#007AFF" : "#6AA84F"}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.user}>{item.employee.name}</Text>
                    <Text style={styles.role}> ({item.employee.role})</Text>
                </View>
                <Text
                    style={[
                        styles.message,
                        { color: isSystem ? "#007AFF" : "#444" },
                    ]}
                >
                    {item.message}
                </Text>
                <Text style={styles.time}>
                    {new Date(item.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </Text>
            </TouchableOpacity>
        );
    };

    const getData = async () => {
        LoadingManager.show();
        const res = await getDataLog();
        LoadingManager.hide();
        //   console.log("res data log", res);

        if (res.success) {
            setLogs(res.data.data);
        }
    };

    const muteUser = async () => {
        setModalMute(false);
        const payload = {
            employee_id: selectedData?.employee?.id,
            duration_days: selectedDuration,
        };
        //   console.log("payload mute", payload);
        LoadingManager.show();
        const res = await postMuteUser(payload);
        LoadingManager.hide();
        if (res.success) {
            ShowToastMessage(res.message);
        } else {
            ShowToastMessage(res.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getData();
            return () => {};
        }, []),
    );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: Color.GreyscaleBlue[200],
                }}
            >
                <Text style={styles.header}>Status</Text>
            </View>
            <FlatList
                data={logs}
                renderItem={renderItem}
                style={{ flex: 1 }}
                keyExtractor={(it) => it.id}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                }}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
                style={[
                    styles.addButton,
                    //   { bottom: 20 }, // naik sesuai home indicator iOS
                ]}
                onPress={() => setShowModal(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="add-circle" size={22} color="#fff" />
                <Text style={styles.addText}>Tambah Status Hari Ini</Text>
            </TouchableOpacity>
            <Modal
                transparent
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.bgModal}>
                    <View style={styles.containerModal}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <ThemedText size="lg">Buat Status</ThemedText>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ padding: 10 }}
                                onPress={() => setShowModal(false)}
                            >
                                <AntDesign name="closecircle" size={20} />
                            </TouchableOpacity>
                        </View>
                        <ThemedTextarea
                            placeholder="Apa yang anda pikirkan?"
                            onChangeText={(text) => setStatus(text)}
                            value={status}
                        />
                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                {
                                    paddingTop: 12,
                                    marginTop: 12,
                                    width: 150,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 6,
                                    backgroundColor:
                                        status === ""
                                            ? Color.GreyscaleBlue[300]
                                            : Color.Green[500],
                                },
                            ]}
                            disabled={status === ""}
                            onPress={handleAddStatus}
                            activeOpacity={0.8}
                        >
                            <ThemedText
                                size="base"
                                type="Medium"
                                color={Color.Base.White}
                            >
                                Kirim
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                transparent
                visible={modalMute}
                onRequestClose={() => setModalMute(false)}
            >
                <View style={styles.bgModal}>
                    <View style={styles.containerModal}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <ThemedText size="lg">Bisukan Pengguna</ThemedText>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ padding: 10 }}
                                onPress={() => setModalMute(false)}
                            >
                                <AntDesign name="closecircle" size={20} />
                            </TouchableOpacity>
                        </View>
                        <CustomDropdown
                            label="Pilih Durasi"
                            items={option}
                            onSelectItem={(selected: any) =>
                                setSelectedDuration(selected.value)
                            }
                            value={selectedDuration}
                            maxHeight={200}
                        />
                        <View
                            style={{
                                marginTop: 20,
                                width: "100%",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.btnMute}
                                onPress={() => setModalMute(false)}
                            >
                                <ThemedText size="base">Batal</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[
                                    styles.btnMute,
                                    {
                                        borderWidth: 0,
                                        backgroundColor: Color.Green[400],
                                    },
                                ]}
                                onPress={() => muteUser()}
                            >
                                <ThemedText
                                    color={Color.Base.White}
                                    size="base"
                                >
                                    Bisukan
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default LogActivity;

const styles = StyleSheet.create({
    btnMute: {
        width: "49%",
        borderRadius: 6,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Color.GreyscaleBlue[300],
        justifyContent: "center",
        alignItems: "center",
    },
    containerModal: {
        backgroundColor: Color.Base.White,
        borderRadius: 8,
        padding: 12,
        width: "100%",
    },
    bgModal: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: "#007AFF",
        marginBottom: 8,
    },
    item: {
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#D9D9D9",
    },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    user: { fontWeight: "600", color: "#333" },
    role: { fontSize: 12, color: "#777" },
    message: { fontSize: 14, marginBottom: 4 },
    time: { fontSize: 11, color: "#999", textAlign: "right" },
    addButton: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        backgroundColor: "#00B894",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 50,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 4 },
        }),
    },
    addText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});
