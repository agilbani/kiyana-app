import { ThemedGap, ThemedText } from "@/components/ui";
import Color from "@/constants/Color";
import { MENUDATA } from "@/constants/Dummy/Menu";
import GlobalStyles from "@/styles/common";
import { scale } from "@/utils/scaleSize";
import React, { memo } from "react";
import {
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
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
  <ThemedText type="SemiBold" size="md">
    {title.toUpperCase()}
  </ThemedText>
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
      SectionSeparatorComponent={() => <ThemedGap height="xl" />}
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
  item: {
    paddingTop: scale(4),
    paddingBottom: scale(12),
    borderBottomWidth: 1,
    borderColor: Color.Gray[200],
    ...GlobalStyles.rowCenter,
  },
});
