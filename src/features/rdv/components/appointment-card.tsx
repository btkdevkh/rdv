import {Pressable, StyleSheet, Text, View} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Badge from "@/components/badge";
import {
  Colors,
  FontSize,
  FontWeight,
  IconSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import {formatFullDateTime, isToday} from "@/utils/date";
import {isDone, isLate, type Appointment} from "../types";

type AppointmentCardProps = {
  appointment: Appointment;
  now: Date;
  onToggleDone: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
};

type IconActionProps = {
  name: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  color?: string;
};

function IconAction({
  name,
  label,
  onPress,
  color = Colors.textMuted,
}: IconActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={Spacing.sm}
      style={({pressed}) => [styles.iconAction, pressed && styles.pressed]}>
      <Feather name={name} size={IconSize.lg} color={color} />
    </Pressable>
  );
}

export default function AppointmentCard({
  appointment,
  now,
  onToggleDone,
  onEdit,
  onDelete,
}: AppointmentCardProps) {
  const done = isDone(appointment);
  const late = isLate(appointment, now);
  // Once something is overdue, "Aujourd'hui" adds nothing and costs a second
  // badge row on a narrow screen.
  const today = !done && !late && isToday(appointment.startsAt, now);

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, done && styles.titleDone]}
            numberOfLines={2}>
            {appointment.title}
          </Text>
          {done && <Badge label="Terminé" tone="neutral" />}
          {late && <Badge label="En retard" tone="danger" />}
          {today && <Badge label="Aujourd'hui" tone="solid" />}
          {!done && !late && <Badge label="À venir" tone="accent" />}
        </View>

        <View style={styles.dateRow}>
          <AntDesign
            name="clock-circle"
            size={IconSize.sm}
            color={done ? Colors.textDisabled : Colors.textMuted}
          />
          <Text style={[styles.date, done && styles.textDone]}>
            {formatFullDateTime(appointment.startsAt)}
          </Text>
        </View>

        {appointment.notes.length > 0 && (
          <Text
            style={[styles.notes, done && styles.textDone]}
            numberOfLines={2}>
            {appointment.notes}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <IconAction
          name={done ? "rotate-ccw" : "check"}
          label={done ? "Marquer comme à venir" : "Marquer comme terminé"}
          onPress={() => onToggleDone(appointment)}
        />
        <IconAction
          name="edit-2"
          label="Modifier"
          onPress={() => onEdit(appointment)}
        />
        <IconAction
          name="trash-2"
          label="Supprimer"
          onPress={() => onDelete(appointment)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  body: {
    flex: 1,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  titleDone: {
    color: Colors.textDisabled,
    textDecorationLine: "line-through",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  notes: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  textDone: {
    color: Colors.textDisabled,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  iconAction: {
    padding: Spacing.xs,
  },
  pressed: {
    opacity: 0.5,
  },
});
