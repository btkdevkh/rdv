import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {Colors, FontSize, FontWeight, Radius, Spacing} from "@/constants/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  isLoading = false,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, busy: isLoading}}
      style={({pressed}) => [
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.onPrimary : Colors.text}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              variant === "primary"
                ? styles.primaryLabel
                : styles.secondaryLabel,
              isDisabled && styles.disabledLabel,
            ]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    minHeight: 48,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  /**
   * A flat grey fill, not blanket opacity — fading the black primary fill over
   * a light page turns it into a heavy muddy slab.
   */
  disabled: {
    backgroundColor: Colors.neutralSurface,
    borderColor: Colors.border,
  },
  disabledLabel: {
    color: Colors.textDisabled,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  primaryLabel: {
    color: Colors.onPrimary,
  },
  secondaryLabel: {
    color: Colors.text,
  },
});
