import "react-native-url-polyfill/auto";
import {Account, Client, TablesDB} from "react-native-appwrite";
import {AppwriteConfig} from "@/constants/config";

/**
 * Single shared Appwrite client. Import `account` / `tables` from here —
 * never construct a second Client, or sessions will not be shared.
 */
export const client = new Client()
  .setEndpoint(AppwriteConfig.endpoint)
  .setProject(AppwriteConfig.projectId)
  .setPlatform(AppwriteConfig.platform);

export const account = new Account(client);
export const tables = new TablesDB(client);

export {ID, Permission, Query, Role} from "react-native-appwrite";
