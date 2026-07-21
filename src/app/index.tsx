import {useState} from "react";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {Redirect} from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Button from "@/components/button";
import {
  Colors,
  FontSize,
  FontWeight,
  IconSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import {useAuth} from "@/features/auth/auth-context";

const FEATURES = [
  {icon: "clock-circle", label: "Vos rendez-vous à venir, triés par date"},
  {icon: "check-circle", label: "Marquez-les comme terminés en un clic"},
] as const;

export default function LoginScreen() {
  const {user, isLoading, signInWithGoogle} = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/rendez-vous" />;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "La connexion a échoué.",
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <FontAwesome5
          name="calendar-alt"
          size={IconSize.xl}
          color={Colors.accent}
        />
      </View>

      <Text style={styles.title}>Rendez-vous</Text>

      <Text style={styles.intro}>
        Planifiez, suivez et gérez tous vos rendez-vous au même endroit.
        Connectez-vous pour retrouver les vôtres.
      </Text>

      <View style={styles.features}>
        {FEATURES.map(feature => (
          <View key={feature.label} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <AntDesign
                name={feature.icon}
                size={IconSize.md}
                color={Colors.accent}
              />
            </View>
            <Text style={styles.featureLabel}>{feature.label}</Text>
          </View>
        ))}
        <View style={styles.featureRow}>
          <View style={styles.featureIcon}>
            <FontAwesome5
              name="calendar-alt"
              size={IconSize.md}
              color={Colors.accent}
            />
          </View>
          <Text style={styles.featureLabel}>
            {"Repérez d'un coup d'œil ceux en retard"}
          </Text>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        label="Se connecter avec Google"
        onPress={handleSignIn}
        isLoading={isSigningIn}
        icon={
          <AntDesign
            name="google"
            size={IconSize.md}
            color={Colors.onPrimary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  logo: {
    padding: Spacing.md,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentSurface,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  intro: {
    textAlign: "center",
    fontSize: FontSize.md,
    color: Colors.textMuted,
    maxWidth: 340,
  },
  features: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  /**
   * The rows mix AntDesign and FontAwesome5 glyphs, whose intrinsic widths
   * differ. A fixed box keeps every label starting at the same x.
   */
  featureIcon: {
    width: IconSize.lg,
    alignItems: "center",
  },
  featureLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  error: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    textAlign: "center",
  },
});
