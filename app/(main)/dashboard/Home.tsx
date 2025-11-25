import { ThemedGap } from "@/components";
import DashboardAnnouncement from "@/components/screens/Dashboard/DashboardAnnouncement";
import DashboardCard from "@/components/screens/Dashboard/DashboardCard";
import DashboardTodayTask from "@/components/screens/Dashboard/DashboardTodayTask";
import Color from "@/constants/Color";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { getProfile } from "@/services/authService";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import TaskMenu from "@app/task";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, StatusBar, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const statusBarHeight = StatusBar.currentHeight;

const HomeScreen = () => {
    const { user, token, logout, updateUser } = useApp();
    const [refresh, setRefresh] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    //  console.log("user home", user);
    //  console.log("user token", token);

    const handleLogout = async () => {
        router.replace(ROUTES.LOGIN);
        await logout();
    };

    const getUser = async () => {
        const res = await getProfile();
        //   console.log("cek res user", res);
        updateUser(res.data);
    };

    useFocusEffect(
        useCallback(() => {
            getUser();
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing((prev) => !prev);
        // set time out
        setTimeout(() => {
            setRefresh((prev) => !prev);
            setRefreshing((prev) => !prev);
            // set time out
        }, 1000);
    }, []);

    return (
        <View style={styles.page}>
            <StatusBar translucent barStyle="light-content" />
            <View
                style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: scale(16),
                }}
            >
                <DashboardCard
                    userData={user!}
                    onLogout={() => handleLogout()}
                />
                <ThemedGap height="md" />
                <DashboardAnnouncement text="Diberitahukan untuk Semua karyawan agar tidak terlambat melakukan absensi" />
                <ThemedGap height="md" />
            </View>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ flex: 1 }}>
                    <DashboardTodayTask user={user} refresh={refresh} />
                    <ThemedGap height="md" />
                    {/* <DashboardFinanceHistory /> */}
                    <TaskMenu />
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    page: {
        paddingTop: statusBarHeight ? statusBarHeight : scale(46),
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.flex,
    },
    container: {
        flex: 1,
        backgroundColor: Color.Purple[50],
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(12),
    },
    contentContainer: {
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(12),
    },
});
