import {
    ThemedContainer,
    ThemedGap,
    ThemedHeader,
    ThemedImage,
    ThemedLoader,
    ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { getAttendanceDetail } from "@/services/attendanceService";
import GlobalStyles from "@/styles/common";
import { AttendanceHistory } from "@/types/attendance";
import { scale, verticalScale } from "@/utils/scaleSize";
import { ShowToastMessage } from "@/utils/toastMessage";
import { IcCalendar } from "@assets/icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const AttendanceDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    //  console.log("id attendance", id);

    const [detail, setDetail] = useState<AttendanceHistory>();
    const [loading, setLoading] = useState<boolean>(false);

    const getDetail = async () => {
        setLoading(true);
        const res = await getAttendanceDetail(id);
        setLoading(false);
        //   console.log("res detail", res);
        if (res.success) {
            setDetail(res.data);
        } else {
            ShowToastMessage(res.message);
            router.back();
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <ThemedContainer>
            <ThemedHeader title="Detail" />
            {loading ? (
                <ThemedLoader />
            ) : (
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.card}>
                            <View style={GlobalStyles.rowCenter}>
                                <IcCalendar
                                    width={16}
                                    height={16}
                                    stroke={Color.Purple[500]}
                                />
                                <ThemedGap width="xxs" />
                                <ThemedText type="SemiBold" size="md">
                                    {moment(detail?.date).format(
                                        "DD MMMM YYYY"
                                    )}
                                </ThemedText>
                            </View>
                            <ThemedGap height="xl" />
                            <View style={styles.content}>
                                <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Text.Secondary}
                                >
                                    Selfie Clock In
                                </ThemedText>
                                <ThemedGap height="xxs" />
                                <View style={styles.photoWrapper}>
                                    <ThemedImage
                                        source={{
                                            uri: `https://factorykiyana.id/storage/${detail?.image_in}`,
                                        }}
                                        width={
                                            Dimensions.get("window").width *
                                            0.78
                                        }
                                        height={
                                            Dimensions.get("window").height *
                                            0.3
                                        }
                                        style={styles.photo}
                                    />
                                    <View style={styles.photoContent}>
                                        <ThemedText
                                            type="Medium"
                                            size="sm"
                                            color={Color.Base.White}
                                        >
                                            Lat : {detail?.lat_in}
                                        </ThemedText>
                                        <ThemedGap height="xxs" />
                                        <ThemedText
                                            type="Medium"
                                            size="sm"
                                            color={Color.Base.White}
                                        >
                                            Long : {detail?.lng_in}
                                        </ThemedText>
                                        <ThemedGap height="xxs" />
                                        <ThemedText
                                            type="Medium"
                                            size="sm"
                                            color={Color.Base.White}
                                        >
                                            {moment(detail?.date).format(
                                                "DD/MM/YY"
                                            )}{" "}
                                            {detail?.clock_in}
                                        </ThemedText>
                                    </View>
                                </View>
                                <ThemedGap height="sm" />
                                {/* <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Text.Secondary}
                                >
                                    Clock-In Notes
                                </ThemedText>
                                <ThemedGap height="xxs" />
                                <ThemedText
                                    type="Medium"
                                    size="md"
                                    color={Color.Text.Body}
                                >
                                    Tidak ada
                                </ThemedText>
                                <ThemedGap height="sm" /> */}
                                {/* <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Text.Secondary}
                                >
                                    Clock in & Out
                                </ThemedText>
                                <ThemedGap height="xxs" />
                                <ThemedText
                                    type="Medium"
                                    size="md"
                                    color={Color.Text.Body}
                                >
                                    {detail?.clock_in} - {detail?.clock_out}
                                </ThemedText> */}
                            </View>

                            <View style={[styles.content, { marginTop: 10 }]}>
                                <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Text.Secondary}
                                >
                                    Selfie Clock Out
                                </ThemedText>
                                <ThemedGap height="xxs" />
                                <View style={styles.photoWrapper}>
                                    <ThemedImage
                                        source={{
                                            uri: `https://factorykiyana.id/storage/${detail?.image_out}`,
                                        }}
                                        width={
                                            Dimensions.get("window").width *
                                            0.78
                                        }
                                        height={
                                            Dimensions.get("window").height *
                                            0.3
                                        }
                                        style={styles.photo}
                                    />
                                    <View style={styles.photoContent}>
                                        <ThemedText
                                            type="Medium"
                                            size="sm"
                                            color={Color.Base.White}
                                        >
                                            Lat : {detail?.lat_out}
                                        </ThemedText>
                                        <ThemedGap height="xxs" />
                                        <ThemedText
                                            type="Medium"
                                            size="sm"
                                            color={Color.Base.White}
                                        >
                                            Long : {detail?.lng_out}
                                        </ThemedText>
                                        <ThemedGap height="xxs" />
                                        <ThemedText
                                            type="Medium"
                                            size="sm"
                                            color={Color.Base.White}
                                        >
                                            {moment(detail?.date).format(
                                                "DD/MM/YY"
                                            )}{" "}
                                            {detail?.clock_out}
                                        </ThemedText>
                                    </View>
                                </View>
                                <ThemedGap height="sm" />
                                {/* <ThemedText
                                  type="Medium"
                                  size="sm"
                                  color={Color.Text.Secondary}
                              >
                                  Clock-In Notes
                              </ThemedText>
                              <ThemedGap height="xxs" />
                              <ThemedText
                                  type="Medium"
                                  size="md"
                                  color={Color.Text.Body}
                              >
                                  Tidak ada
                              </ThemedText>
                              <ThemedGap height="sm" /> */}
                                {/* <ThemedText
                                    type="Medium"
                                    size="sm"
                                    color={Color.Text.Secondary}
                                >
                                    Clock in & Out
                                </ThemedText>
                                <ThemedGap height="xxs" />
                                <ThemedText
                                    type="Medium"
                                    size="md"
                                    color={Color.Text.Body}
                                >
                                    {detail?.clock_in} - {detail?.clock_out}
                                </ThemedText> */}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}
        </ThemedContainer>
    );
};

export default AttendanceDetailScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.Purple[50],
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(12),
        ...GlobalStyles.flex,
    },
    card: {
        flex: 0.9,
        backgroundColor: Color.Background.Background,
        paddingVertical: verticalScale(24),
        paddingHorizontal: scale(16),
        borderRadius: Radius.xs,
    },
    content: {
        backgroundColor: Color.Gray[100],
        borderWidth: 1,
        borderColor: Color.Gray[200],
        padding: scale(12),
        borderRadius: Radius.sm,
        ...GlobalStyles.flex,
    },
    photoWrapper: {
        position: "relative",
        ...GlobalStyles.flex,
    },
    photo: {
        borderRadius: Radius.sm,
    },
    photoContent: {
        position: "absolute",
        left: scale(16),
        right: scale(16),
        bottom: scale(16),
    },
    footer: {
        backgroundColor: Color.Background.Background,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(14),
        borderTopWidth: 1,
        borderColor: Color.Gray[200],
    },
});
