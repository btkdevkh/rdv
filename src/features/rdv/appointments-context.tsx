import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {useAuth} from "@/features/auth/auth-context";
import * as repository from "./appointments-repository";
import {syncReminders, clearReminders} from "./reminders";
import {AppointmentStatus, type Appointment} from "./types";
import type {NewAppointment} from "./appointments-repository";

type AppointmentsContextValue = {
  appointments: Appointment[];
  isLoading: boolean;
  /** Set when the last load or mutation failed, so the screen can show it. */
  error: string | null;
  reload: () => Promise<void>;
  create: (input: NewAppointment) => Promise<void>;
  update: (id: string, input: NewAppointment) => Promise<void>;
  toggleDone: (appointment: Appointment) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(
  null,
);

const GENERIC_ERROR = "Une erreur est survenue. Réessayez.";

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : GENERIC_ERROR;
}

export function AppointmentsProvider({children}: PropsWithChildren) {
  const {user} = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      return;
    }
    setIsLoading(true);
    try {
      const rows = await repository.listAppointments(user.$id);
      setAppointments(rows);
      setError(null);
      // Reminders are rebuilt from the fresh list; failures here must not
      // break the screen, the user simply gets no reminder.
      syncReminders(rows, new Date()).catch(() => {});
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Fetching on sign-in is a genuine external-system sync; the rule flags
      // the setIsLoading(true) that reload() performs before awaiting.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      reload();
    } else {
      setAppointments([]);
      clearReminders().catch(() => {});
    }
  }, [user, reload]);

  /** Every mutation re-reads the list so derived counts stay consistent. */
  const mutate = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        await action();
        setError(null);
      } catch (caught) {
        setError(messageOf(caught));
        throw caught;
      } finally {
        await reload();
      }
    },
    [reload],
  );

  const create = useCallback(
    async (input: NewAppointment) => {
      if (!user) throw new Error("Vous devez être connecté.");
      await mutate(() => repository.createAppointment(user.$id, input));
    },
    [user, mutate],
  );

  const update = useCallback(
    async (id: string, input: NewAppointment) => {
      await mutate(() => repository.updateAppointment(id, input));
    },
    [mutate],
  );

  const toggleDone = useCallback(
    async (appointment: Appointment) => {
      const next =
        appointment.status === AppointmentStatus.Done
          ? AppointmentStatus.Pending
          : AppointmentStatus.Done;
      await mutate(() =>
        repository.setAppointmentStatus(appointment.$id, next),
      );
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await mutate(() => repository.deleteAppointment(id));
    },
    [mutate],
  );

  const value = useMemo(
    () => ({
      appointments,
      isLoading,
      error,
      reload,
      create,
      update,
      toggleDone,
      remove,
    }),
    [
      appointments,
      isLoading,
      error,
      reload,
      create,
      update,
      toggleDone,
      remove,
    ],
  );

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments(): AppointmentsContextValue {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error(
      "useAppointments doit être utilisé dans un <AppointmentsProvider>.",
    );
  }
  return context;
}
