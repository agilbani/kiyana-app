import { ThemedContainer, ThemedHeader } from '@/components';
import AttendanceStatistics from '@/components/screens/Attendance/AttendanceStatistics';
import Color from '@/constants/Color';
import { scale, verticalScale } from '@/utils/scaleSize';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const AttendanceSummary = () => {
    const data = {
        Hadir: 10,
        'Setengah Hari': 0,
        Sakit: 0,
        Izin: 0,
        Cuti: 0,
        Alfa: 0,
    }
    return (
        <ThemedContainer>
            <ThemedHeader
                title="Rekap Kehadiran"
            />
            <View style={{flex: 1, padding: 16}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <AttendanceStatistics data={data} />
                </ScrollView>
            </View>
        </ThemedContainer>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Color.Button["Surface-Primary"],
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(16),
        borderRadius: scale(8),
        marginHorizontal: scale(12),
        marginBottom: scale(16),
    },
    cardClock: {
        flex: 1,
        padding: scale(8),
        borderRadius: scale(8),
        borderWidth: 1,
    },
})

export default AttendanceSummary;