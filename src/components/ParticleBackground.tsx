/**
 * ParticleBackground — Ambient floating particle effect
 *
 * Renders subtle animated dots that drift across the screen.
 * Gives a premium, atmospheric feel to the background.
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

interface Particle {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

function SingleParticle({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      translateY.value = withRepeat(
        withTiming(-SCREEN_HEIGHT * 0.4, {
          duration: particle.duration,
          easing: Easing.linear,
        }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.6, {
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.sine),
        }),
        -1,
        true
      );
    }, particle.delay);

    return () => clearTimeout(delayTimeout);
  }, [translateY, opacity, particle.duration, particle.delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.startX,
          top: particle.startY,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ParticleBackground() {
  const particles = useMemo(() => {
    const colors = [COLORS.neonBlue, COLORS.neonPink, COLORS.neonPurple, COLORS.neonGreen];
    return Array.from({ length: PARTICLE_COUNT }, (_, i): Particle => ({
      id: i,
      startX: Math.random() * SCREEN_WIDTH,
      startY: Math.random() * SCREEN_HEIGHT,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8000 + 6000,
      delay: Math.random() * 4000,
      color: colors[i % colors.length],
    }));
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <SingleParticle key={p.id} particle={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});
