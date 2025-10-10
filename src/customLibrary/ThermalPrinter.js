// customLibrary/ThermalPrinter/index.ts
import { NativeEventEmitter, NativeModules, Platform } from "react-native";

const M = NativeModules?.ThermalPrinterModule;
const isAndroid = Platform.OS === "android";
const emitter = M ? new NativeEventEmitter(M) : null;

const notSupported = (fn) =>
  Promise.reject(
    new Error(
      `${fn} tidak tersedia di ${Platform.OS}. ` +
      `iOS butuh Wi-Fi/AirPrint/SDK vendor atau BLE yang didukung.`
    )
  );

// Event (optional)
export const onDeviceFound = (fn) =>
  emitter ? emitter.addListener("BLUETOOTH_DEVICE_FOUND", fn) : { remove() {} };

// ----- Feature flags -----
export const isBluetoothEnabled = () =>
  isAndroid && M?.isBluetoothEnabled ? M.isBluetoothEnabled() : notSupported("isBluetoothEnabled");

// Paired devices (nama method di native bisa beda-beda)
export const listPairedDevices = () => {
  if (!isAndroid || !M) return notSupported("listPairedDevices");
  const fn =
    M.listsBluetoothAllDevice || // nama yang benar
    M.listsBloetoothAllDevice || // typo lama
    M.listsBloetoothDeviceLists || // fallback lain
    M.listsBloetoothDevice;

  if (!fn) return Promise.reject(new Error("list paired belum diimplement di native."));
  return fn();
};

// Opsional (kalau kamu implement discover di Android)
export const discoverDevices = () =>
  isAndroid && M?.discoverBluetoothDevices
    ? M.discoverBluetoothDevices()
    : notSupported("discoverDevices");
export const cancelDiscovery = () =>
  isAndroid && M?.cancelDiscovery ? M.cancelDiscovery() : Promise.resolve();

// Print
export const printBluetooth = ({ payload }) =>
  isAndroid && M?.printBluetooth ? M.printBluetooth(payload) : notSupported("printBluetooth");

export const printBluetoothSelectDevice = ({
  payload,
  macAddress,
}) =>
  isAndroid && M?.printBluetoothSelectDevice
    ? M.printBluetoothSelectDevice(payload, macAddress)
    : notSupported("printBluetoothSelectDevice");
