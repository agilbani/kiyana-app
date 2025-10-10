package com.ryan77.kiyana;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.util.Log;

import com.bumptech.glide.Glide;
import com.dantsu.escposprinter.EscPosPrinter;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothConnection;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothConnections;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections;
import com.dantsu.escposprinter.exceptions.EscPosBarcodeException;
import com.dantsu.escposprinter.exceptions.EscPosConnectionException;
import com.dantsu.escposprinter.exceptions.EscPosEncodingException;
import com.dantsu.escposprinter.exceptions.EscPosParserException;

import com.dantsu.escposprinter.textparser.PrinterTextParserImg;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@ReactModule(name = ThermalPrinterModule.NAME)
public class ThermalPrinterModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ThermalPrinterModule";
    private Promise jsPromise;

    public ThermalPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private BluetoothAdapter mBluetoothAdapter = null;
    public static final String EVENT_BLUETOOTH_NOT_SUPPORT = "EVENT_BLUETOOTH_NOT_SUPPORT";
    private BluetoothConnection selectedDevice;
    private android.content.BroadcastReceiver discoveryReceiver;
    private boolean receiverRegistered = false;
    private WritableArray discovered = Arguments.createArray();
    private Promise discoveryPromise;

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    public interface OnBluetoothPermissionsGranted {
        void onPermissionsGranted() throws EscPosConnectionException, EscPosEncodingException, EscPosBarcodeException, EscPosParserException, JSONException;
    }

    public OnBluetoothPermissionsGranted onBluetoothPermissionsGranted;

    @ReactMethod
    public void isBluetoothEnabled(Promise promise) {
        this.jsPromise = promise;
        BluetoothAdapter adapter = this.getBluetoothAdapter();
        this.jsPromise.resolve(adapter != null && adapter.isEnabled());
    }

    public void checkBluetoothPermissions(OnBluetoothPermissionsGranted onBluetoothPermissionsGranted) throws EscPosEncodingException, EscPosBarcodeException, EscPosParserException, EscPosConnectionException {
        this.onBluetoothPermissionsGranted = onBluetoothPermissionsGranted;

        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{Manifest.permission.BLUETOOTH}, 1);
        } else if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.BLUETOOTH_ADMIN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{Manifest.permission.BLUETOOTH_ADMIN}, 1);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{Manifest.permission.BLUETOOTH_CONNECT}, 1);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{Manifest.permission.BLUETOOTH_SCAN}, 1);
        } else {
            try {
                this.onBluetoothPermissionsGranted.onPermissionsGranted();
            } catch (JSONException e) {
                jsPromise.reject("Error", e.getMessage());
                throw new RuntimeException(e);
            }
        }
    }

    @ReactMethod
    public void printBluetooth(String payload, Promise promise) throws EscPosEncodingException, EscPosBarcodeException, EscPosParserException, EscPosConnectionException {
        Log.d("iniini", payload);
        this.jsPromise = promise;

        this.checkBluetoothPermissions(() -> {
            try {
                // BluetoothConnection printerConnection;

                // if (selectedDevice == null) {
                //     printerConnection = BluetoothPrintersConnections.selectFirstPaired();
                // } else {
                //     printerConnection = selectedDevice;
                // }

                // Log.d("iniini", printerConnection.toString());

                EscPosPrinter printer = new EscPosPrinter(BluetoothPrintersConnections.selectFirstPaired(), 203, 48f, 32);
                printer.printFormattedTextAndCut(preProsesImageTag(printer ,payload));
                this.jsPromise.resolve("Success");
            } catch (EscPosConnectionException e) {
                this.jsPromise.reject("Device not connect");
            } catch (Exception e) {
                this.jsPromise.reject(e.getMessage().toString());
            }
        });
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void printBluetoothSelectDevice(String payload, String macAddress, Promise promise) {
        try {
            checkBluetoothPermissions(() -> {
            BluetoothConnection conn = getBloetoothConnection(macAddress);
            if (conn == null) { promise.reject("E_NO_DEVICE", "Printer not found"); return; }
            try {
                EscPosPrinter printer = new EscPosPrinter(conn.connect(), 203, 48f, 32);
                printer.printFormattedTextAndCut(preProsesImageTag(printer, payload));
                promise.resolve(null);
            } catch (EscPosConnectionException e) {
                promise.reject("E_CONN", "Device not connect");
            } catch (Exception e) {
                promise.reject("E_PRINT", e);
            }
            });
        } catch (Throwable t) {
            promise.reject("E_PRINT", t);
        }
    }


    public BluetoothConnection getBloetoothConnection(String macAddress) {
        BluetoothConnections printerConnections = new BluetoothConnections();
        for (BluetoothConnection bluetoothConnection : printerConnections.getList()) {
            BluetoothDevice bluetoothDevice = bluetoothConnection.getDevice();
            try { if (bluetoothDevice.getAddress().equals(macAddress)) { return bluetoothConnection; } } catch (Exception ignored) {}
        }

        return null;
    }

    public String preProsesImageTag(EscPosPrinter printer, String payload) {
        Pattern tagsImage = Pattern.compile("(?<=\\<img\\>)(.*)(?=\\<\\/img\\>)");
        Matcher patternTagsImage = tagsImage.matcher(payload);
        StringBuffer builder = new StringBuffer();

        while (patternTagsImage.find()) {
            String url = patternTagsImage.group(1);
            patternTagsImage.appendReplacement(builder, PrinterTextParserImg.bitmapToHexadecimalString(printer, getBitmapFromUrl(url)));
        }

        Log.d("iniini", builder.toString());

        patternTagsImage.appendTail(builder);
        return builder.toString();
    }

    private Bitmap getBitmapFromUrl(String url) {
        try {
            Bitmap bitmap = Glide
                    .with(getCurrentActivity())
                    .asBitmap()
                    .load(url)
                    .submit()
                    .get();
            return bitmap;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void listsBloetoothDevice(Promise promise) throws EscPosEncodingException, EscPosBarcodeException, EscPosParserException, EscPosConnectionException {
        this.jsPromise = promise;
        this.checkBluetoothPermissions(() -> {
            final BluetoothConnection[] bluetoothDevicesList = (new BluetoothPrintersConnections()).getList();

            if (bluetoothDevicesList != null) {
                WritableArray rnArray = new WritableNativeArray();
                int i = 0;
                final String[] items = new String[bluetoothDevicesList.length + 1];
                items[0] = "Default printer";
                for (BluetoothConnection device : bluetoothDevicesList) {
                    items[++i] = device.getDevice().getName();
                    JSONObject jsonObj = new JSONObject();
                    String deviceName = device.getDevice().getName();
                    String deviceAddress = device.getDevice().getAddress();

                    jsonObj.put("deviceName", deviceName);
                    jsonObj.put("deviceAddress", deviceAddress);
                    jsonObj.put("devicesUnique", device);
                    jsonObj.put("uuid", device.getDevice().getUuids()[0].getUuid());
                    WritableMap wmap = convertJsonToMap(jsonObj);
                    rnArray.pushMap(wmap);
                }
//                jsPromise.resolve(rnArray);

                AlertDialog.Builder alertDialog = new AlertDialog.Builder(getCurrentActivity());
                alertDialog.setTitle("Pilih printer bluetooth");
                alertDialog.setItems(
                        items,
                        (dialogInterface, i1) -> {
                            int index = i1 - 1;
                            if (index == -1) {
                                selectedDevice = null;
                            } else {
                                selectedDevice = bluetoothDevicesList[index];
                                jsPromise.resolve(bluetoothDevicesList[index].getDevice().getName());
                            }
                        }
                );

                AlertDialog alert = alertDialog.create();
                alert.setCanceledOnTouchOutside(false);
                alert.show();
            }
        });
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void listsBloetoothDeviceLists(Promise promise) throws EscPosEncodingException, EscPosBarcodeException, EscPosParserException, EscPosConnectionException {
        this.jsPromise = promise;
        this.checkBluetoothPermissions(() -> {
            final BluetoothConnection[] bluetoothDevicesList = (new BluetoothPrintersConnections()).getList();

            if (bluetoothDevicesList != null) {
                WritableArray rnArray = new WritableNativeArray();
                int i = 0;
                final String[] items = new String[bluetoothDevicesList.length + 1];
                items[0] = "Default printer";
                for (BluetoothConnection device : bluetoothDevicesList) {
                    items[++i] = device.getDevice().getName();
                    JSONObject jsonObj = new JSONObject();
                    String deviceName = device.getDevice().getName();
                    String deviceAddress = device.getDevice().getAddress();

                    jsonObj.put("deviceName", deviceName);
                    jsonObj.put("deviceAddress", deviceAddress);
                    jsonObj.put("devicesUnique", device);
                    jsonObj.put("uuid", device.getDevice().getUuids()[0].getUuid());
                    WritableMap wmap = convertJsonToMap(jsonObj);
                    rnArray.pushMap(wmap);
                }
                jsPromise.resolve(rnArray);
            }
        });
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void listsBluetoothAllDevice(Promise promise) {
        try {
            checkBluetoothPermissions(() -> {
                BluetoothAdapter adapter = getBluetoothAdapter();
                if (adapter == null) { promise.reject("E_NO_BT", "Bluetooth not supported"); return; }
                if (!adapter.isEnabled()) { promise.reject("E_BT_DISABLED", "Bluetooth is disabled"); return; }

                WritableArray arr = Arguments.createArray();
                for (BluetoothDevice d : adapter.getBondedDevices()) {
                    WritableMap m = Arguments.createMap();
                    m.putString("deviceName", d.getName());
                    m.putString("deviceAddress", d.getAddress());
                    arr.pushMap(m);
                }
                promise.resolve(arr);
            });
        } catch (Throwable t) {
            promise.reject("E_LIST_BT", t);
        }
    }

    private BluetoothAdapter getBluetoothAdapter() {
        if (mBluetoothAdapter == null) {
            // Get local Bluetooth adapter
            mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        }
        // If the adapter is null, then Bluetooth is not supported
        if (mBluetoothAdapter == null) {
            emitRNEvent(EVENT_BLUETOOTH_NOT_SUPPORT, Arguments.createMap());
        }

        return mBluetoothAdapter;
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void discoverBluetoothDevices(Promise promise) {
    try {
        checkBluetoothPermissions(() -> {
        BluetoothAdapter adapter = getBluetoothAdapter();
        if (adapter == null) { promise.reject("E_NO_BT", "Bluetooth not supported"); return; }
        if (!adapter.isEnabled()) { promise.reject("E_BT_DISABLED", "Bluetooth is disabled"); return; }

        // Android < S butuh lokasi untuk scan
        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(getReactApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, 2);
            promise.reject("E_NO_LOC", "Location permission required for discovery on Android < 12");
            return;
            }
        }

        // Bersihkan state lama
        if (receiverRegistered && discoveryReceiver != null) {
            getReactApplicationContext().unregisterReceiver(discoveryReceiver);
            receiverRegistered = false;
        }
        discovered = Arguments.createArray();
        discoveryPromise = promise;

        discoveryReceiver = new android.content.BroadcastReceiver() {
            @Override
            public void onReceive(android.content.Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device != null) {
                WritableMap m = Arguments.createMap();
                m.putString("deviceName", device.getName());
                m.putString("deviceAddress", device.getAddress());
                discovered.pushMap(m);

                // (opsional) broadcast ke JS saat ditemukan
                emitRNEvent("BLUETOOTH_DEVICE_FOUND", m);
                }
            } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                try {
                if (discoveryPromise != null) {
                    discoveryPromise.resolve(discovered);
                }
                } finally {
                cleanupDiscoveryReceiver();
                }
            }
            }
        };

        android.content.IntentFilter filter = new android.content.IntentFilter();
        filter.addAction(BluetoothDevice.ACTION_FOUND);
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        getReactApplicationContext().registerReceiver(discoveryReceiver, filter);
        receiverRegistered = true;

        boolean started = adapter.startDiscovery();
        if (!started) {
            cleanupDiscoveryReceiver();
            promise.reject("E_DISCOVERY", "Failed to start discovery");
        }
        });
    } catch (Throwable t) {
        cleanupDiscoveryReceiver();
        promise.reject("E_DISCOVERY", t);
    }
    }

    private void cleanupDiscoveryReceiver() {
    try {
        BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
        if (adapter != null && adapter.isDiscovering()) adapter.cancelDiscovery();
    } catch (Exception ignored) {}
    try {
        if (receiverRegistered && discoveryReceiver != null) {
        getReactApplicationContext().unregisterReceiver(discoveryReceiver);
        }
    } catch (Exception ignored) {}
    receiverRegistered = false;
    discoveryReceiver = null;
    discoveryPromise = null;
    }

    @ReactMethod
    public void cancelDiscovery(Promise promise) {
    cleanupDiscoveryReceiver();
    promise.resolve(null);
    }

    // Bebaskan receiver saat instance dihancurkan
    @Override
    public void onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy();
    cleanupDiscoveryReceiver();
    }


    private void emitRNEvent(String event, @Nullable WritableMap params) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, params);
    }
}
