/**
 * MoistureHistory — scrollable list of recent sensor readings.
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { SensorReading } from '../types/sensor';
import ReadingRow from './ReadingRow';

interface Props {
  readings: SensorReading[];
}

export default function MoistureHistory({ readings }: Props) {
  return (
    <View style={styles.card}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Moisture History</Text>
        <Text style={styles.count}>
          {readings.length} reading{readings.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {readings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No readings yet</Text>
          <Text style={styles.emptySubtext}>
            Data will appear here once your ESP32 starts sending sensor readings
          </Text>
        </View>
      ) : (
        readings.map((reading) => (
          <ReadingRow key={reading.$id} reading={reading} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B95A5',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A6478',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#8B95A5',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
