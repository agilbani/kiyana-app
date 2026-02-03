import { Attendance } from "@/types/attendance";
import moment from "moment";

type YearOption = {
   name: string;
   value: string;
};

type GroupedAttendance = {
  date: string;
  items: Attendance[];
};

export function getDateRange(value: string) {
  let startDate = moment();
  let endDate = moment();

  switch (value) {
    case "today":
      startDate = moment().startOf("day");
      endDate = moment().endOf("day");
      break;

    case "weekly":
      startDate = moment().startOf("week"); // default week starts on Sunday (can be changed with locale)
      endDate = moment().endOf("week");
      break;

    case "biweekly":
      startDate = moment().subtract(13, "days").startOf("day"); // last 14 days including today
      endDate = moment().endOf("day");
      break;

    case "threeweeks":
      startDate = moment().subtract(20, "days").startOf("day"); // last 21 days
      endDate = moment().endOf("day");
      break;

    case "month":
      startDate = moment().startOf("month");
      endDate = moment().endOf("month");
      break;

    default:
      startDate = moment().startOf("day");
      endDate = moment().endOf("day");
      break;
  }

  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
  };
}

export function calculateTax(total: number, taxPercent: number) {
  const taxAmount = (total * taxPercent) / 100;
  const totalWithTax = total + taxAmount;
  return { taxAmount, totalWithTax };
}

export const generateYears = (): YearOption[] => {
   const currentYear = moment().year();
   const years: YearOption[] = [];

   for (let i = 0; i < 20; i++) {
      const year = currentYear - i;
      years.push({
         name: year.toString(),   // display text
         value: year.toString(),  // actual value
      });
   }

   return years;
};

/**
 * Group attendance data by date and sort by newest first
 * @param data - array of attendance objects
 * @returns grouped array sorted by date (newest first)
 */
export function groupAttendanceByDate(data: Attendance[]): GroupedAttendance[] {
  const grouped = Object.entries(
    data.reduce((acc, curr) => {
      (acc[curr.date] ||= []).push(curr);
      return acc;
    }, {} as Record<string, Attendance[]>)
  )
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return grouped;
}

export function getAttendanceButtonType(data: any) {
   // console.log('data host', data);
   
  const now = moment();

  // parse start & end sebagai hari ini dulu
  let startTime = moment(data.start_time, "HH:mm");
  let endTime = moment(data.end_time, "HH:mm");

  // jika endTime <= startTime (shift lewat tengah malam), taruh endTime ke hari berikutnya
  if (endTime.isSameOrBefore(startTime)) {
    endTime.add(1, "day");
  }

  // jika sekarang sudah lewat endTime (jadwal hari ini sudah selesai),
  // anggap jadwal ini untuk besok -> bump start & end ke +1 day
  if (now.isAfter(endTime)) {
    startTime.add(1, "day");
    endTime.add(1, "day");
  }

  // === CONDITION: tampilkan tombol "masuk" ===
  // Jika belum clock_in, dan waktu sekarang BELUM lewat start_time, dan BELUM lewat end_time
  if (data.clock_in === null && now.isBefore(startTime) && now.isBefore(endTime)) {
    return "Masuk";
  }
  // === CONDITION: tampilkan tombol "pulang" ===
  // Jika sudah clock_in tapi belum clock_out, dan sekarang SUDAH lewat end_time
//   if (data.clock_in !== null && data.clock_out === null && moment(new Date()).format('HH:mm') > data.end_time) {
   if (data.clock_in !== null && data.clock_out === null) {   
    return "Pulang";
  }

  return null;
}

export function getAttendanceStatus(data: any) {
  const now = moment();
  let startTime = moment(data.start_time, "HH:mm");
  let endTime = moment(data.end_time, "HH:mm");

  // Jika end_time lebih kecil dari start_time (shift lewat tengah malam)
  if (endTime.isSameOrBefore(startTime)) {
    endTime.add(1, "day");
  }

  // Jika waktu sekarang sudah lewat end_time → jadwal selesai
  if (now.isAfter(endTime)) {
    return "Jadwal telah selesai";
  }

  // Hitung selisih waktu dari sekarang ke end_time (dalam jam)
  const diffHours = endTime.diff(now, "hours");

  // Jika waktu sekarang masih jauh dari end_time (>= 3 jam sebelumnya)
  if (diffHours >= 3) {
    return "Jadwal mendatang";
  }

  // Jika tidak memenuhi dua kondisi di atas, berarti jadwal sedang berlangsung
  return "Jadwal sedang berjalan";
}

export function getWorkType(data: any) {
  const startTime = moment(data.start_time, "HH:mm");
  const hour = startTime.hour(); // ambil jam dalam bentuk angka (0–23)

  if ([12, 18, 21].includes(hour)) {
    return "Primetime";
  }

  if (hour === 0) {
    return "Extratime";
  }

  return "Regular";
}

export function getAttendanceStatusShift(data: any) {
  const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
   if (!data) return 'Belum absen'
  // Jika tanggal absensi bukan hari ini
  if (data.date !== today) {
    return 'Bukan hari ini';
  }

  // Jika belum absen (clock_in masih null)
  if (data.clock_in === null) {
    return 'Belum absen';
  }

  if (data.clock_in && data.clock_out) {
   return 'Hadir'
  }

  // Jika sudah absen masuk
  return 'Sudah absen masuk';
}

/**
 * Mengecek apakah tombol "Masuk" boleh tampil.
 *
 * @param {string} jamMasukStr - Jam masuk dari BE (format "HH:mm")
 * @param {string} [jamBatasStr='06:30'] - Jam batas maksimal (opsional, default +30 menit dari jam masuk)
 * @returns {boolean} true jika tombol boleh tampil, false jika tidak
 */
export const canShowMasukButton = (jamMasukStr: string, jamBatasStr?: string) => {
  const jamMasuk = moment(jamMasukStr, 'HH:mm');
  const batasAkhir = jamBatasStr
    ? moment(jamBatasStr, 'HH:mm')
    : moment(jamMasuk).add(30, 'minutes'); // default: 30 menit setelah jam masuk

  const now = moment();

  if (now.isBefore(jamMasuk)) return true; // sebelum jam masuk
  if (now.isBetween(jamMasuk, batasAkhir, undefined, '[]')) return true; // di antara jam masuk & batas akhir
  return false; // sudah lewat
};

export function getMonthDateRange(date = moment()) {
  return {
    startDate: date.clone().startOf('month').format('YYYY-MM-DD'),
    endDate: date.clone().endOf('month').format('YYYY-MM-DD'),
  };
}