import { ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { MENUDATA } from "@/constants/Dummy/Menu";
import { scale } from "@/utils/scaleSize";
import React, { memo } from "react";
import {
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const MenuItem = memo(
  ({ item }: { item: (typeof MENUDATA)[number]["data"][0] }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.item}
      onPress={item.onPress}
    >
      {item.icon}
      <ThemedGap width="sm" />
      <ThemedText type="Medium" size="md" color={Color.Text.Secondary}>
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  )
);

const SectionHeader = memo(({ title }: { title: string }) => (
  <View style={[styles.sectionHeader, title === "AKUN" && { marginTop: 0 }]}>
    <ThemedText type="SemiBold" size="md">
      {title.toUpperCase()}
    </ThemedText>
  </View>
));

const ProfileMenu = () => {
  return (
    <SectionList
      sections={MENUDATA}
      keyExtractor={(item, index) => `${item.title}-${index}`}
      renderItem={({ item }: SectionListRenderItemInfo<any>) => (
        <MenuItem item={item} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeader title={title} />
      )}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <ThemedGap height="sm" />}
      stickySectionHeadersEnabled={false}
      initialNumToRender={10}
      removeClippedSubviews={true}
    />
  );
};

export default memo(ProfileMenu);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(40),
  },
  sectionHeader: {
    marginTop: scale(20),
    marginBottom: scale(8),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderColor: Color.Gray[200],
  },
});
