import type { Models } from 'react-native-appwrite';

/**
 * Raw sensor reading row from Appwrite TablesDB.
 * Extends Models.Row with the specific columns defined in the sensor_readings table.
 */
export interface SensorReading extends Models.Row {
  moistureRaw: number;
  moisturePercent: number;
  timestamp: string; // ISO 8601 datetime
}

/**
 * Moisture status thresholds — easy to change later.
 * Ranges are inclusive on the lower bound, exclusive on the upper.
 */
export const MOISTURE_THRESHOLDS = {
  DRY_MAX: 30,       // 0–30% = "Needs Water"
  GOOD_MAX: 70,       // 31–70% = "Moisture Good"
  // 71–100% = "Very Wet"
} as const;

export type MoistureStatus = 'needs_water' | 'good' | 'very_wet';

export function getMoistureStatus(percent: number): MoistureStatus {
  if (percent <= MOISTURE_THRESHOLDS.DRY_MAX) return 'needs_water';
  if (percent <= MOISTURE_THRESHOLDS.GOOD_MAX) return 'good';
  return 'very_wet';
}

/** Status display labels */
export const STATUS_LABELS: Record<MoistureStatus, string> = {
  needs_water: 'Needs Water',
  good: 'Moisture Good',
  very_wet: 'Very Wet',
};

/**
 * Emoji sets per status — randomly picks one each render cycle
 * to give the UI personality.
 */
export const STATUS_EMOJIS: Record<MoistureStatus, string[]> = {
  needs_water: ['😡', '😤', '😢', '😩', '🥺', '😠'],
  good: ['😊', '😌', '🌱', '😄', '🤗', '😎'],
  very_wet: ['🥶', '🌧️', '😰', '😵‍💫', '🫠', '💦'],
};

export function getRandomEmoji(status: MoistureStatus): string {
  const emojis = STATUS_EMOJIS[status];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/** Color palette for each moisture status */
export const STATUS_COLORS: Record<MoistureStatus, { primary: string; bg: string; ring: string }> = {
  needs_water: {
    primary: '#E74C3C',
    bg: 'rgba(231, 76, 60, 0.12)',
    ring: 'rgba(231, 76, 60, 0.3)',
  },
  good: {
    primary: '#27AE60',
    bg: 'rgba(39, 174, 96, 0.12)',
    ring: 'rgba(39, 174, 96, 0.3)',
  },
  very_wet: {
    primary: '#2980B9',
    bg: 'rgba(41, 128, 185, 0.12)',
    ring: 'rgba(41, 128, 185, 0.3)',
  },
};
