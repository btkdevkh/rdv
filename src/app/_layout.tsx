import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthProvider} from "@/features/auth/auth-context";
import {AppointmentsProvider} from "@/features/rdv/appointments-context";
import {Colors} from "@/constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppointmentsProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {backgroundColor: Colors.background},
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="rendez-vous" />
            <Stack.Screen
              name="rdv/new"
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Nouveau rendez-vous",
              }}
            />
            <Stack.Screen
              name="rdv/[id]"
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Modifier le rendez-vous",
              }}
            />
          </Stack>
        </AppointmentsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
