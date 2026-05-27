/**
 * GamePad — Interactive color pad for the memory game
 *
 * Each pad lights up when the sequence plays and when the player taps it.
 * Uses Reanimated for buttery-smooth 60fps brightness transitions.
 */

import React from 'react';
import { StyleSheet, Pressable, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { BORDER_RADIUS, SPACING } from '../constants/theme';
import { useHaptics } from '../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GamePadProps {
  /** Base color of the pad */
  color: string;
  /** Lit-up / active color */
  activeColor: string;
  /** Whether this pad is currently highlighted (sequence playback or player press) */
  isActive: boolean;
  /** Called when player taps this pad */
  onPress: () => void;
  /** Whether the player can interact */
  disabled?: boolean;
  /** Custom style (for layout positioning) */
  style?: ViewStyle;
}

export function GamePad({
  color,
  activeColor,
  isActive,
  onPress,
  disabled = false,
  style,
}: GamePadProps) {
  const scale = useSharedValue(1);
  const brightness = useSharedValue(0);
  const { mediumTap } = useHaptics();

  // Animate brightness when isActive changes
  React.useEffect(() => {
    brightness.value = withTiming(isActive ? 1 : 0, { duration: 150 });
  }, [isActive, brightness]);

  const animatedStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      brightness.value,
      [0, 1],
      [color, activeColor]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor: bgColor,
      // Glow effect when active
      shadowColor: activeColor,
      shadowOpacity: brightness.value * 0.8,
      shadowRadius: 20 + brightness.value * 15,
      elevation: 4 + brightness.value * 12,
    };
  });

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;
    mediumTap();
    onPress();
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.pad, animatedStyle, style]}
    />
  );
}

const styles = StyleSheet.create({
  pad: {
    width: '46%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.sm,
    shadowOffset: { width: 0, height: 0 },
  },
});
