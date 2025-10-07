import { ThemedText } from "@/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const DetailLoan = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    console.log("id loan", id);

    return (
        <View style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText size="lg" type="SemiBold">
                    Detail Pinjaman
                </ThemedText>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 16,
    },
});

export default DetailLoan;
