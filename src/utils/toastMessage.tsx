import { ToastAndroid } from "react-native";

export const ShowToastMessage = (message: string): void => {
    return ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
    );
};
