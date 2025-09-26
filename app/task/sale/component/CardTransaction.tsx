import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import moment from "moment";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CardTransaction = ({ keyComponent, data, onPress }: any) => {
    console.log("datane", data);

    const getColorStatus = () => {
        let color = "";
        let obj = { color: "", bgColor: "", border: "" };
        switch (data.status) {
            case "Selesai":
                color = Color.Green[500];
                obj.color = Color.Green[500];
                obj.bgColor = Color.Green[50];
                obj.border = Color.Green[200];
                break;

            default:
                color = Color.Red[500];
                obj.color = Color.Green[500];
                obj.bgColor = Color.Green[50];
                obj.border = Color.Green[200];
                break;
        }
        return obj;
    };

    return (
        <TouchableOpacity
            key={keyComponent}
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.btnCard]}
        >
            <View style={styles.rowBetween}>
                <View />
                <ThemedText size="xs">
                    {moment(data.selling_at, "YYYY-MM-DD HH:mm:ss").format(
                        "DD MMMM YYYY"
                    )}
                </ThemedText>
            </View>
            <View style={styles.rowBetween}>
                <ThemedText size="md" type="Medium">
                    Nomor Pembelian
                </ThemedText>
                <ThemedText size="xs">{data.invoice_number}</ThemedText>
            </View>
            <View style={styles.rowBetween}>
                <ThemedText size="md" type="Medium">
                    Nama Pelanggan
                </ThemedText>
                <ThemedText size="xs">{data.customer.name}</ThemedText>
            </View>
            <View style={styles.rowBetween}>
                <ThemedText size="md" type="Medium">
                    Status
                </ThemedText>
                <View
                    style={[
                        styles.viewStatus,
                        {
                            backgroundColor: getColorStatus().bgColor,
                            borderColor: getColorStatus().border,
                        },
                    ]}
                >
                    <ThemedText size="xs" color={getColorStatus().color}>
                        {data.status}
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    viewStatus: {
        flexDirection: "row",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 6,
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    btnCard: {
        width: "100%",
        borderRadius: 6,
        marginTop: 15,
        padding: 15,
        backgroundColor: Color.Base.White,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        gap: 10,
        shadowColor: Color.Base.Black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.84,
        elevation: 2,
    },
});

export default CardTransaction;
