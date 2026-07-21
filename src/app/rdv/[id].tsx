import {ScrollView, StyleSheet, Text} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Colors, FontSize, Spacing} from "@/constants/theme";
import {useAppointments} from "@/features/rdv/appointments-context";
import AppointmentForm from "@/features/rdv/components/appointment-form";
import type {NewAppointment} from "@/features/rdv/appointments-repository";

export default function EditAppointmentScreen() {
  const router = useRouter();
  const {id} = useLocalSearchParams<{id: string}>();
  const {appointments, update} = useAppointments();

  const appointment = appointments.find(item => item.$id === id);

  if (!appointment) {
    return <Text style={styles.missing}>Ce rendez-vous est introuvable.</Text>;
  }

  const handleSubmit = async (input: NewAppointment) => {
    await update(appointment.$id, input);
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <AppointmentForm
        initialValue={{
          title: appointment.title,
          notes: appointment.notes,
          startsAt: new Date(appointment.startsAt),
        }}
        submitLabel="Enregistrer"
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
  missing: {
    padding: Spacing.xl,
    textAlign: "center",
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
