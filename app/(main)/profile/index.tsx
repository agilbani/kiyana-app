import { ThemedGap, ThemedImage, ThemedText } from "@/components";
import ProfileMenu from "@/components/screens/Profile/ProfileMenu";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { useApp } from "@/context/AppContext";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import { IcArrowLeft } from "@assets/icons";
import { router } from "expo-router";
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const ProfileScreen = () => {
    const { user } = useApp();
    console.log("user profile", user);

    return (
        <View style={styles.page}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 5 }}
                nestedScrollEnabled
            >
                <View style={styles.backgroundHeader}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <IcArrowLeft width={16} height={16} />
                    </TouchableOpacity>
                    <ThemedText
                        type="SemiBold"
                        size="lg"
                        color={Color.Background.Background}
                        style={GlobalStyles.center}
                    >
                        My Profile
                    </ThemedText>
                </View>
                <View style={styles.content}>
                    <View style={styles.profileWrapper}>
                        <View style={styles.profileBorder}>
                            <ThemedImage
                                source={{
                                    uri: user?.image_url
                                        ? user.image_url
                                        : "https://picsum.photos/200",
                                }}
                                width={120}
                                height={120}
                            />
                        </View>
                    </View>
                    <ThemedGap height="sm" />
                    <View style={GlobalStyles.center}>
                        <ThemedText type="SemiBold" size="lg">
                            {user?.first_name} {user?.last_name}
                        </ThemedText>
                        <ThemedGap height="xxs" />
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Purple[500]}
                        >
                            {user?.role?.name}
                        </ThemedText>
                        <ThemedText
                            type="Medium"
                            size="md"
                            color={Color.Purple[500]}
                        >
                            v.2.5
                        </ThemedText>
                    </View>
                    <ThemedGap height="md" />
                    <ProfileMenu />
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    page: {
        ...GlobalStyles.flex,
        backgroundColor: Color.Base.White,
    },
    backgroundHeader: {
        backgroundColor: Color.Background.HeaderTopGradient,
        height: Dimensions.get("window").height * 0.225,
        paddingTop: statusBarHeight ? statusBarHeight + scale(12) : scale(46),
        zIndex: 5,
    },
    backButton: {
        position: "absolute",
        top: statusBarHeight ? statusBarHeight + scale(8) : scale(46),
        left: 14,
        width: scale(32),
        height: scale(32),
        backgroundColor: Color.Background.Background,
        borderRadius: Radius.rounded,
        zIndex: 1,
        ...GlobalStyles.center,
    },
    profileWrapper: {
        marginTop: scale(-50),
        ...GlobalStyles.center,
    },
    profileBorder: {
        borderWidth: 2,
        borderColor: Color.Background.Background,
        borderRadius: Radius.sm,
    },
    content: {
        backgroundColor: Color.Background.Background,
        borderTopLeftRadius: Radius.md,
        borderTopRightRadius: Radius.md,
        marginTop: scale(-20),
        zIndex: 10,
    },
});
