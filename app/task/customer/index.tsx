import { ThemedContainer, ThemedHeader, ThemedText } from "@/components";
import { ConfirmationModal } from "@/components/modal/ModalConfirmation";
import { ModalDetailCustomer } from "@/components/modal/ModalDetailCustomer";
import Color from "@/constants/Color";
import {
    createCustomer,
    deleteCustomer,
    editCustomer,
    getCustomer,
} from "@/services/customerService";
import { Customer } from "@/types/customer";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const initialData = {
    name: "",
    contact: "",
    address: "",
    id: "",
};

const ListCustomer = () => {
    const [listCustomer, setListCustomer] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState({
        ...initialData,
    });
    const [showModal, setShowModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [type, setType] = useState("add");

    const getData = async () => {
        setLoading(true);
        const res = await getCustomer();
        setLoading(false);
        //   console.log("res customer", res);
        if (res.success) {
            setListCustomer(res.data);
        }
    };

    const handleAddCustomer = async (data: any) => {
        //   console.log("customer form add", data);
        setLoadingAdd(true);
        const res = await createCustomer(data);
        setLoadingAdd(false);
        if (res.success) {
            getData();
        }
    };

    const handleEditCustomer = async (data: any) => {
        //   console.log("customer form add", data);
        setLoadingAdd(true);
        const res = await editCustomer(data, selectedCustomer?.id);
        setLoadingAdd(false);
        if (res.success) {
            getData();
        }
    };

    const handleDeleteCustomer = async () => {
        setLoadingAdd(true);
        const res = await deleteCustomer(selectedCustomer?.id);
        setLoadingAdd(false);
        if (res.success) {
            getData();
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <ThemedContainer>
            <ModalDetailCustomer
                visible={showModal}
                onCancel={() => setShowModal(false)}
                data={selectedCustomer}
                isEditable={isEditable}
                onConfirm={(data: any) => {
                    setShowModal(false);
                    handleAddCustomer(data);
                }}
                onDelete={() => {
                    setShowModal(false);
                    setShowConfirmation(true);
                }}
                onEdit={(data: any) => {
                    setShowModal(false);
                    handleEditCustomer(data);
                }}
                type={type}
            />
            <ConfirmationModal
                visible={showConfirmation}
                type="reject"
                onCancel={() => setShowConfirmation(false)}
                onConfirm={() => {
                    setShowConfirmation(false);
                    handleDeleteCustomer();
                }}
                title="Hapus Pelanggan"
                message="Apakah anda yakin ingin melakukan ini?"
            />
            <View style={styles.container}>
                <ThemedHeader title="Customer" />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setType("add");
                            setTimeout(() => {
                                setShowModal(true);
                            }, 500);
                        }}
                        activeOpacity={0.9}
                        style={[
                            styles.btnAdd,
                            {
                                backgroundColor: loadingAdd
                                    ? Color.Gray[300]
                                    : Color.Purple[600],
                            },
                        ]}
                        disabled={loadingAdd}
                    >
                        <ThemedText size="md" color={Color.Base.White}>
                            Tambah Customer
                        </ThemedText>
                        {loadingAdd && (
                            <ActivityIndicator
                                color={Color.Gray[500]}
                                size="small"
                                style={{ marginLeft: 8 }}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <ActivityIndicator color="red" size="large" />
                    </View>
                ) : (
                    <ScrollView
                        style={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {listCustomer.map((v, index) => (
                            <TouchableOpacity
                                key={`${index}`}
                                activeOpacity={0.9}
                                style={styles.btnCard}
                                onPress={() => {
                                    setType("edit");
                                    setSelectedCustomer(v);
                                    setTimeout(() => {
                                        setShowModal(true);
                                    }, 500);
                                }}
                            >
                                <View style={styles.rowBetween}>
                                    <ThemedText size="md" type="Medium">
                                        Nama
                                    </ThemedText>
                                    <ThemedText size="xs">{v.name}</ThemedText>
                                </View>
                                <View style={styles.rowBetween}>
                                    <ThemedText size="md" type="Medium">
                                        Kontak
                                    </ThemedText>
                                    <ThemedText size="xs">
                                        {v.contact}
                                    </ThemedText>
                                </View>
                                <View style={styles.rowBetween}>
                                    <ThemedText size="md" type="Medium">
                                        Dibuat pada
                                    </ThemedText>
                                    <ThemedText size="xs">
                                        {moment(v.created_at).format(
                                            "DD MMMM YYYY"
                                        )}
                                    </ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
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
    btnAdd: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: Color.Background.Background,
    },
});

export default ListCustomer;
