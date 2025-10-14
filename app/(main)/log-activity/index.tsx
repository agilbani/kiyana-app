import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type LogType = "system" | "status";
interface LogItem {
  id: string;
  user: string;
  role: string;
  time: string;   // ISO
  message: string;
  type: LogType;
}

const MOCK_DATA: LogItem[] = [
  { id: "1", user: "Alia Rahmawati", role: "Admin", time: "2025-09-19T08:30:00Z", message: "Telah Melakukan Absensi", type: "system" },
  { id: "2", user: "Ayu Pratiwi", role: "SPV", time: "2025-09-19T09:00:00Z", message: "Menolak Pengajuan izin Rizky", type: "system" },
  { id: "3", user: "Rani", role: "Staff", time: "2025-09-19T09:30:00Z", message: "Aduh lapar makanan belum dikirim :(", type: "status" },
  { id: "4", user: "Dede", role: "Staff", time: "2025-09-19T09:45:00Z", message: "Telah Mengeluarkan Ridwan Sewing!", type: "system" },
];

const LogActivity = () => {
  const insets = useSafeAreaInsets(); // <= kunci iOS
  const [logs, setLogs] = useState<LogItem[]>(MOCK_DATA);

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()),
    [logs]
  );

  const handleAddStatus = () => {
    Alert.prompt?.("Buat Status", "Tulis statusmu hari ini", (text) => {
      if (text?.trim()) {
        setLogs((prev) => [
          { id: Date.now().toString(), user: "Kamu", role: "Staff", time: new Date().toISOString(), message: text.trim(), type: "status" },
          ...prev,
        ]);
      }
    });
  };

  const handleMuteUser = (user: string) => {
    Alert.alert(
      "Mute Pengguna",
      `Ingin mute ${user}?`,
      [
        { text: "1 Hari", onPress: () => console.log("Muted 1 day") },
        { text: "2 Hari", onPress: () => console.log("Muted 2 days") },
        { text: "30 Hari", onPress: () => console.log("Muted 30 days") },
        { text: "Banned", onPress: () => console.log("User banned") },
        { text: "Batal", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: LogItem }) => {
    const isSystem = item.type === "system";
    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: isSystem ? "#EAF5FF" : "#F4F8EC" },
        ]}
        onLongPress={() => handleMuteUser(item.user)}
      >
        <View style={styles.row}>
          <Ionicons
            name={isSystem ? "briefcase-outline" : "chatbubble-outline"}
            size={18}
            color={isSystem ? "#007AFF" : "#6AA84F"}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.user}>{item.user}</Text>
          <Text style={styles.role}> ({item.role})</Text>
        </View>
        <Text style={[styles.message, { color: isSystem ? "#007AFF" : "#444" }]}>{item.message}</Text>
        <Text style={styles.time}>
          {new Date(item.time).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Text style={styles.header}>Status</Text>

      <FlatList
        data={sortedLogs}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingBottom: (insets.bottom || 0) + 96 }}
        // bikin iOS auto respect safe area/top bars
        {...(Platform.OS === "ios" ? { contentInsetAdjustmentBehavior: "automatic" as const } : {})}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          { bottom: 20 }, // naik sesuai home indicator iOS
        ]}
        onPress={handleAddStatus}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.addText}>Tambah Status Hari Ini</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LogActivity;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12 },
  header: { fontSize: 18, fontWeight: "700", color: "#007AFF", marginBottom: 8 },
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
    alignSelf: "center",
    backgroundColor: "#00B894",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 50,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  addText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});
