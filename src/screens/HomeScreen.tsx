/**
 * HomeScreen — Vibrant welcome screen for Dare or Drop
 *
 * Features:
 *  - Animated title with neon glow
 *  - Particle background
 *  - Glassmorphism info card
 *  - Premium "Play Now" button
 *  - High score display
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { COLORS, FONT_SIZE, SPACING, GRADIENTS } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { GlassCard } from '../components/GlassCard';
import { ParticleBackground } from '../components/ParticleBackground';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

export function HomeScreen() {
  const { state, startGame } = useGame();

  // ── Entrance animations ──
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);
  const subtitleOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(40);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    // Title entrance
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleScale.value = withSpring(1, { damping: 12, stiffness: 200 });

    // Staggered entrance
    subtitleOpacity.value = withDelay(400, withSpring(1));
    cardTranslateY.value = withDelay(600, withSpring(0, { damping: 14 }));
    cardOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, [titleOpacity, titleScale, subtitleOpacity, cardTranslateY, cardOpacity]);

  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#0A0A1A', '#12122A', '#1A1A3E']}
      style={styles.container}
    >
      <ParticleBackground />

      <View style={styles.content}>
        {/* ── Title Section ── */}
        <Animated.View style={[styles.titleSection, titleAnimStyle]}>
          <Text style={styles.titleDare}>DARE</Text>
          <Text style={styles.titleOr}>or</Text>
          <Text style={styles.titleDrop}>DROP</Text>
        </Animated.View>

        {/* ── Subtitle ── */}
        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>
            Remember the pattern. Echo the sequence.{'\n'}
            One mistake and you drop! 💀
          </Text>
        </Animated.View>

        {/* ── High Score Card ── */}
        {state.highScore > 0 && (
          <Animated.View style={cardStyle}>
            <GlassCard glowColor={COLORS.neonPurple} style={styles.highScoreCard}>
              <Text style={styles.highScoreLabel}>🏆 BEST SCORE</Text>
              <Text style={styles.highScoreValue}>{state.highScore}</Text>
            </GlassCard>
          </Animated.View>
        )}

        {/* ── How to Play Card ── */}
        <Animated.View style={cardStyle}>
          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>HOW TO PLAY</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>👀</Text>
              <Text style={styles.infoText}>Watch the color sequence</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>👆</Text>
              <Text style={styles.infoText}>Tap the pads in the same order</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>🔥</Text>
              <Text style={styles.infoText}>Each level adds one more to remember</Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* ── Play Button ── */}
        <Animated.View entering={SlideInDown.delay(800).springify().damping(14)}>
          <AnimatedButton
            label="Play Now"
            onPress={startGame}
            size="lg"
            gradientColors={['#7B61FF', '#FF3CAC']}
            style={styles.playButton}
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },

  // ── Title ──
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  titleDare: {
    fontSize: FONT_SIZE.mega,
    fontFamily: 'Inter_900Black',
    color: COLORS.neonBlue,
    letterSpacing: 8,
    ...(Platform.OS !== 'web' ? {
      textShadowColor: COLORS.neonBlue,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 30,
    } : {}),
  },
  titleOr: {
    fontSize: FONT_SIZE.xl,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted,
    marginVertical: -4,
    letterSpacing: 4,
  },
  titleDrop: {
    fontSize: FONT_SIZE.mega,
    fontFamily: 'Inter_900Black',
    color: COLORS.neonPink,
    letterSpacing: 8,
    ...(Platform.OS !== 'web' ? {
      textShadowColor: COLORS.neonPink,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 30,
    } : {}),
  },

  // ── Subtitle ──
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },

  // ── High Score ──
  highScoreCard: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
  },
  highScoreLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  highScoreValue: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neonPurple,
    ...(Platform.OS !== 'web' ? {
      textShadowColor: COLORS.neonPurple,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 16,
    } : {}),
  },

  // ── Info Card ──
  infoCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: SPACING.xl,
  },
  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_700Bold',
    color: COLORS.textMuted,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    flex: 1,
  },

  // ── Play Button ──
  playButton: {
    minWidth: 220,
  },
});
