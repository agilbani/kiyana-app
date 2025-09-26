import { ThemedText } from "@/components";
import Color from "@/constants/Color";
import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Dimensions,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    data: any;
    isEditable: boolean;
    onCancel: () => void;
    onConfirm: (data: any) => void;
    onDelete: () => void;
    onEdit: (data: any) => void;
    type: string;
};

interface CustomerForm {
    name: string;
    contact: string;
    address: string;
}

const defaultValue = {
    name: "",
    contact: "",
    address: "",
};

export const ModalDetailCustomer: React.FC<Props> = ({
    visible,
    data,
    isEditable = true,
    type = "add",
    onCancel,
    onDelete,
    onEdit,
    onConfirm,
}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<CustomerForm>({
        mode: "onChange",
        values: data,
        defaultValues: defaultValue,
    });

    const onSubmit = (data: any) => {
        if (type === "add") {
            onConfirm(data);
        } else {
            onEdit(data);
        }
        reset();
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.rowBetween}>
                        <ThemedText
                            type="Medium"
                            size="lg"
                            color={Color.Base.Black}
                        >
                            Lihat Pelanggan
                        </ThemedText>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.btnClose}
                            onPress={onCancel}
                        >
                            <AntDesign
                                name="close"
                                color={Color.Gray[500]}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", marginTop: 15, gap: 20 }}>
                        <View style={{ gap: 10 }}>
                            <ThemedText type="Medium" size="md">
                                Nama
                            </ThemedText>
                            <Controller
                                control={control}
                                name="name"
                                rules={{
                                    required: "Nama Customer wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        placeholder="Masukkan nama customer"
                                        onChangeText={onChange}
                                        style={[
                                            styles.txtInput,
                                            {
                                                backgroundColor: isEditable
                                                    ? Color.Base.White
                                                    : Color.Gray[200],
                                            },
                                        ]}
                                        value={value}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ gap: 10 }}>
                            <ThemedText type="Medium" size="md">
                                Kontak
                            </ThemedText>
                            <Controller
                                control={control}
                                name="contact"
                                rules={{
                                    required: "Kontak Customer wajib diisi",
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        placeholder="Masukkan kontak customer"
                                        onChangeText={onChange}
                                        style={[
                                            styles.txtInput,
                                            {
                                                backgroundColor: isEditable
                                                    ? Color.Base.White
                                                    : Color.Gray[200],
                                            },
                                        ]}
                                        keyboardType="email-address"
                                        value={value}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ gap: 10 }}>
                            <ThemedText type="Medium" size="md">
                                Alamat
                            </ThemedText>
                            <Controller
                                control={control}
                                name="address"
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        placeholder="Masukkan alamat customer"
                                        onChangeText={onChange}
                                        style={[
                                            styles.txtInput,
                                            {
                                                backgroundColor: isEditable
                                                    ? Color.Base.White
                                                    : Color.Gray[200],
                                                height: 100,
                                                textAlignVertical: "top",
                                            },
                                        ]}
                                        value={value}
                                        multiline
                                    />
                                )}
                            />
                        </View>
                        {type === "add" ? (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.btnAdd}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <ThemedText
                                    type="Medium"
                                    size="md"
                                    color={Color.Base.White}
                                >
                                    Simpan
                                </ThemedText>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.viewBtn}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.btnAction}
                                    onPress={handleSubmit(onSubmit)}
                                >
                                    <AntDesign
                                        name="edit"
                                        size={15}
                                        color={Color.Purple[500]}
                                    />
                                    <ThemedText
                                        type="Medium"
                                        color={Color.Purple[500]}
                                    >
                                        Ubah
                                    </ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.btnAction}
                                    onPress={onDelete}
                                >
                                    <Feather
                                        name="trash-2"
                                        size={15}
                                        color={Color.Red[500]}
                                    />
                                    <ThemedText
                                        type="Medium"
                                        color={Color.Red[500]}
                                    >
                                        Hapus
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    btnAdd: {
        paddingVertical: 10,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.Green[500],
        marginBottom: 20,
    },
    viewBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 25,
        marginBottom: 20,
    },
    btnAction: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    txtInput: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Color.Gray[300],
        padding: 10,
    },
    btnClose: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 15,
        justifyContent: "space-between",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 15,
    },
});
