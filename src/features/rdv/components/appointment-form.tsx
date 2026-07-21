import {useState} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import Button from "@/components/button";
import {
  Colors,
  FontSize,
  FontWeight,
  IconSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import {
  combineDateAndTime,
  formatDateInput,
  formatTimeInput,
} from "@/utils/date";
import type {NewAppointment} from "../appointments-repository";

type AppointmentFormProps = {
  /** Pre-fills the form when editing; omit to create. */
  initialValue?: NewAppointment;
  submitLabel: string;
  onSubmit: (input: NewAppointment) => Promise<void>;
  onCancel: () => void;
};

/** Defaults a new appointment to the next full hour. */
function nextHour(): Date {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return date;
}

type PickerMode = "date" | "time" | null;

export default function AppointmentForm({
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [notes, setNotes] = useState(initialValue?.notes ?? "");
  const [startsAt, setStartsAt] = useState(
    initialValue?.startsAt ?? nextHour(),
  );
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim().length > 0 && !isSubmitting;

  const handlePickerChange = (event: DateTimePickerEvent, picked?: Date) => {
    // On Android the picker is a dialog that must be dismissed either way.
    if (Platform.OS === "android") setPickerMode(null);
    if (event.type === "dismissed" || !picked) return;

    setStartsAt(current =>
      pickerMode === "date"
        ? combineDateAndTime(picked, current)
        : combineDateAndTime(current, picked),
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({title, notes, startsAt});
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "L'enregistrement a échoué.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>TITRE</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Dentiste, réunion, café avec Sam…"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          autoFocus={!initialValue}
          returnKeyType="next"
        />
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>DATE</Text>
          <Pressable
            onPress={() => setPickerMode("date")}
            accessibilityRole="button"
            style={styles.input}>
            <Feather
              name="calendar"
              size={IconSize.md}
              color={Colors.textMuted}
            />
            <Text style={styles.inputText}>{formatDateInput(startsAt)}</Text>
          </Pressable>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>HEURE</Text>
          <Pressable
            onPress={() => setPickerMode("time")}
            accessibilityRole="button"
            style={styles.input}>
            <Feather name="clock" size={IconSize.md} color={Colors.textMuted} />
            <Text style={styles.inputText}>{formatTimeInput(startsAt)}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>NOTES</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Facultatif — lieu, préparation, participants…"
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, styles.multiline]}
          multiline
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actions}>
        <Button label="Annuler" variant="secondary" onPress={onCancel} />
        <Button
          label={submitLabel}
          onPress={handleSubmit}
          disabled={!canSubmit}
          isLoading={isSubmitting}
          // "+ Ajouter" when creating; plain "Enregistrer" when editing.
          // The icon colour has to track the disabled state itself, since
          // Button cannot restyle an element handed to it.
          icon={
            initialValue ? undefined : (
              <Feather
                name="plus"
                size={IconSize.md}
                color={canSubmit ? Colors.onPrimary : Colors.textDisabled}
              />
            )
          }
          style={styles.submit}
        />
      </View>

      {pickerMode && (
        <DateTimePicker
          value={startsAt}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  field: {
    flex: 1,
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  inputText: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  error: {
    fontSize: FontSize.sm,
    color: Colors.danger,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.md,
  },
  submit: {
    minWidth: 140,
  },
});
