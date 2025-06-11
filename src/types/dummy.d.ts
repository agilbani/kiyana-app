interface MenuItem {
  title: string;
  icon: ReactNode;
  onPress: () => void;
}

export interface MenuSection {
  title: string;
  data: MenuItem[];
}
