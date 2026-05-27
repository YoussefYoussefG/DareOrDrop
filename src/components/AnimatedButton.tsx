/**
 * AnimatedButton — Premium pressable button with scale animation
 *
 * Uses React Native Reanimated for smooth 60fps micro-animations.
 * Supports gradient backgrounds and neon glow effects.
 */

import React, { type ReactNode } from 'react';
import { StyleSheet, Text, Pressable, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { useHaptics } from '../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  /** Gradient colors for the button background */
  gradientColors?: readonly [string, string, ...string[]];
  /** Optional custom style */
  style?: ViewStyle;
  /** Icon element to render before the label */
  icon?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
}

export function AnimatedButton({
  label,
  onPress,
  gradientColors = ['#7B61FF', '#FF3CAC'],
  style,
  icon,
  size = 'md',
  disabled = false,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const { lightTap } = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    if (disabled) return;
    lightTap();
    onPress();
  };

  const sizeStyles = SIZE_MAP[size];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
      disabled={disabled}
    >
      <LinearGradient
        colors={gradientColors as unknown as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, sizeStyles, disabled && styles.disabled]}
      >
        {icon && icon}
        <Text style={[styles.label, LABEL_SIZE_MAP[size]]}>{label}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const SIZE_MAP = {
  sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg },
  md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
  lg: { paddingVertical: SPACING.lg - 4, paddingHorizontal: SPACING.xxl },
};

const LABEL_SIZE_MAP = {
  sm: { fontSize: FONT_SIZE.sm },
  md: { fontSize: FONT_SIZE.lg },
  lg: { fontSize: FONT_SIZE.xl },
};

const styles = StyleSheet.create({
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.sm,
    ...SHADOWS.neonPink,
  },
  label: {
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.4,
  },
});
