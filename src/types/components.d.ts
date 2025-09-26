import { RadiusKey } from "@/constants/Radius";
import { SpacingKey } from "@/constants/Spacing";
import React, { ReactNode } from "react";
import {
   Animated,
   ColorValue,
   TextInputProps,
   TextProps,
   TextStyle,
   ViewStyle,
} from "react-native";
import { Attendance } from "./attendance";
import { User } from "./auth";

// Font
export type FontType = "Regular" | "Medium" | "SemiBold" | "Bold";
export type FontSize = "xs" | "sm" | "md" | "base" | "lg" | "xl" | "xxl";
export interface ThemedTextProps extends TextProps {
  type?: FontType;
  size?: FontSize;
  color?: ColorValue;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

// Image
export interface ThemedImageProps {
  source: { uri: string } | number;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  placeholderColor?: string;
  borderRadius?: RadiusKey;
  delayBeforeLoad?: number;
  onLoadEnd?: () => void;
}

// Shimmer
export interface ThemedShimmerProps {
  type?: "image" | "default";
  width?: number;
  height?: number;
  borderRadius?: RadiusKey;
}

// Gap
export interface ThemedGapProps {
  width?: SpacingKey;
  height?: SpacingKey;
}

// Button
export type Variant = "primary" | "secondary" | "outline";

export interface ThemedButtonProps {
  variant?: Variant;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textColor?: string;
  onPress?: (event: GestureResponderEvent) => void;
}

// Input
export interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface ThemedInputState {
  value: string;
  isFocused: boolean;
  showPassword: boolean;
}

// Select
type Option = {
  key: string;
  value: string;
};

export interface ThemedSelectProps {
  label?: string;
  icon?: ReactNode;
  value?: string;
  onChangeText?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  data?: Option[];
}

export interface ThemedSelectState {
  value: string;
  modalVisible: boolean;
  searchQuery: string;
  filteredData: Option[];
}

// Error message
export interface ThemedErrorMessageProps {
  message?: string;
}

// Textarea
export interface ThemedTextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
}

export interface ThemedTextareaState {
  value: string;
  isFocused: boolean;
}

// KeyboardAvoiding
export type ThemedKeyboardAvoidingProps = {
  children: ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
  backgroundColor?: string;
  withFlex?: boolean;
};

// Container
export type ThemedContainerProps = {
  children: ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
};

// BottomSheet
export type ThemedBottomSheetProps = {
  type?: "full" | "content";
  visible?: boolean;
  children: React.ReactNode;
  onClose: () => void;
  style?: ViewStyle;
};

export type ThemedBottomSheetState = {
  visible: boolean;
};

// Modal
export type ThemedModalProps = {
  visible?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export type ThemedModalState = {
  visible: boolean;
};

// OnBoarding
export interface OnboardingSlideProps {
  image: any;
  title: string;
  description: string;
}

export interface OnboardingDotsProps {
  slidesLength: number;
  translateX: Animated.AnimatedInterpolation<string | number>;
}

export interface OnboardingActionsProps {
  onNext: () => void;
  onSkip: () => void;
}

// Permissions
export type PermissionScreenProps = {
  icon: number;
  title: string;
  description: string;
  onAllow: () => void;
  onMaybeLater?: () => void;
};

// AuthLayout
export interface ThemedAuthLayoutProps {
  children: React.ReactNode;
}

// Attendance
export interface AttendanceHeaderProps {
  clockInTime: string | undefined;
  clockOutTime: string | undefined;
  onClockInPress: (data: any) => void;
  onClickAbsence: () => void;
  attendanceData?: Attendance;
  user?: User
}

// Header
export interface ThemedHeaderProps {
  title: string;
  onPressBack?: () => void
}

// Badge
export interface ThemedBadgeProps {
  icon?: ReactNode;
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

// Announcement
export interface DashboardAnnouncementProps {
  text?: string | undefined;
}

export interface ThemedDatePickerProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (date: Date) => void;
  minimumDate?: any;
  labelSize?: FontSize;
  type?: string
}

export interface ThemedDatePickerState {
  value?: Date;
  showPicker: boolean;
}
