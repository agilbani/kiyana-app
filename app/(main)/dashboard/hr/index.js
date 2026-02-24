import { ThemedHeader, ThemedText } from "@/components";
import Color from "@/constants/Color";
import { useState } from "react";
import { Dimensions, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { TabView } from "react-native-tab-view";
import AbsenceApproval from "./components/absence";
import LoanApproval from "./components/loan";
import SwapScheduleApproval from "./components/swapSchedule";

const initialLayout = { width: Dimensions.get("window").width };

const Approval = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "absence", title: "Absensi" },
        { key: "swap", title: "Tukar Jadwal" },
        { key: "loan", title: "Pinjaman" },
    ]);

    const renderScene = ({route}) => {
        switch (route.key) {
            case "absence":
                return <AbsenceApproval key={`absence-${index}`} isActive={index === 0} />;
            case "swap":
                return <SwapScheduleApproval key={`swap-${index}`} isActive={index === 1} />;
            case "loan":
                return <LoanApproval key={`loan-${index}`} isActive={index === 2} />;
            default:
                return null;
        }
    };

    const renderTabBarItem = (route) => {
        return (
            <View style={styles.tabItem}>
                <View
                    style={{
                        width: "98%",
                        alignSelf: "center",
                        backgroundColor: Color.Gray[200],
                        borderRadius: 6,
                        padding: 4,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {route?.navigationState?.routes.map((v, idx) => (
                        <TouchableOpacity
                            key={`${idx}`}
                            onPress={() => setIndex(idx)}
                            activeOpacity={0.9}
                            style={[
                                styles.btnTab,
                                {
                                    backgroundColor:
                                        index === idx
                                            ? Color.Base.White
                                            : Color.Gray[200],
                                },
                            ]}
                        >
                            <ThemedText
                                style={{
                                    color:
                                        index === idx
                                            ? Color.brand.default
                                            : Color.Gray[500],
                                }}
                            >
                                {v.title}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
               //  paddingTop: StatusBar.currentHeight,
            }}
        >
         <StatusBar barStyle={'dark-content'} backgroundColor={Color.Base.White} />
         <ThemedHeader
            title="Persetujuan"
         />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={renderTabBarItem}
                style={styles.tabView}
                swipeEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    btnTab: {
        width: "33%",
        borderRadius: 6,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    tabView: {
        flex: 1,
    },
    tabItem: {
        width: "100%",
        paddingVertical: 6,
        backgroundColor: Color.Base.White,
    },
});

export default Approval;
