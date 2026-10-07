/**
 * SmartPlant Dashboard — Phase 1
 *
 * Main screen showing:
 * - Device status bar
 * - Plant card with moisture gauge
 * - Moisture history
 * - Loading / Error / Empty states
 */
import React, { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useSensorData from './hooks/useSensorData';
import PlantCard from './components/PlantCard';
import DeviceStatus from './components/DeviceStatus';
import MoistureHistory from './components/MoistureHistory';
import { getMoistureStatus, getRandomEmoji } from './types/sensor';

export default function App() {
  const { readings, loading, error, refreshing, refresh } = useSensorData();
  const latestReading = readings.length > 0 ? readings[0] : null;

  // Pick a random emoji on each new reading (memoized per reading ID)
  const emoji = useMemo(() => {
    if (!latestReading) return '🌱';
    const status = getMoistureStatus(latestReading.moisturePercent);
    return getRandomEmoji(status);
  }, [latestReading?.$id]);

  // ───── Loading state ─────
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.centered}>
          <StatusBar barStyle="dark-content" backgroundColor="#F4F6FA" />
          <ActivityIndicator size="large" color="#27AE60" />
          <Text style={styles.loadingText}>Loading sensor data…</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // ───── Error state ─────
  if (error && readings.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.centered}>
          <StatusBar barStyle="dark-content" backgroundColor="#F4F6FA" />
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryHint}>Pull down to retry</Text>
          <ScrollView
            contentContainerStyle={styles.centeredScroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
          >
            <View style={{ height: 200 }} />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // ───── Main dashboard ─────
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F6FA" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#27AE60"
              colors={['#27AE60']}
            />
          }
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>🌱 SmartPlant</Text>
            <Text style={styles.headerSubtitle}>IoT Dashboard</Text>
          </View>

          {/* Device status */}
          <DeviceStatus latestReading={latestReading} />

          {/* Main card or empty state */}
          {latestReading ? (
            <PlantCard reading={latestReading} emoji={emoji} />
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardIcon}>🌱</Text>
              <Text style={styles.emptyCardTitle}>No readings yet</Text>
              <Text style={styles.emptyCardSubtext}>
                Connect your ESP32 device and it will start sending soil
                moisture data to this dashboard automatically.
              </Text>
            </View>
          )}

          {/* Show non-fatal error banner */}
          {error && readings.length > 0 && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠️ {error}</Text>
            </View>
          )}

          {/* History */}
          <MoistureHistory readings={readings} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8B95A5',
    marginTop: 2,
  },

  // Loading
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6FA',
    padding: 32,
  },
  centeredScroll: {
    flexGrow: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B95A5',
  },

  // Error
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E74C3C',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#5A6478',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  retryHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#8B95A5',
  },

  // Error banner (non-fatal)
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(231, 76, 60, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#E74C3C',
    fontWeight: '500',
  },

  // Empty card
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyCardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyCardSubtext: {
    fontSize: 14,
    color: '#8B95A5',
    textAlign: 'center',
    lineHeight: 20,
  },
});
