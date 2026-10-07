/**
 * MoistureGauge — large circular moisture indicator.
 *
 * Renders an animated SVG-free circle gauge using nested Views with
 * border radius. The fill, color, and emoji all react to the current
 * moisture percentage.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {
  getMoistureStatus,
  getRandomEmoji,
  STATUS_COLORS,
  STATUS_LABELS,
  type MoistureStatus,
} from '../types/sensor';

interface Props {
  moisturePercent: number;
  emoji: string;
}

export default function MoistureGauge({ moisturePercent, emoji }: Props) {
  const status = getMoistureStatus(moisturePercent);
  const colors = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  // Animate the fill height
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fillAnim, {
      toValue: moisturePercent / 100,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [moisturePercent]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Outer ring */}
      <View style={[styles.outerRing, { borderColor: colors.ring }]}>
        {/* Inner circle with fill */}
        <View style={styles.innerCircle}>
          {/* Fill from bottom */}
          <Animated.View
            style={[
              styles.fill,
              {
                height: fillHeight,
                backgroundColor: colors.primary,
                opacity: 0.2,
              },
            ]}
          />

          {/* Content overlay */}
          <View style={styles.content}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[styles.percent, { color: colors.primary }]}>
              {moisturePercent}%
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
              <Text style={[styles.statusText, { color: colors.primary }]}>
                {label}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const GAUGE_SIZE = 200;
const RING_WIDTH = 4;
const INNER_SIZE = GAUGE_SIZE - RING_WIDTH * 2;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  outerRing: {
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    borderRadius: GAUGE_SIZE / 2,
    borderWidth: RING_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: INNER_SIZE / 2,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 2,
  },
  percent: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
