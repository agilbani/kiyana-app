import { ThemedText } from "@/components";
import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import Radius from "@/constants/Radius";
import { ROUTES } from "@/constants/Routes";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import { IcClose } from "@assets/icons";
import ILCamera from "@assets/images/permissions/ILCamera.png";
import { CameraView } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const ScanBatch = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const { granted, loading, requestPermission } = useCameraPermission();

    useEffect(() => {
        setScanned(false);
        if (!granted) {
            requestPermission();
        }
    }, [granted]);

    useFocusEffect(
        useCallback(() => {
            setScanned(false);
            return () => {
                // Optional cleanup when screen goes out of focus
            };
        }, [])
    );

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        router.push({
            pathname: ROUTES.DASHBOARD_DETAIL_PRODUCTION,
            params: { id: data },
        });
    };

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

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417", "code128", "code39"],
                }}
                style={StyleSheet.absoluteFillObject}
            />
            <Pressable
                onPress={() => router.back()}
                style={styles.closeScanner}
            >
                <IcClose />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    closeScanner: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: scale(8),
        borderRadius: Radius.rounded,
    },
});

export default ScanBatch;
