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
import {isExpoGo} from "@/lib/runtime";
import {AppwriteConfig} from "@/constants/config";

type AuthContextValue = {
  user: Models.User<Models.Preferences> | null;
  /** True only while the initial session check is in flight. */
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Where Appwrite sends the browser back to after Google signs the user in.
 *
 * Appwrite validates this against the platforms registered on the project and
 * rejects anything else with "invalid success param". For a real build the only
 * accepted form is `appwrite-callback-<PROJECT_ID>://`, which is why that scheme
 * is registered alongside `rdv` in app.json.
 *
 * Expo Go cannot receive a custom scheme — links arrive over `exp://` — so it
 * keeps using the URL expo-linking derives for the dev server.
 */
function oauthRedirectUri(): string {
  return isExpoGo
    ? Linking.createURL("/")
    : `appwrite-callback-${AppwriteConfig.projectId}://`;
}

/**
 * Pulls userId and secret off the callback URL.
 *
 * Read by hand rather than through `new URL()`: the returned link uses a custom
 * scheme with an empty host (`appwrite-callback-rdv-app://?userId=…`), and URL
 * parsing of non-special schemes is inconsistent enough across engines that it
 * is not worth relying on. Handles the query arriving after `?` or `#`.
 */
function callbackParams(url: string): URLSearchParams {
  const queryStart = url.indexOf("?");
  if (queryStart !== -1) {
    const rest = url.slice(queryStart + 1);
    // Appwrite ends the callback with a bare "#". Without cutting there, the
    // last parameter swallows it and Appwrite rejects the userId.
    const fragment = rest.indexOf("#");
    return new URLSearchParams(
      fragment === -1 ? rest : rest.slice(0, fragment),
    );
  }

  const hashStart = url.indexOf("#");
  return new URLSearchParams(hashStart === -1 ? "" : url.slice(hashStart + 1));
}

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
    const redirectUri = oauthRedirectUri();

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

    const params = callbackParams(result.url);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (!userId || !secret) {
      // Naming the parameters that did arrive turns "réponse incomplète" into
      // something diagnosable from a screenshot. Values are left out — one of
      // them is the session secret.
      const received = [...params.keys()].join(", ") || "aucun";
      throw new Error(
        `Connexion Google échouée : réponse incomplète (paramètres reçus : ${received}).`,
      );
    }

    try {
      await account.createSession({userId, secret});
    } catch (caught) {
      // Appwrite validates userId server-side and rejects malformed values.
      // The id is not sensitive, so echoing it identifies a mangled callback
      // immediately; the secret is never included.
      const reason = caught instanceof Error ? caught.message : String(caught);
      throw new Error(`${reason} — userId reçu : "${userId}"`);
    }
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
