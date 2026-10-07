/**
 * useSensorData — custom hook for fetching and subscribing to sensor readings.
 *
 * Strategy:
 * 1. On mount, fetch initial data from TablesDB.
 * 2. Set up an Appwrite Realtime subscription for live updates.
 * 3. If Realtime fails (e.g. network issues), fall back to polling.
 * 4. On unmount, clean up subscription and timers.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import type { RealtimeSubscription } from 'react-native-appwrite';
import { fetchSensorReadings, subscribeSensorReadings } from '../services/sensorService';
import type { SensorReading } from '../types/sensor';
import config from '../lib/config';

interface SensorDataState {
  readings: SensorReading[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export default function useSensorData() {
  const [state, setState] = useState<SensorDataState>({
    readings: [],
    loading: true,
    error: null,
    refreshing: false,
  });

  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  /** Fetch data from Appwrite */
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setState((prev) => ({ ...prev, refreshing: true, error: null }));
      }

      const rows = await fetchSensorReadings();

      if (mountedRef.current) {
        setState({
          readings: rows,
          loading: false,
          error: null,
          refreshing: false,
        });
      }
    } catch (err: any) {
      if (mountedRef.current) {
        const message =
          err?.message || 'Failed to load sensor data. Check your configuration.';
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: message,
        }));
      }
    }
  }, []);

  /** Set up Realtime subscription */
  const setupRealtime = useCallback(async () => {
    try {
      const sub = await subscribeSensorReadings((reading, eventType) => {
        if (!mountedRef.current) return;

        setState((prev) => {
          let updated = [...prev.readings];

          if (eventType === 'create') {
            // Insert at the front (newest first), cap at limit
            updated = [reading, ...updated].slice(0, config.recentReadingsLimit);
          } else if (eventType === 'update') {
            updated = updated.map((r) => (r.$id === reading.$id ? reading : r));
          } else if (eventType === 'delete') {
            updated = updated.filter((r) => r.$id !== reading.$id);
          }

          return { ...prev, readings: updated };
        });
      });

      subscriptionRef.current = sub;
      // Realtime is working, no need for polling
    } catch {
      // Realtime failed — fall back to polling
      startPolling();
    }
  }, []);

  /** Polling fallback */
  const startPolling = useCallback(() => {
    if (pollingRef.current) return; // already polling
    pollingRef.current = setInterval(() => {
      loadData();
    }, config.pollingIntervalMs);
  }, [loadData]);

  /** Manual refresh (pull-to-refresh) */
  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    mountedRef.current = true;

    // Initial fetch
    loadData();

    // Start polling sync
    startPolling();

    // Set up realtime subscription if enabled
    if (config.enableRealtime) {
      setupRealtime();
    }

    return () => {
      mountedRef.current = false;

      // Clean up subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      // Clean up polling
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  return {
    readings: state.readings,
    loading: state.loading,
    error: state.error,
    refreshing: state.refreshing,
    refresh,
  };
}
