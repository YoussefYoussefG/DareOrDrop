/**
 * useHaptics — Haptic feedback utility hook
 *
 * Wraps expo-haptics for cross-platform physical feedback.
 * Falls back silently on platforms that don't support haptics (e.g. web).
 */

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptics() {
  /** Light tap — used for normal button presses */
  const lightTap = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  /** Medium tap — used for pad presses */
  const mediumTap = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  /** Heavy tap — used for emphasis (level up, etc.) */
  const heavyTap = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  /** Success notification — used when player completes a sequence */
  const success = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  /** Error notification — used when player fails */
  const error = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  /** Warning notification */
  const warning = useCallback(() => {
    if (Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  return { lightTap, mediumTap, heavyTap, success, error, warning };
}
