import {
  ThemedButton,
  ThemedGap,
  ThemedHeader,
  ThemedInput,
  ThemedKeyboardAvoiding,
  ThemedText,
  ThemedTextarea,
} from "@/components";
import PermissionScreen from "@/components/screens/Permissions/PermissionScreen";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import GlobalStyles from "@/styles/common";
import { BatchInput } from "@/types/form";
import { scale } from "@/utils/scaleSize";
import { IcClose, IcScan } from "@assets/icons";
import ILCamera from "@assets/images/permissions/ILCamera.png";
import { CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const DetailTaskScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [currentBatch, setCurrentBatch] = useState<BatchInput>({
    barcode: "",
    qty_done: 0,
    notes: "",
  });

  const [batches, setBatches] = useState<BatchInput[]>([]);

  const { granted, loading, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!granted) {
      requestPermission();
    }
  }, [granted]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setIsScanning(false);
    setCurrentBatch((prev) => ({
      ...prev,
      barcode: data,
    }));
  };

  const handleAddBatch = () => {
    if (!currentBatch.barcode || currentBatch.qty_done <= 0) return;

    setBatches((prev) => [...prev, currentBatch]);
    setCurrentBatch({ barcode: "", qty_done: 0, notes: "" });
  };

  const handleSubmit = () => {
    console.log("Submit All Batches: ", batches);
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
    <View style={styles.page}>
      <StatusBar translucent barStyle="dark-content" />
      <ThemedHeader title="Pencatatan Mandiri" />
      <View style={styles.container}>
        <ThemedKeyboardAvoiding withFlex={false}>
          <View style={GlobalStyles.rowCenter}>
            <View style={GlobalStyles.flex}>
              <ThemedInput
                label="Barcode"
                placeholder="Hasil scan atau input manual"
                value={currentBatch.barcode}
                onChangeText={(text) =>
                  setCurrentBatch({ ...currentBatch, barcode: text })
                }
              />
            </View>
            <ThemedGap width="sm" />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.scanWrapper}
              onPress={() => {
                setIsScanning(true);
                setScanned(false);
              }}
            >
              <IcScan />
            </TouchableOpacity>
          </View>
          <ThemedGap height="md" />
          <ThemedInput
            label="Jumlah Selesai"
            placeholder="Masukkan jumlah selesai"
            keyboardType="numeric"
            value={String(currentBatch.qty_done || "")}
            onChangeText={(text) =>
              setCurrentBatch({
                ...currentBatch,
                qty_done: parseInt(text) || 0,
              })
            }
          />
          <ThemedGap height="md" />
          <ThemedTextarea
            label="Catatan"
            placeholder="Tambahkan catatan (opsional)"
            multiline
            value={currentBatch.notes}
            onChangeText={(text) =>
              setCurrentBatch({ ...currentBatch, notes: text })
            }
          />
          <ThemedGap height="xl" />
          <ThemedButton title="Tambah Batch" onPress={handleAddBatch} />
        </ThemedKeyboardAvoiding>
        <ThemedGap height="xl" />
        <FlatList
          data={batches}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <View style={styles.batchItem}>
              <ThemedText type="Bold">Batch #{index + 1}</ThemedText>
              <ThemedText>Barcode: {item.barcode}</ThemedText>
              <ThemedText>Qty: {item.qty_done}</ThemedText>
              <ThemedText>Catatan: {item.notes}</ThemedText>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ marginVertical: scale(80) }}>
              <ThemedText
                color={Color.Text.Secondary}
                style={GlobalStyles.center}
              >
                Belum ada batch ditambahkan
              </ThemedText>
            </View>
          }
        />
        <ThemedGap height="xl" />
        <ThemedButton
          title="Submit"
          onPress={handleSubmit}
          disabled={batches.length === 0}
        />
      </View>

      {/* Modal Kamera untuk Scan Barcode */}
      <Modal visible={isScanning} animationType="slide">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "code128", "code39"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <Pressable
          onPress={() => setIsScanning(false)}
          style={styles.closeScanner}
        >
          <IcClose />
        </Pressable>
      </Modal>
    </View>
  );
};

export default DetailTaskScreen;

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight ? statusBarHeight : scale(46),
    backgroundColor: Color.Background.Background,
    ...GlobalStyles.flex,
  },
  container: {
    padding: scale(20),
    ...GlobalStyles.flex,
  },
  scanWrapper: {
    paddingTop: scale(16),
  },
  batchItem: {
    backgroundColor: Color.Background.Background,
    borderWidth: 1,
    borderColor: Color.Gray[200],
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(10),
  },
  closeScanner: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: scale(8),
    borderRadius: Radius.rounded,
  },
});
