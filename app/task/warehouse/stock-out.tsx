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

const StockOutScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [currentItem, setCurrentItem] = useState<BatchInput>({
    barcode: "",
    qty_done: 0,
    notes: "",
  });

  const [stockOutList, setStockOutList] = useState<BatchInput[]>([]);

  const { granted, loading, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!granted) {
      requestPermission();
    }
  }, [granted]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setIsScanning(false);
    setCurrentItem((prev) => ({
      ...prev,
      barcode: data,
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.barcode || currentItem.qty_done <= 0) return;

    setStockOutList((prev) => [...prev, currentItem]);
    setCurrentItem({ barcode: "", qty_done: 0, notes: "" });
  };

  const handleSubmit = () => {
    console.log("Submit Barang Keluar:", stockOutList);
    // Kirim ke API atau simpan local state
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
        description="Aplikasi memerlukan kamera untuk memindai barcode produk."
        onAllow={requestPermission}
      />
    );
  }

  return (
    <View style={styles.page}>
      <StatusBar translucent barStyle="dark-content" />
      <ThemedHeader title="Catat Barang Keluar" />
      <View style={styles.container}>
        <ThemedKeyboardAvoiding withFlex={false}>
          <View style={GlobalStyles.rowCenter}>
            <View style={GlobalStyles.flex}>
              <ThemedInput
                label="SKU / Barcode"
                placeholder="Scan atau masukkan kode produk"
                value={currentItem.barcode}
                onChangeText={(text) =>
                  setCurrentItem({ ...currentItem, barcode: text })
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
            label="Jumlah Keluar"
            placeholder="Masukkan jumlah barang keluar"
            keyboardType="numeric"
            value={String(currentItem.qty_done || "")}
            onChangeText={(text) =>
              setCurrentItem({
                ...currentItem,
                qty_done: parseInt(text) || 0,
              })
            }
          />

          <ThemedGap height="md" />
          <ThemedTextarea
            label="Catatan"
            placeholder="Catatan tambahan (opsional)"
            multiline
            value={currentItem.notes}
            onChangeText={(text) =>
              setCurrentItem({ ...currentItem, notes: text })
            }
          />

          <ThemedGap height="xl" />
          <ThemedButton title="Tambah ke Daftar" onPress={handleAddItem} />
        </ThemedKeyboardAvoiding>

        <ThemedGap height="xl" />
        <FlatList
          data={stockOutList}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <View style={styles.batchItem}>
              <ThemedText type="Bold">Barang #{index + 1}</ThemedText>
              <ThemedText>SKU / Barcode: {item.barcode}</ThemedText>
              <ThemedText>Jumlah: {item.qty_done}</ThemedText>
              <ThemedText>Catatan: {item.notes}</ThemedText>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ marginVertical: scale(80) }}>
              <ThemedText
                color={Color.Text.Secondary}
                style={GlobalStyles.center}
              >
                Belum ada barang keluar dicatat
              </ThemedText>
            </View>
          }
        />

        <ThemedGap height="xl" />
        <ThemedButton
          title="Submit Barang Keluar"
          onPress={handleSubmit}
          disabled={stockOutList.length === 0}
        />
      </View>

      {/* Modal Kamera */}
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

export default StockOutScreen;

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
