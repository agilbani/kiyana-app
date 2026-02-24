import {
    CustomDropdown,
    ThemedGap,
    ThemedHeader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { monthOptions } from "@/constants/Dummy/Options";
import { ROUTES } from "@/constants/Routes";
import { getDataPayroll } from "@/services/masterService";
import GlobalStyles from "@/styles/common";
import LoadingManager from "@/utils/LoadingManager";
import { scale, verticalScale } from "@/utils/scaleSize";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const optionStatus = [
    {
        name: "Belum Dibayar",
        value: "Belum Dibayar",
    },
    {
        name: "Sudah Dibayar",
        value: "Sudah Dibayar",
    },
    {
        name: "Pending Konfirmasi",
        value: "Pending Konfirmasi",
    },
];

const PayrollItem = memo(({ item }: any) => (
    <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => {
            router.push(
                ROUTES.PROFILE_DETAIL_PAYROLL(
                    item.payroll.number,
                    item.id,
                ) as any,
            );
        }}
    >
        <ThemedText type="SemiBold" size="md">
            Periode: {moment(item.payroll.start_date).format("DD-MM-YYYY")} -{" "}
            {moment(item.payroll.end_date).format("DD-MM-YYYY")}
        </ThemedText>
        <View style={{ gap: 2, marginTop: 10 }}>
            <ThemedText type="SemiBold" size="md">
                Deskripsi
            </ThemedText>
            <ThemedText>{item.payroll.description}</ThemedText>
        </View>
        <ThemedGap height="sm" />
        <View style={styles.innerCard}>
            <View>
                <ThemedText
                    type="Medium"
                    size="sm"
                    color={Color.Text.Secondary}
                >
                    Diterima
                </ThemedText>
                <ThemedGap height="xxs" />
                <ThemedText type="Medium" size="md" color={Color.Text.Body}>
                    {item.bruto_formatted}
                </ThemedText>
            </View>
            <View>
                <ThemedText
                    type="Medium"
                    size="sm"
                    color={Color.Text.Secondary}
                >
                    Status
                </ThemedText>
                <ThemedGap height="xxs" />
                <ThemedText type="Medium" size="md" color={Color.Text.Body}>
                    {item.payment_status}
                </ThemedText>
            </View>
        </View>
    </TouchableOpacity>
));

const PayrollScreen = () => {
    const renderItem = useCallback(
        ({ item }: any) => <PayrollItem item={item} />,
        [],
    );

    const [listData, setListData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({
        payment_status: "",
        year: "",
        month: "",
    });

    const getData = async () => {
        setShowModal(false);
        LoadingManager.show();
        const res = await getDataPayroll(filter);
        LoadingManager.hide();
        if (res.success) {
            setListData(res.data.salaries);
        }
    };

    const generateYearList = () => {
        const startYear = 2020;
        const currentYear = moment().year();

        const years = [];

        for (let year = startYear; year <= currentYear; year++) {
            years.push({
                name: year.toString(),
                value: year.toString(),
            });
        }

        return years.reverse();
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View style={styles.page}>
            <ThemedHeader title="Slip Gaji" />
            <View style={styles.container}>
                <View
                    style={{
                        padding: 15,
                        backgroundColor: Color.Base.White,
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => setShowModal(true)}
                    >
                        <View
                            style={{
                                padding: 10,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: Color.GreyscaleBlue[200],
                            }}
                        >
                            <AntDesign name="filter" />
                        </View>
                    </TouchableOpacity>
                </View>
                <FlashList
                    data={listData}
                    keyExtractor={(item) => item?.id}
                    renderItem={renderItem}
                    estimatedItemSize={100}
                    ItemSeparatorComponent={() => <ThemedGap height="sm" />}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <Modal
                visible={showModal}
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.containerModal}>
                    <View style={styles.modalContent}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <ThemedText size="lg" type="Bold">
                                Atur Filter
                            </ThemedText>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => setShowModal(false)}
                            >
                                <AntDesign name="closecircle" size={20} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 50 }}
                        >
                            <CustomDropdown
                                label="Pilih Bulan"
                                items={monthOptions}
                                onSelectItem={(selected: any) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        month: selected.value,
                                    }))
                                }
                                placeholderText="ex: Januari"
                                style={{ marginTop: 15 }}
                                value={filter.month}
                                maxHeight={200}
                            />
                            <CustomDropdown
                                label="Pilih Tahun"
                                items={generateYearList()}
                                onSelectItem={(selected: any) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        year: selected.value,
                                    }))
                                }
                                placeholderText="ex: Januari"
                                style={{ marginTop: 15 }}
                                value={filter.year}
                                maxHeight={200}
                            />
                            <CustomDropdown
                                label="Pilih Status"
                                items={optionStatus}
                                onSelectItem={(selected: any) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        payment_status: selected.value,
                                    }))
                                }
                                placeholderText="Belum Dibayar"
                                style={{ marginTop: 15 }}
                                value={filter.payment_status}
                                maxHeight={200}
                            />
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignSelf: "center",
                                    marginTop: 15,
                                }}
                                onPress={getData}
                            >
                                <View
                                    style={{
                                        padding: 15,
                                        borderRadius: 6,
                                        backgroundColor: Color.Green[500],
                                    }}
                                >
                                    <ThemedText
                                        size="md"
                                        type="Medium"
                                        color={Color.Base.White}
                                    >
                                        Terapkan
                                    </ThemedText>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default React.memo(PayrollScreen);

const styles = StyleSheet.create({
    modalContent: {
        width: "100%",
        height: "50%",
        backgroundColor: Color.Base.White,
        borderRadius: 8,
        padding: 16,
    },
    containerModal: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    page: {
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.flex,
    },
    container: {
        backgroundColor: Color.Purple[50],
        paddingHorizontal: scale(4),
        ...GlobalStyles.flex,
    },
    contentContainer: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(8),
        paddingBottom: scale(64),
    },
    card: {
        backgroundColor: Color.Background.Background,
        borderRadius: scale(8),
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        ...GlobalStyles.shadow,
    },
    innerCard: {
        backgroundColor: Color.Gray[100],
        borderWidth: 1,
        borderColor: Color.Gray[200],
        padding: scale(12),
        ...GlobalStyles.rowSpaceBetween,
    },
});
