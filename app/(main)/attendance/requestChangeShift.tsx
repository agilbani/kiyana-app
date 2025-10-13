import { ThemedButton, ThemedContainer, ThemedDatePicker, ThemedGap, ThemedHeader, ThemedText, ThemedTextarea, TimePickerField } from '@/components';
import Color from '@/constants/Color';
import { ChangeShiftForm } from '@/types/form';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from 'react-native';

const RequestChangeShift = () => {

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ChangeShiftForm>({
        mode: "onChange",
        defaultValues: {
            date: '',
            time: '',
            reason: ''
        },
    });

    const [loading, setLoading] = useState<boolean>(false);

    return (
        <ThemedContainer>
            <ThemedHeader title='Ajukan Pergantian Shift' />
            <View style={{padding: 16}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedText>
                        Nama Karyawan
                    </ThemedText>
                    <ThemedGap height="xxs" />
                    <View style={styles.viewDisabled}>
                        <ThemedText size='md'>
                            Fulan
                        </ThemedText>
                    </View>
                    <ThemedGap height="xl" />
                    <ThemedText>
                        Divisi Karyawan
                    </ThemedText>
                    <ThemedGap height="xxs" />
                    <View style={styles.viewDisabled}>
                        <ThemedText size='md'>
                            Produksi
                        </ThemedText>
                    </View>
                    <ThemedGap height="xl" />
                    <Controller
                        control={control}
                        name="date"
                        rules={{ required: "Tanggal pergantian shift harus diisi" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemedDatePicker
                                label='Pilih Tanggal'
                                onChange={onChange}
                                minimumDate
                            />
                        )}
                    />
                    <ThemedGap height="xl" />
                    <Controller
                        control={control}
                        name="time"
                        rules={{ required: "Jam pergantian shift harus diisi" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TimePickerField
                                label='Pilih Jam'
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <ThemedGap height="xl" />
                    <Controller
                        control={control}
                        name="reason"
                        rules={{ required: "Alasan pergantian shift harus diisi" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemedTextarea
                                label="Alasan"
                                placeholder="Tulis alasan pergantian shift"
                                multiline
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <ThemedGap height="xl" />
                    <ThemedButton
                        title='Submit'
                        textColor={Color.Base.White}
                    />
                </ScrollView>
            </View>
        </ThemedContainer>
    )
}

const styles = StyleSheet.create({
    viewDisabled: {
                    padding: 15,
                    borderWidth: 1,
                    borderColor: Color.Gray[200],
                    borderRadius: 8,
                    backgroundColor: Color.Gray[100]
                }
})

export default RequestChangeShift;