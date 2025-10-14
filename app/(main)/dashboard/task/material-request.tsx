import {
    ThemedButton,
    ThemedContainer,
    ThemedHeader,
    ThemedText,
    ThemedTextarea,
} from "@/components";
import Color from "@/constants/Color";
import { useState } from "react";
import { View } from "react-native";

const MaterialRequest = () => {
    const [request, setRequest] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <ThemedContainer>
            <ThemedHeader title="Permintaan Bahan" />
            <View style={{ flex: 1, padding: 16, gap: 16 }}>
                <ThemedText>
                    Kirimkan permintaan bahan dan aksesoris kepada admin,
                    berikan informasi yang jelas dan detail untuk permintaan
                    anda, seperti nama bahan, jumlah bahan, nama anda dan lokasi
                    anda.
                </ThemedText>
                <ThemedTextarea
                    label="Masukan permintaan"
                    value={request}
                    onChangeText={(text: string) => setRequest(text)}
                />
                <ThemedButton
                    textColor={Color.Base.White}
                    title="Kirim Permintaan"
                />
            </View>
        </ThemedContainer>
    );
};

export default MaterialRequest;
