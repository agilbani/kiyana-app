import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

const TemporaryEmployee = () => {
    const [attendance, setAttendance] = useState<boolean>(true);
    const [sickLeave, setSickLeave] = useState<boolean>(false);
    const [permit, setPermit] = useState<boolean>(false);

    return (
        <ThemedContainer>
            <ThemedHeader title="Absensi anda" />
            <View style={{ flex: 1, padding: 16 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedText>
                        Silahkan perbaharui kehadiran anda untuk hari ini
                    </ThemedText>
                    <View style={styles.rowBetween}>
                        <ThemedText size="lg" type="Medium">
                            Hadir
                        </ThemedText>
                        <Switch
                            value={attendance}
                            onValueChange={(value: boolean) =>
                                setAttendance(value)
                            }
                        />
                    </View>
                    <View style={styles.rowBetween}>
                        <ThemedText size="lg" type="Medium">
                            Sakit
                        </ThemedText>
                        <Switch
                            value={sickLeave}
                            onValueChange={(value: boolean) =>
                                setSickLeave(value)
                            }
                        />
                    </View>
                    <View style={styles.rowBetween}>
                        <ThemedText size="lg" type="Medium">
                            Izin
                        </ThemedText>
                        <Switch
                            value={permit}
                            onValueChange={(value: boolean) => setPermit(value)}
                        />
                    </View>
                </ScrollView>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },
});

export default TemporaryEmployee;
