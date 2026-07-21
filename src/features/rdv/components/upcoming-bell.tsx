import {useState} from "react";
import {Modal, Pressable, StyleSheet, Text, View} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Colors,
  FontSize,
  FontWeight,
  IconSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import {formatRelativeDateTime} from "@/utils/date";
import type {Appointment} from "../types";

type UpcomingBellProps = {
  /**
   * Appointments happening today or tomorrow, sorted ascending. Narrower than
   * "à venir" on purpose — the badge counts these, not every future
   * appointment, which is why the web header can read "3 à venir" beside a
   * badge of 2.
   */
  soon: Appointment[];
  now: Date;
};

export default function UpcomingBell({soon, now}: UpcomingBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Prochains rendez-vous, ${soon.length}`}
        style={({pressed}) => [styles.bellButton, pressed && styles.pressed]}>
        <Feather name="bell" size={IconSize.md} color={Colors.text} />
        {soon.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{soon.length}</Text>
          </View>
        )}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        {/* Tapping the backdrop closes the popover, matching the web behaviour. */}
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.popover}>
            <Text style={styles.heading}>PROCHAINS RENDEZ-VOUS</Text>

            {soon.length === 0 ? (
              <Text style={styles.empty}>Aucun rendez-vous à venir.</Text>
            ) : (
              soon.map(appointment => (
                <View key={appointment.$id} style={styles.item}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {appointment.title}
                  </Text>
                  <View style={styles.itemDateRow}>
                    <AntDesign
                      name="clock-circle"
                      size={IconSize.sm}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.itemDate}>
                      {formatRelativeDateTime(appointment.startsAt, now)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  pressed: {
    opacity: 0.6,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.onPrimary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  backdrop: {
    flex: 1,
    backgroundColor: Colors.backdrop,
  },
  popover: {
    position: "absolute",
    top: 100,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  heading: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  empty: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  item: {
    gap: Spacing.xs,
  },
  itemTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  itemDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  itemDate: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
