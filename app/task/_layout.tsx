import { Stack } from "expo-router";

const TaskLayout = () => {
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
export default TaskLayout;
