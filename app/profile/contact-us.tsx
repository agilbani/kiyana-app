import {
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { scale, verticalScale } from "@/utils/scaleSize";
import React, { memo, useCallback } from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const contactData = [
  { id: "1", name: "Staff Produksi", phone: "+6281234567890" },
  { id: "2", name: "Kepala Gudang", phone: "+6281122334455" },
  { id: "3", name: "HRD", phone: "+6285678901234" },
  { id: "4", name: "Finance", phone: "+6289988776655" },
];

const ContactItem = memo(
  ({
    name,
    phone,
    onPress,
  }: {
    name: string;
    phone: string;
    onPress: (phone: string) => void;
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(phone)}
        style={styles.card}
      >
        <ThemedText type="SemiBold" size="md">
          {name}
        </ThemedText>
        <ThemedGap height="xxs" />
        <ThemedText type="Regular" size="sm" color={Color.Gray[600]}>
          {phone}
        </ThemedText>
      </TouchableOpacity>
    );
  }
);

const ContactUsScreen = () => {
  const handleContactPress = useCallback((phone: string) => {
    Linking.openURL(`https://wa.me/${phone.replace("+", "")}`);
  }, []);

  return (
    <ThemedContainer>
      <ThemedHeader title="Hubungi Kami" />
      <View style={styles.container}>
        <FlatList
          data={contactData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            gap: verticalScale(12),
            paddingHorizontal: scale(12),
          }}
          renderItem={({ item }) => (
            <ContactItem
              name={item.name}
              phone={item.phone}
              onPress={handleContactPress}
            />
          )}
          initialNumToRender={4}
          maxToRenderPerBatch={6}
          windowSize={10}
          removeClippedSubviews={true}
        />
      </View>
    </ThemedContainer>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Purple[50],
    paddingHorizontal: scale(4),
    paddingVertical: scale(16),
    ...GlobalStyles.flex,
  },
  card: {
    backgroundColor: Color.Background.Background,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: Radius.sm,
    ...GlobalStyles.shadow,
  },
});
