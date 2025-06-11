import { MenuSection } from "@/types/dummy";
import {
  IcLogout,
  IcMessageText,
  IcMoney,
  IcSetting,
  IcUser,
} from "@assets/icons";
import { router } from "expo-router";
import { ROUTES } from "../Routes";

export const MENUDATA: MenuSection[] = [
  {
    title: "AKUN",
    data: [
      {
        title: "Data Pribadi",
        icon: <IcUser />,
        onPress: () => router.push(ROUTES.PROFILE_PERSONAL_DATA),
      },
      {
        title: "Slip Gaji",
        icon: <IcMoney />,
        onPress: () => router.push(ROUTES.PROFILE_PAYROLL),
      },
    ],
  },
  {
    title: "PENGATURAN",
    data: [
      {
        title: "Ubah Kata Sandi",
        icon: <IcSetting />,
        onPress: () => router.push(ROUTES.PROFILE_CHANGE_PASSWORD),
      },
      {
        title: "Hubungi Kami",
        icon: <IcMessageText />,
        onPress: () => router.push(ROUTES.PROFILE_CONTACT_US),
      },
      {
        title: "Keluar",
        icon: <IcLogout />,
        onPress: () => router.replace(ROUTES.LOGIN),
      },
    ],
  },
];
