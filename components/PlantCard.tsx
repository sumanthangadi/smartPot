/**
 * PlantCard — main dashboard card showing the plant's current state.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MoistureGauge from './MoistureGauge';
import type { SensorReading } from '../types/sensor';
import { getMoistureStatus, STATUS_COLORS } from '../types/sensor';

interface Props {
  reading: SensorReading;
  emoji: string;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PlantCard({ reading, emoji }: Props) {
  const status = getMoistureStatus(reading.moisturePercent);
  const colors = STATUS_COLORS[status];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.plantIcon}>🌿</Text>
        <View style={styles.headerText}>
          <Text style={styles.plantName}>My Plant</Text>
          <Text style={styles.subtitle}>Soil Moisture Monitor</Text>
        </View>
      </View>

      {/* Gauge */}
      <MoistureGauge moisturePercent={reading.moisturePercent} emoji={emoji} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Moisture</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {reading.moisturePercent}%
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.ring }]} />

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Raw Value</Text>
          <Text style={styles.statValue}>{reading.moistureRaw}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.ring }]} />

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Updated</Text>
          <Text style={styles.statValue}>{formatTime(reading.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  plantIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  plantName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#8B95A5',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B95A5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  divider: {
    width: 1,
    height: 30,
    opacity: 0.5,
  },
});
