import {Pressable, ScrollView, StyleSheet, Text} from "react-native";
import {Colors, FontSize, FontWeight, Radius, Spacing} from "@/constants/theme";
import {
  AppointmentFilter,
  FILTER_LABELS,
  type AppointmentCounts,
} from "../types";

const FILTER_ORDER: AppointmentFilter[] = [
  AppointmentFilter.All,
  AppointmentFilter.Upcoming,
  AppointmentFilter.Late,
  AppointmentFilter.Done,
];

type FilterChipsProps = {
  value: AppointmentFilter;
  counts: AppointmentCounts;
  onChange: (filter: AppointmentFilter) => void;
};

export default function FilterChips({
  value,
  counts,
  onChange,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {FILTER_ORDER.map(filter => {
        const isActive = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            accessibilityRole="tab"
            accessibilityState={{selected: isActive}}
            style={[styles.chip, isActive && styles.chipActive]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {FILTER_LABELS[filter]}{" "}
              <Text style={styles.count}>{counts[filter]}</Text>
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.xs,
    padding: Spacing.xs,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.onPrimary,
  },
  count: {
    fontWeight: FontWeight.regular,
  },
});
