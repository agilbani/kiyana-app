import {
  ThemedBadge,
  ThemedButton,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type SubmissionStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface Submission {
  id: string;
  type: string;
  employee: string;
  date: string;
  status: SubmissionStatus;
}

const initialData: Submission[] = [
  {
    id: "1",
    type: "Kasbon",
    employee: "Budi Santoso",
    date: "2025-06-12T08:00:00Z",
    status: "Menunggu",
  },
  {
    id: "2",
    type: "Izin Pulang",
    employee: "Siti Aminah",
    date: "2025-06-11T13:00:00Z",
    status: "Disetujui",
  },
  {
    id: "3",
    type: "Izin Tidak Masuk",
    employee: "Rudi Hartono",
    date: "2025-06-10T10:30:00Z",
    status: "Ditolak",
  },
];

const SubmissionListScreen = () => {
  const [submissions, setSubmissions] = useState<Submission[]>(initialData);

  const handleUpdateStatus = (id: string, status: SubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const renderItem = useCallback(({ item }: { item: Submission }) => {
    const STATUS_COLOR: Record<SubmissionStatus, string> = {
      Menunggu: Color.Yellow[500],
      Disetujui: Color.Green[500],
      Ditolak: Color.Red[500],
    };

    const statusColor = STATUS_COLOR[item.status] || Color.Gray[400];

    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.card}>
        <View style={GlobalStyles.rowSpaceBetween}>
          <ThemedText type="Bold" size="md">
            {item.type}
          </ThemedText>
          <ThemedBadge
            text={item.status}
            backgroundColor={statusColor}
            textColor={Color.Base.White}
          />
        </View>

        <ThemedGap height="sm" />
        <ThemedText type="Medium" size="sm" color={Color.Gray[700]}>
          👤 {item.employee}
        </ThemedText>
        <ThemedText type="Medium" size="sm" color={Color.Gray[700]}>
          🗓️ {moment(item.date).format("DD MMMM YYYY, HH:mm")}
        </ThemedText>

        {item.status === "Menunggu" && (
          <>
            <ThemedGap height="md" />
            <View style={GlobalStyles.rowCenter}>
              <View style={GlobalStyles.flex}>
                <ThemedButton
                  title="Tolak"
                  variant="outline"
                  onPress={() => handleUpdateStatus(item.id, "Ditolak")}
                  style={styles.btnHalf}
                />
              </View>
              <ThemedGap width="sm" />
              <View style={GlobalStyles.flex}>
                <ThemedButton
                  title="Setujui"
                  onPress={() => handleUpdateStatus(item.id, "Disetujui")}
                  style={styles.btnHalf}
                />
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  }, []);

  return (
    <ThemedContainer>
      <ThemedHeader title="Daftar Pengajuan" />
      <View style={styles.container}>
        <FlatList
          data={submissions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <ThemedGap height="sm" />}
          scrollEnabled={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={Platform.OS === "android"}
        />
      </View>
    </ThemedContainer>
  );
};

export default SubmissionListScreen;

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    ...GlobalStyles.flex,
  },
  card: {
    backgroundColor: Color.Gray[50],
    padding: scale(14),
    borderWidth: 1,
    borderColor: Color.Gray[200],
    borderRadius: Radius.xs,
  },
  btnHalf: {
    height: scale(32),
  },
});
