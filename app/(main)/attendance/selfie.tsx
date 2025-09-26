import { ThemedText } from "@/components";
import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useApp } from "@/context/AppContext";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import { IcClose } from "@assets/icons";
import ILCamera from "@assets/images/permissions/ILCamera.png";
import { CameraView } from "expo-camera";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const AttendanceSelfieScreen = () => {
    const { user } = useApp();
    const cameraRef = useRef<CameraView>(null);
    const { data } = useLocalSearchParams();
    const coords = data ? JSON.parse(data as string) : null;

    const { granted, loading, requestPermission } = useCameraPermission();

    useFocusEffect(
        React.useCallback(() => {
            if (!granted) {
                requestPermission();
            }
        }, [granted])
    );

    if (loading || granted === null) {
        return (
            <View style={[GlobalStyles.flex, GlobalStyles.center]}>
                <ActivityIndicator size="large" />
                <ThemedText type="Medium">Memeriksa izin kamera...</ThemedText>
            </View>
        );
    }

    if (!granted) {
        return (
            <PermissionScreen
                icon={ILCamera}
                title="Aktifkan Kamera"
                description="Aplikasi memerlukan kamera untuk selfie absensi."
                onAllow={requestPermission}
            />
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                });
                const obj = {
                    uri: photo.uri,
                    type: "image/jpeg",
                    fileName: `${user?.first_name} ${user?.last_name}.jpg`,
                    coords,
                };
                if (photo?.uri) {
                    router.replace({
                        pathname: ROUTES.ATTENDANCE_FORM,
                        params: {
                            data: JSON.stringify(obj),
                        },
                    });
                }
            } catch (error) {
                Alert.alert("Error", "Gagal mengambil foto.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar animated translucent barStyle="light-content" />
            <View style={styles.header}>
                <ThemedText
                    type="SemiBold"
                    size="lg"
                    color={Color.Background.Background}
                >
                    Camera
                </ThemedText>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <IcClose />
                </TouchableOpacity>
            </View>
            <CameraView
                style={styles.camera}
                facing="front"
                ref={cameraRef}
                mode="picture"
            />
            <View style={styles.bottomControlsContainer}>
                <TouchableOpacity
                    style={styles.captureButtonOuter}
                    onPress={takePicture}
                >
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: statusBarHeight ? statusBarHeight + scale(12) : scale(46),
        paddingBottom: verticalScale(16),
        backgroundColor: Color.Base.Black + "CC",
        ...GlobalStyles.center,
    },
    backButton: {
        position: "absolute",
        top: statusBarHeight ? statusBarHeight + scale(12) : scale(46),
        right: scale(16),
    },
    camera: {
        flex: 1,
    },
    bottomControlsContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 24,
        paddingBottom: verticalScale(24),
        ...GlobalStyles.center,
    },
    captureButtonOuter: {
        width: scale(64),
        height: scale(64),
        borderRadius: Radius.rounded,
        backgroundColor: Color.Background.Background,
        ...GlobalStyles.center,
    },
    captureButtonInner: {
        width: scale(56),
        height: scale(56),
        borderRadius: Radius.rounded,
        backgroundColor: Color.Background.Background,
        borderWidth: scale(4),
        borderColor: Color.Gray[500],
    },
});

export default AttendanceSelfieScreen;
