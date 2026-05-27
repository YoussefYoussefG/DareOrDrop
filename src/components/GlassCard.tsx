/**
 * GlassCard — Frosted glass / glassmorphism card component
 *
 * Renders a translucent card with border glow.
 * Used throughout the app for modals, info panels, and score displays.
 */

import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Neon glow color for the border */
  glowColor?: string;
}

export function GlassCard({ children, style, glowColor }: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        glowColor ? { borderColor: glowColor + '40' } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.glassBg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    // Subtle inner glow
    overflow: 'hidden',
  },
});
