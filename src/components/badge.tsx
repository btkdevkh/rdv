import {StyleSheet, Text, View} from "react-native";
import {Colors, FontSize, FontWeight, Radius, Spacing} from "@/constants/theme";

export type BadgeTone = "accent" | "danger" | "neutral" | "solid";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export default function Badge({label, tone = "neutral"}: BadgeProps) {
  return (
    <View style={[styles.badge, containerTone[tone]]}>
      <Text style={[styles.label, labelTone[tone]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});

const containerTone = StyleSheet.create({
  accent: {backgroundColor: Colors.accentSurface},
  danger: {backgroundColor: Colors.dangerSurface},
  neutral: {backgroundColor: Colors.neutralSurface},
  solid: {backgroundColor: Colors.accent},
});

const labelTone = StyleSheet.create({
  accent: {color: Colors.accent},
  danger: {color: Colors.danger},
  neutral: {color: Colors.textMuted},
  solid: {color: Colors.onPrimary},
});
