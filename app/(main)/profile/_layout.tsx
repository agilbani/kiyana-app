import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
      }}
    />
  );
};

export default ProfileLayout;
