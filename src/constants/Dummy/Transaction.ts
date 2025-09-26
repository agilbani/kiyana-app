import { TransactionStatus } from "../Enum";

export const MOCK_TRANSACTIONS = [
  {
    id: "1",
    name: "Kirim uang",
    status: TransactionStatus.SUCCESS,
  },
  {
    id: "2",
    name: "Ambil Uang",
    status: TransactionStatus.PROCESSING,
  },
  {
    id: "3",
    name: "Kirim uang",
    status: TransactionStatus.PROCESSING,
  },
  {
    id: "4",
    name: "Pengajuan Kasbon",
    status: TransactionStatus.FAILED,
  },
  {
    id: "5",
    name: "Kirim Uang",
    status: TransactionStatus.SUCCESS,
  },
  {
    id: "6",
    name: "Kirim Uang",
    status: TransactionStatus.SUCCESS,
  },
  {
    id: "7",
    name: "Kirim Uang",
    status: TransactionStatus.SUCCESS,
  },
  {
    id: "8",
    name: "Kirim Uang",
    status: TransactionStatus.SUCCESS,
  },
];
