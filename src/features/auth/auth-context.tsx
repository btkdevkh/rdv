import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {OAuthProvider, type Models} from "react-native-appwrite";
import {account} from "@/lib/appwrite";

type AuthContextValue = {
  user: Models.User<Models.Preferences> | null;
  /** True only while the initial session check is in flight. */
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: PropsWithChildren) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUser(await account.get());
    } catch {
      // No active session — expected on first launch and after sign-out.
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Restoring the session on mount is exactly the "subscribe to an external
    // system" case the rule exempts, but it cannot see through the promise.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const signInWithGoogle = useCallback(async () => {
    const redirectUri = Linking.createURL("/");

    const loginUrl = account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: redirectUri,
      failure: redirectUri,
    });
    if (!loginUrl) {
      throw new Error("Appwrite n'a pas renvoyé d'URL de connexion.");
    }

    const result = await WebBrowser.openAuthSessionAsync(
      loginUrl.toString(),
      redirectUri,
    );
    if (result.type !== "success") {
      // User dismissed the browser — not an error worth surfacing.
      return;
    }

    const params = new URL(result.url).searchParams;
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (!userId || !secret) {
      throw new Error("Connexion Google échouée : réponse incomplète.");
    }

    await account.createSession({userId, secret});
    await refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await account.deleteSession({sessionId: "current"});
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({user, isLoading, signInWithGoogle, signOut}),
    [user, isLoading, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>.");
  }
  return context;
}
