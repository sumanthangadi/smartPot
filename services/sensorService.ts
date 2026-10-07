/**
 * Sensor readings data-access layer.
 *
 * All Appwrite TablesDB interactions for the sensor_readings table
 * are encapsulated here so the UI layer never touches the SDK directly.
 */
import { Query, Channel } from 'react-native-appwrite';
import type { RealtimeSubscription } from 'react-native-appwrite';
import { tablesDB, realtime } from '../lib/appwrite';
import config from '../lib/config';
import type { SensorReading } from '../types/sensor';

const { databaseId, sensorTableId, recentReadingsLimit } = config;

/**
 * Fetch the latest sensor readings, sorted newest-first.
 */
export async function fetchSensorReadings(): Promise<SensorReading[]> {
  const response = await tablesDB.listRows<SensorReading>({
    databaseId,
    tableId: sensorTableId,
    queries: [
      Query.orderDesc('timestamp'),
      Query.limit(recentReadingsLimit),
    ],
  });

  return response.rows;
}

/**
 * Subscribe to realtime changes on the sensor_readings table.
 * Returns a subscription object for cleanup.
 *
 * Uses the typed Channel builder:
 *   Channel.tablesdb(dbId).table(tableId).row()
 *
 * This fires for create / update / delete events on any row.
 */
export async function subscribeSensorReadings(
  onEvent: (reading: SensorReading, eventType: string) => void,
): Promise<RealtimeSubscription> {
  const channel = Channel.tablesdb(databaseId).table(sensorTableId).row();

  const subscription = await realtime.subscribe(
    channel,
    (event) => {
      // Determine event type from the events array
      const eventTypes = event.events;
      let type = 'unknown';
      if (eventTypes.some((e) => e.includes('.create'))) type = 'create';
      else if (eventTypes.some((e) => e.includes('.update'))) type = 'update';
      else if (eventTypes.some((e) => e.includes('.delete'))) type = 'delete';

      onEvent(event.payload as SensorReading, type);
    },
  );

  return subscription;
}
