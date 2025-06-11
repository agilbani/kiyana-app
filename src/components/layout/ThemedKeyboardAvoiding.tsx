import Color from "@/constants/Color";
import { ThemedKeyboardAvoidingProps } from "@/types/components";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const ThemedKeyboardAvoiding: React.FC<ThemedKeyboardAvoidingProps> = ({
  children,
  style,
  keyboardVerticalOffset = 0,
  backgroundColor = Color.Background.Background,
  withFlex = true,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={withFlex ? { flex: 1 } : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[{ flexGrow: 1, backgroundColor }, style]}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default React.memo(ThemedKeyboardAvoiding);
