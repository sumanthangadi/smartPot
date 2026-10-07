/**
 * DeviceStatus — shows ESP32 device connectivity status.
 *
 * Determines status based on how recent the latest reading is.
 * In Phase 1 this is a simple heuristic; it can be enhanced later
 * with actual device heartbeat data.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SensorReading } from '../types/sensor';

interface Props {
  latestReading: SensorReading | null;
}

/** If the latest reading is older than this, consider device "offline" */
const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

function getDeviceInfo(reading: SensorReading | null): {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
} {
  if (!reading) {
    return {
      label: 'Waiting for device data',
      icon: '📡',
      color: '#8B95A5',
      bgColor: '#F0F2F5',
    };
  }

  const ageMs = Date.now() - new Date(reading.timestamp).getTime();

  if (ageMs < STALE_THRESHOLD_MS) {
    return {
      label: 'Device Online',
      icon: '🟢',
      color: '#27AE60',
      bgColor: 'rgba(39, 174, 96, 0.08)',
    };
  }

  return {
    label: 'Device Offline',
    icon: '🔴',
    color: '#E74C3C',
    bgColor: 'rgba(231, 76, 60, 0.08)',
  };
}

export default function DeviceStatus({ latestReading }: Props) {
  const info = getDeviceInfo(latestReading);

  return (
    <View style={[styles.container, { backgroundColor: info.bgColor }]}>
      <Text style={styles.icon}>{info.icon}</Text>
      <Text style={[styles.label, { color: info.color }]}>{info.label}</Text>
      {latestReading && (
        <Text style={styles.chipText}>ESP32</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B95A5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
