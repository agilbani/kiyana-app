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