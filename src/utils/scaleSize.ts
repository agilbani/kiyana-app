import { Dimensions, PixelRatio, Platform } from "react-native";

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Skala horizontal berdasarkan lebar layar
 * @param size ukuran asli
 */
export const scale = (size: number): number =>
  (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Skala vertikal berdasarkan tinggi layar
 * @param size ukuran asli
 */
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Skala moderat gabungan horizontal + faktor
 * @param size ukuran asli
 * @param factor faktor moderasi (default 0.5)
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

/**
 * Skala font, disesuaikan dengan PixelRatio & platform
 * @param size ukuran font asli
 * @param factor faktor moderasi font (default 0.5)
 */
export const scaleFont = (size: number, factor = 0.5): number => {
  const newSize = moderateScale(size, factor);
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
