import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CountDownScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LoaderScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(modal)/intervalModal"
        options={{
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
