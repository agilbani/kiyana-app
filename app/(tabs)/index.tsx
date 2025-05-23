import ThemedGap from "@/components/ThemedGap";
import ThemedImage from "@/components/ThemedImage";
import React from "react";
import { View } from "react-native";

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedImage
        source={{ uri: "https://picsum.photos/200" }}
        width={200}
        height={200}
        delayBeforeLoad={5000}
        borderRadius={12}
      />
      <ThemedGap height={20} />
      <ThemedImage
        source={{ uri: "https://picsum.photos/200" }}
        width={200}
        height={200}
        delayBeforeLoad={5000}
        borderRadius={12}
      />
    </View>
  );
};

export default HomeScreen;
