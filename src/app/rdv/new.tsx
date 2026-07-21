import {ScrollView, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import {Colors, Spacing} from "@/constants/theme";
import {useAppointments} from "@/features/rdv/appointments-context";
import AppointmentForm from "@/features/rdv/components/appointment-form";
import type {NewAppointment} from "@/features/rdv/appointments-repository";

export default function NewAppointmentScreen() {
  const router = useRouter();
  const {create} = useAppointments();

  const handleSubmit = async (input: NewAppointment) => {
    await create(input);
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <AppointmentForm
        submitLabel="Ajouter"
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    flexGrow: 1,
  },
});
