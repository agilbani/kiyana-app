import { Stack } from "expo-router";

const OnboardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
      }}
    />
  );
};

export default OnboardingLayout;
