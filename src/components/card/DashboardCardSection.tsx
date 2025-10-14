import Color from "@/constants/Color";
import { IcBell } from "@assets/index";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui";

const DashboardCardSection = ({ onPressLoan, onPressWithdraw, user }: any) => {
    return (
        <View style={styles.content}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ gap: 8 }}>
                    <ThemedText type="Medium">
                        Hi {`${user?.first_name} ${user?.last_name}`}
                    </ThemedText>
                    <ThemedText type="Medium" size="xl">
                        Semangat Bekerja
                    </ThemedText>
                </View>
                <TouchableOpacity activeOpacity={0.9} style={styles.viewBell}>
                    <IcBell width={27} height={27} color={Color.Yellow[500]} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    viewBell: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        borderWidth: 2,
        borderColor: Color.Purple[300],
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.Base.White,
    },
    content: {
        backgroundColor: Color.Gray[200],
        padding: 16,
    },
});

export default DashboardCardSection;
