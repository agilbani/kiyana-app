import Color from "./Color";

export enum TransactionStatus {
  SUCCESS = "Selesai",
  PROCESSING = "Diproses",
  FAILED = "Ditolak",
  ACTIVE = 'Aktif'
}

export const TransactionStatusColor = {
  [TransactionStatus.SUCCESS]: {
    backgroundColor: Color.Green[500],
    textColor: Color.Base.White,
  },
  [TransactionStatus.ACTIVE]: {
    backgroundColor: Color.Green[500],
    textColor: Color.Base.White,
  },
  [TransactionStatus.PROCESSING]: {
    backgroundColor: Color.Gray[200],
    textColor: Color.Gray[600],
  },
  [TransactionStatus.FAILED]: {
    backgroundColor: Color.Red[500],
    textColor: Color.Base.White,
  },
} as const;
