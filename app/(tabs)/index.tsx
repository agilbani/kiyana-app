import ThemedText from "@/components/ThemedText";
import React from "react";
import { View } from "react-native";

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText size="lg" type="Bold">
        Helxxlxo{" "}
        <ThemedText type="Medium" size="xs">
          Woxxrsld
        </ThemedText>
        !
      </ThemedText>
      <ThemedText type="Medium" size="md">
        Worsxld s
      </ThemedText>
    </View>
  );
};

export default HomeScreen;
