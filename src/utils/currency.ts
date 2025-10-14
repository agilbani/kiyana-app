import moment from "moment";
import "moment/locale/id";

/**
 * Format angka saat mengetik ke dalam format Rupiah
 * Contoh input: "1000" → output: "Rp 1.000"
 */
export const formatRupiahInput = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, "");
  if (!numericValue) return "";
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Format angka number dari backend menjadi string format Rupiah
 * Contoh input: 1000000 → "Rp 1.000.000"
 */
export const formatRupiahDisplay = (num: number | string): string => {
  const numeric =
    typeof num === "number" ? num : parseInt(num?.replace(/[^0-9]/g, ""));
  if (isNaN(numeric)) return "Rp 0";
  return "Rp " + numeric.toLocaleString("id-ID");
};

/**
 * Ambil nilai murni dari string "Rp 1.000.000" menjadi number 1000000
 */
export const parseRupiahToNumber = (value: string): number => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return parseInt(numericValue || "0", 10);
};

/**
 * Format tanggal ke dalam format "17 Juni 2025 20:32 WIB"
 * @param date - string ISO date atau timestamp
 */
export const formatDate = (date: string | number | Date): string => {
  return moment(date).locale("id").format("DD MMMM YYYY HH:mm") + " WIB";
};
