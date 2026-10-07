/**
 * Centralized Appwrite client instance.
 *
 * This module initializes the Client, TablesDB, and Realtime services
 * once and re-exports them for use throughout the app.
 */
import 'react-native-url-polyfill/auto';
import { Client, TablesDB, Realtime } from 'react-native-appwrite';
import config from './config';

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

/** TablesDB service — for listRows / getRow / etc. */
export const tablesDB = new TablesDB(client);

/** Realtime service — for live subscriptions */
export const realtime = new Realtime(client);

export { client };
export default client;
