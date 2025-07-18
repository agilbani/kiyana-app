import {
  ThemedBadge,
  ThemedContainer,
  ThemedGap,
  ThemedHeader,
  ThemedImage,
  ThemedText,
} from "@/components";
import Color from "@/constants/Color";
import { MOCK_PRODUCTS } from "@/constants/Dummy/Product";
import Radius from "@/constants/Radius";
import GlobalStyles from "@/styles/common";
import { formatRupiahDisplay } from "@/utils/currency";
import { scale } from "@/utils/scaleSize";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ProductItem = React.memo(({ item }: any) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.productWrapper}>
      <View style={styles.rowStart}>
        <ThemedImage
          source={{ uri: item.image }}
          width={50}
          height={50}
          style={styles.image}
        />
        <ThemedGap width="sm" />
        <View style={GlobalStyles.flex}>
          <ThemedText type="SemiBold" size="md">
            {item.name}
          </ThemedText>
          <ThemedGap height="xs" />
          <ThemedText type="Medium" size="xs" color={Color.Text.Secondary}>
            SKU: {item.sku}
          </ThemedText>
          <ThemedText type="Medium" size="xs" color={Color.Text.Secondary}>
            Stok: {item.stock}
          </ThemedText>
          <ThemedText type="Medium" size="xs" color={Color.Text.Secondary}>
            Harga: {formatRupiahDisplay(item.price)}
          </ThemedText>
        </View>
      </View>
      <ThemedGap height="sm" />
      <View style={styles.rowEnd}>
        <ThemedBadge
          text={item.status}
          backgroundColor={
            item.status === "Aktif" ? Color.Green[400] : Color.Gray[400]
          }
          textColor={Color.Base.White}
        />
      </View>
    </TouchableOpacity>
  );
});

const ListOfProductScreen = () => {
  const renderProductItem = useCallback(
    ({ item }: any) => <ProductItem item={item} />,
    []
  );

  return (
    <ThemedContainer>
      <ThemedHeader title="Daftar Produk" />
      <View style={styles.container}>
        <FlatList
          data={MOCK_PRODUCTS}
          renderItem={renderProductItem}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <ThemedGap height="sm" />}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={Platform.OS === "android"}
        />
      </View>
    </ThemedContainer>
  );
};

export default ListOfProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    ...GlobalStyles.flex,
  },
  productWrapper: {
    backgroundColor: Color.Gray[50],
    padding: scale(12),
    borderWidth: 1,
    borderColor: Color.Gray[200],
    borderRadius: Radius.xs,
  },
  image: {
    borderRadius: Radius.xs,
  },
  rowStart: {
    justifyContent: "flex-start",
    ...GlobalStyles.rowCenter,
  },
  rowEnd: {
    justifyContent: "flex-end",
    ...GlobalStyles.rowCenter,
  },
});
