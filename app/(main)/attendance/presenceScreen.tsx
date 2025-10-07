import {
    ThemedContainer,
    ThemedHeader,
    ThemedText
} from '@/components';
import Color from '@/constants/Color';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const optionType = [
    { name: "7 hari", value: "7" },
    { name: "14 hari", value: "14" },
    { name: "30 hari", value: "30" },
];

const PresenceScreen = () => {
    const [filter, setFilter] = useState<string>("");
    return (
        <ThemedContainer>
            <View style={styles.page}>
                <ThemedHeader
                    title='Daftar Kehadiran'
                />
                <View style={{flex: 1, padding: 16}}>
                    <View style={{
                        gap: 12,
                        width: '100%',
                    }}>
                        <ThemedText type='Medium' size='md'>
                            Daftar Kehadiran Anda
                        </ThemedText>
                        <FlatList
                            data={optionType}
                            horizontal
                            contentContainerStyle={{gap: 10}}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={{flexDirection: 'row'}}
                                    onPress={() => setFilter(item.value)}
                                >
                                    <View style={[styles.itemFilter, item.value === filter && {
                                        borderColor: Color.Red[500],
                                        backgroundColor: Color.Red[50]
                                    }]}>
                                        <ThemedText size='md' type='Medium'>
                                            {item.name}
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: Color.Gray[200],
                        padding: 16,
                        marginTop: 15,
                        gap: 10,
                        backgroundColor: Color.Base.White
                    }}>
                        <ThemedText size='md'>
                            Fulan bin fulan
                        </ThemedText>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <ThemedText size='md'>
                                Clock In pada:
                            </ThemedText>
                            <ThemedText size='md'>
                                08:00
                            </ThemedText>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <ThemedText size='md'>
                                Clock Out pada:
                            </ThemedText>
                            <ThemedText size='md'>
                                --:--
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        </ThemedContainer>
    )
}

const styles = StyleSheet.create({
    itemFilter: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderColor: Color.Gray[300],
        borderWidth: 1,
        borderRadius: 20,
    },
    page: {
        flex: 1,
        backgroundColor: Color.Base.White
    }
})

export default PresenceScreen;