import Color from "@/constants/Color";
import GlobalStyles from "@/styles/common";
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
}) => {
  return (
    <KeyboardAvoidingView
      style={GlobalStyles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[GlobalStyles.flex, { backgroundColor }, style]}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default React.memo(ThemedKeyboardAvoiding);
