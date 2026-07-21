import {useMemo, useState} from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Redirect, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "@/components/button";
import {
  Colors,
  FontSize,
  FontWeight,
  IconSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import {useNow} from "@/hooks/use-now";
import {useAuth} from "@/features/auth/auth-context";
import {useAppointments} from "@/features/rdv/appointments-context";
import AppointmentCard from "@/features/rdv/components/appointment-card";
import FilterChips from "@/features/rdv/components/filter-chips";
import UpcomingBell from "@/features/rdv/components/upcoming-bell";
import {
  AppointmentFilter,
  countByFilter,
  isSoon,
  matchesFilter,
  type Appointment,
} from "@/features/rdv/types";

/** Initials for the avatar, e.g. "James Will" → "JW". */
function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AppointmentsScreen() {
  const router = useRouter();
  const {user, isLoading: isAuthLoading, signOut} = useAuth();
  const {appointments, isLoading, error, reload, toggleDone, remove} =
    useAppointments();

  const [filter, setFilter] = useState<AppointmentFilter>(
    AppointmentFilter.All,
  );
  const [isOldestFirst, setIsOldestFirst] = useState(true);

  const now = useNow();

  const counts = useMemo(
    () => countByFilter(appointments, now),
    [appointments, now],
  );

  const soon = useMemo(
    () => appointments.filter(a => isSoon(a, now)),
    [appointments, now],
  );

  const visible = useMemo(() => {
    // The repository returns them oldest-first already.
    const filtered = appointments.filter(a => matchesFilter(a, filter, now));
    return isOldestFirst ? filtered : [...filtered].reverse();
  }, [appointments, filter, now, isOldestFirst]);

  if (isAuthLoading) return null;
  if (!user) return <Redirect href="/" />;

  const confirmDelete = (appointment: Appointment) => {
    Alert.alert("Supprimer ce rendez-vous ?", appointment.title, [
      {text: "Annuler", style: "cancel"},
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => remove(appointment.$id).catch(() => {}),
      },
    ]);
  };

  const summary = [
    `${counts.upcoming} à venir`,
    `${counts.done} terminés`,
  ].join(" · ");

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brand}>
            <FontAwesome5
              name="calendar-alt"
              size={IconSize.lg}
              color={Colors.accent}
            />
            <Text style={styles.brandTitle}>Rendez-vous</Text>
          </View>

          {/*
            The web header also shows the user's full name. There is no room for
            it beside the title on a phone, so the avatar carries identity alone.
          */}
          <View style={styles.headerActions}>
            <UpcomingBell soon={soon} now={now} />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initialsOf(user.name || user.email)}
              </Text>
            </View>
            <Pressable
              onPress={() => signOut()}
              accessibilityRole="button"
              accessibilityLabel="Se déconnecter"
              style={({pressed}) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}>
              <Feather name="log-out" size={IconSize.md} color={Colors.text} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.summary}>
          {summary}
          {counts.late > 0 && (
            <Text style={styles.summaryLate}> · {counts.late} en retard</Text>
          )}
        </Text>

        <FilterChips value={filter} counts={counts} onChange={setFilter} />

        <View style={styles.toolbar}>
          <Button
            label={
              isOldestFirst ? "Plus anciens d'abord" : "Plus récents d'abord"
            }
            variant="secondary"
            onPress={() => setIsOldestFirst(current => !current)}
            icon={
              <MaterialCommunityIcons
                name="swap-vertical"
                size={IconSize.md}
                color={Colors.text}
              />
            }
            style={styles.sortButton}
          />
          <Button
            label="Ajouter"
            onPress={() => router.push("/rdv/new")}
            icon={
              <Feather
                name="plus"
                size={IconSize.md}
                color={Colors.onPrimary}
              />
            }
          />
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={visible}
        keyExtractor={item => item.$id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reload} />
        }
        ListEmptyComponent={
          isLoading ? null : (
            <Text style={styles.empty}>Aucun rendez-vous à afficher.</Text>
          )
        }
        renderItem={({item}) => (
          <AppointmentCard
            appointment={item}
            now={now}
            onToggleDone={appointment =>
              toggleDone(appointment).catch(() => {})
            }
            onEdit={appointment =>
              router.push({
                pathname: "/rdv/[id]",
                params: {id: appointment.$id},
              })
            }
            onDelete={confirmDelete}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  brandTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.onPrimary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  /** Bordered white square, matching the bell and the web header buttons. */
  iconButton: {
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
  summary: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  summaryLate: {
    color: Colors.danger,
    fontWeight: FontWeight.semibold,
  },
  toolbar: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  sortButton: {
    flex: 1,
  },
  list: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  empty: {
    textAlign: "center",
    paddingVertical: Spacing.xxl,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  error: {
    marginHorizontal: Spacing.lg,
    fontSize: FontSize.sm,
    color: Colors.danger,
  },
});
