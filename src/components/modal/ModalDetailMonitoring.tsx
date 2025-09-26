import Color from "@/constants/Color";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../ui";

const { height } = Dimensions.get("window");

const ModalDetailMonitoring = ({ visible, onClose, data }: any) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.layout}>
                <View style={styles.content}>
                    <View style={styles.rowBetween}>
                        <ThemedText size="md" type="Medium">
                            Detail Produksi
                        </ThemedText>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                            onPress={onClose}
                        >
                            <AntDesign name="closecircle" size={18} />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            width: "100%",
                            height: height * 0.7,
                        }}
                    >
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 50 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View
                                style={[
                                    styles.rowBetween,
                                    {
                                        paddingBottom: 15,
                                        borderBottomWidth: 1,
                                        borderBottomColor: Color.Gray[200],
                                    },
                                ]}
                            >
                                <View style={{ gap: 4, width: "50%" }}>
                                    <ThemedText>Produk</ThemedText>
                                    <ThemedText size="md" type="SemiBold">
                                        {data?.item?.variant_metadata.sku} |{" "}
                                        {data?.item?.variant}
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        gap: 4,
                                        alignItems: "flex-end",
                                        width: "50%",
                                    }}
                                >
                                    <ThemedText>Batch</ThemedText>
                                    <ThemedText size="md" type="SemiBold">
                                        {data?.batch}
                                    </ThemedText>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.rowBetween,
                                    {
                                        paddingBottom: 15,
                                        borderBottomWidth: 1,
                                        borderBottomColor: Color.Gray[200],
                                        marginTop: 15,
                                    },
                                ]}
                            >
                                <View style={styles.viewInfo}>
                                    <ThemedText size="md">
                                        Jumlah Produksi
                                    </ThemedText>
                                    <ThemedText size="lg" type="SemiBold">
                                        {data?.qty}
                                    </ThemedText>
                                </View>
                                <View style={styles.viewInfo}>
                                    <ThemedText size="md">
                                        Barang Jadi
                                    </ThemedText>
                                    <ThemedText size="lg" type="SemiBold">
                                        {data?.entry_count}
                                    </ThemedText>
                                </View>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <ThemedText size="lg">Karyawan</ThemedText>
                                <View style={styles.cardEmployee}>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Tugas</ThemedText>
                                        <ThemedText>Tukang Potong</ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Nama Karyawan</ThemedText>
                                        <ThemedText>
                                            {data?.cutting_by?.name}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Mulai</ThemedText>
                                        <ThemedText>-</ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Akhir</ThemedText>
                                        <ThemedText>
                                            {moment(data?.cutting_at).format(
                                                "DD MMMM YYYY HH:mm"
                                            )}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.cardEmployee}>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Tugas</ThemedText>
                                        <ThemedText>Tukang Jahit</ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Nama Karyawan</ThemedText>
                                        <ThemedText>
                                            {data?.sewing_by
                                                ? data?.sewing_by?.name
                                                : "-"}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Mulai</ThemedText>
                                        <ThemedText>
                                            {data?.start_sewing_at
                                                ? moment(
                                                      data?.start_sewing_at
                                                  ).format("DD MMMM YYYY HH:mm")
                                                : "-"}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Akhir</ThemedText>
                                        <ThemedText>
                                            {data?.end_sewing_at
                                                ? moment(
                                                      data?.end_sewing_at
                                                  ).format("DD MMMM YYYY HH:mm")
                                                : "-"}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.cardEmployee}>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Tugas</ThemedText>
                                        <ThemedText>Finishing</ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Nama Karyawan</ThemedText>
                                        <ThemedText>
                                            {data?.finishing_by
                                                ? data?.finishing_by?.name
                                                : "-"}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Mulai</ThemedText>
                                        <ThemedText>
                                            {data?.start_finishing_at
                                                ? moment(
                                                      data?.start_finishing_at
                                                  ).format("DD MMMM YYYY HH:mm")
                                                : "-"}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.rowBetween}>
                                        <ThemedText>Akhir</ThemedText>
                                        <ThemedText>
                                            {data?.end_finishing_at
                                                ? moment(
                                                      data?.end_finishing_at
                                                  ).format("DD MMMM YYYY HH:mm")
                                                : "-"}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            padding: 15,
                            backgroundColor: Color.Base.White,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                            onPress={onClose}
                        >
                            <View
                                style={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 8,
                                    borderWidth: 1,
                                    borderColor: Color.Gray[200],
                                    borderRadius: 6,
                                }}
                            >
                                <ThemedText>Tutup</ThemedText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    cardEmployee: {
        paddingBottom: 15,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        marginTop: 10,
        borderRadius: 6,
        padding: 16,
        gap: 10,
    },
    viewInfo: {
        width: "49%",
        borderRadius: 12,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        gap: 4,
        borderColor: Color.Gray[200],
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    content: {
        width: "100%",
        borderRadius: 16,
        backgroundColor: Color.Base.White,
        padding: 16,
        gap: 15,
    },
    layout: {
        flex: 1,
        padding: 15,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ModalDetailMonitoring;
