/**
 * ScoreBadge — Animated score display with neon glow
 *
 * Shows the current score with a pulse animation on change.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ScoreBadgeProps {
  label: string;
  value: number;
  glowColor?: string;
}

export function ScoreBadge({ label, value, glowColor = COLORS.neonBlue }: ScoreBadgeProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Pulse animation when value changes
    pulse.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
  }, [value, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: glowColor }, Platform.OS !== 'web' ? { textShadowColor: glowColor } : {}]}>
        {value}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glassBg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    minWidth: 80,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    fontSize: FONT_SIZE.xl,
    fontFamily: 'Inter_700Bold',
    ...(Platform.OS !== 'web' ? {
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 12,
    } : {}),
  },
});
