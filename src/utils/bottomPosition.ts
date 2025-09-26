import { useSafeAreaInsets } from "react-native-safe-area-context";

export const getPositionBottom = () => {
  const insets = useSafeAreaInsets();
  const bottom = insets.bottom;
  return {bottom};
};

export const usePositionBottom = () => {
  const insets = useSafeAreaInsets();
  return { bottom: insets.bottom };
};