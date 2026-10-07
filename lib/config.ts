/**
 * Appwrite configuration.
 *
 * These values are NOT secrets — they are safe for client-side code.
 * The Appwrite project's security rules (permissions, API key scoping)
 * control what unauthenticated/authenticated users can actually do.
 *
 * To change these, update the values below or use Expo environment
 * variables (EXPO_PUBLIC_*) in a future phase.
 */
const config = {
  /** Appwrite Cloud endpoint */
  endpoint: 'https://cloud.appwrite.io/v1',

  /** Appwrite project ID (the "folio" project) */
  projectId: '6a007fab00241e1b5379',

  /** Database ID for "Production TablesDB" */
  databaseId: '6ac509f8000875b235b4',

  /** Table ID for "sensor_readings" */
  sensorTableId: '6ac50b020002d443d553',

  /** Platform identifier for Appwrite project security */
  platform: 'com.smartplant.app',

  /** How many recent readings to fetch */
  recentReadingsLimit: 20,

  /**
   * Set to true once you register the Android/Apple platform in your Appwrite Console.
   * While false, the app automatically polls every 5s without any WebSocket errors.
   */
  enableRealtime: false,

  /** Polling interval in ms (auto-syncs data) */
  pollingIntervalMs: 5_000,
} as const;

export default config;
