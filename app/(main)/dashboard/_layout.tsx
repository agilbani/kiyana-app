import { Stack } from "expo-router";

const DashboardLayout = () => {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
        animation: "ios_from_left",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default DashboardLayout;
