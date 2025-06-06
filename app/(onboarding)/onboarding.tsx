import { ThemedGap } from "@/components";
import OnboardingActions from "@/components/screens/OnBoarding/OnboardingActions";
import OnboardingDots from "@/components/screens/OnBoarding/OnboardingDots";
import OnboardingSlide from "@/components/screens/OnBoarding/OnboardingSlide";
import Color from "@/constants/Color";
import { SLIDES } from "@/constants/Dummy/OnBoarding";
import { ROUTES } from "@/constants/Routes";
import GlobalStyles from "@/styles/common";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const translateX = scrollX.interpolate({
    inputRange: SLIDES.map((_, i) => i * width),
    outputRange: SLIDES.map((_, i) => i * 26),
  });

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentIndex(index);
    },
    []
  );

  const goToNextSlide = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      handleSkip();
    }
  }, [currentIndex]);

  const handleSkip = useCallback(async () => {
    await SecureStore.setItemAsync("hasSeenOnboarding", "true");
    router.replace(ROUTES.PERMISSIONS);
  }, []);

  return (
    <View style={[GlobalStyles.flex, styles.page]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <OnboardingSlide
            image={item.image}
            title={item.title}
            description={item.description}
          />
        )}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      <OnboardingDots slidesLength={SLIDES.length} translateX={translateX} />
      <ThemedGap height="xl" />
      <OnboardingActions onNext={goToNextSlide} onSkip={handleSkip} />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: Color.Background.Background,
  },
});
