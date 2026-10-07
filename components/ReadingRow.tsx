/**
 * ReadingRow — a single row in the moisture history list.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SensorReading } from '../types/sensor';
import { getMoistureStatus, STATUS_COLORS } from '../types/sensor';

interface Props {
  reading: SensorReading;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function ReadingRow({ reading }: Props) {
  const status = getMoistureStatus(reading.moisturePercent);
  const colors = STATUS_COLORS[status];

  return (
    <View style={styles.row}>
      {/* Color indicator dot */}
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />

      {/* Timestamp */}
      <Text style={styles.timestamp} numberOfLines={1}>
        {formatTimestamp(reading.timestamp)}
      </Text>

      {/* Moisture value */}
      <Text style={[styles.value, { color: colors.primary }]}>
        {reading.moisturePercent}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  timestamp: {
    flex: 1,
    fontSize: 13,
    color: '#5A6478',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 48,
    textAlign: 'right',
  },
});
