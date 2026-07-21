import Constants, {ExecutionEnvironment} from "expo-constants";

/**
 * True when running inside the Expo Go sandbox rather than a build of this app.
 *
 * Two things behave differently there and both need this flag:
 * - expo-notifications throws on import (Android support was dropped in SDK 53)
 * - deep links come back over `exp://`, not the app's own scheme
 */
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
