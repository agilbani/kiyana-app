import {
    ThemedContainer,
    ThemedHeader,
    ThemedLoader,
    ThemedText,
} from "@/components";
import ModalRejectImage from "@/components/modal/ModalRejectImage";
import Color from "@/constants/Color";
import { PATH } from "@/constants/PathAsset";
import { getDetailLoans } from "@/services/loanService";
import { formatRupiahDisplay } from "@/utils/currency";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const DetailLoan = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    //  console.log("id loan", id);

    const [dataDetail, setDataDetail] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [showImage, setShowImage] = useState(false);

    const getDetail = async () => {
        setLoading(true);
        const res = await getDetailLoans(id);
        setLoading(false);
        //   console.log("res detail loan", res);
        if (res.success) {
            setDataDetail(res.data);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Detail Pinjaman" />
            {loading ? (
                <View
                    style={{
                        flex: 0.8,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ThemedLoader />
                </View>
            ) : (
                <View style={{ flex: 1, padding: 16 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Nomor Pinjaman
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {dataDetail?.number}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Tanggal Pengajuan
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {moment(dataDetail?.submission_date).format(
                                        "DD MMMM YYYY"
                                    )}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Nominal
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {formatRupiahDisplay(dataDetail?.nominal)}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Tenor
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {`${dataDetail?.tenor}x`}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Cicilan
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {formatRupiahDisplay(
                                        dataDetail?.installment_amount
                                    )}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Sisa Cicilan
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {formatRupiahDisplay(
                                        dataDetail?.remaining_loan_amount
                                    )}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Deskripsi Pinjaman
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {dataDetail?.description}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Status
                                </ThemedText>
                                <ThemedText size="md" type="Medium">
                                    {dataDetail?.status}
                                </ThemedText>
                            </View>
                            <View style={styles.rowBetween}>
                                <ThemedText size="md" color={Color.Gray[500]}>
                                    Bukti Pembayaran
                                </ThemedText>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.btnOpenImage}
                                    onPress={() => setShowImage(true)}
                                >
                                    <ThemedText
                                        size="md"
                                        type="Medium"
                                        color={Color.Base.White}
                                    >
                                        Buka Bukti Pembayaran
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.card, { marginTop: 12 }]}>
                            <ThemedText size="lg" type="Medium">
                                Pembayaran Cicilan
                            </ThemedText>
                            {Object.keys(dataDetail).length > 0 &&
                                dataDetail?.histories?.map(
                                    (v: any, index: any) => (
                                        <View
                                            key={`${index}`}
                                            style={{ gap: 12 }}
                                        >
                                            <ThemedText
                                                size="md"
                                                color={Color.Gray[500]}
                                            >
                                                Tenor {index + 1}
                                            </ThemedText>
                                            <View style={styles.rowBetween}>
                                                <ThemedText
                                                    size="md"
                                                    color={Color.Gray[500]}
                                                >
                                                    Nominal
                                                </ThemedText>
                                                <ThemedText
                                                    size="md"
                                                    type="Medium"
                                                >
                                                    {formatRupiahDisplay(
                                                        v.amount
                                                    )}
                                                </ThemedText>
                                            </View>
                                            <View style={styles.rowBetween}>
                                                <ThemedText
                                                    size="md"
                                                    color={Color.Gray[500]}
                                                >
                                                    Status
                                                </ThemedText>
                                                <ThemedText
                                                    size="md"
                                                    type="Medium"
                                                >
                                                    {v.status === "Unpaid"
                                                        ? "Belum Dibayar"
                                                        : "Dibayar"}
                                                </ThemedText>
                                            </View>
                                        </View>
                                    )
                                )}
                        </View>
                    </ScrollView>
                </View>
            )}
            <ModalRejectImage
                visible={showImage}
                onClose={() => setShowImage(false)}
                uri={`${PATH}${dataDetail?.payment_proof}`}
            />
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    btnOpenImage: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        backgroundColor: Color.Green[500],
    },
    card: {
        borderRadius: 8,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: Color.Gray[200],
        backgroundColor: Color.Base.White,
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default DetailLoan;
