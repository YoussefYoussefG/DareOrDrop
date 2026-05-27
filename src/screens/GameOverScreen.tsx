/**
 * GameOverScreen — End-of-game screen for Dare or Drop
 *
 * Features:
 *  - "You Dropped!" title with dramatic animation
 *  - Final score display with glassmorphism card
 *  - New high score celebration
 *  - Play Again and Home buttons
 *  - Particle background
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
  withSequence,
  Easing,
  FadeIn,
  SlideInDown,
  BounceIn,
} from 'react-native-reanimated';
import { COLORS, FONT_SIZE, SPACING, GRADIENTS, BORDER_RADIUS } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { GlassCard } from '../components/GlassCard';
import { ParticleBackground } from '../components/ParticleBackground';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

export function GameOverScreen() {
  const { state, startGame, goHome } = useGame();
  const isNewHighScore = state.score >= state.highScore && state.score > 0;

  // ── Animations ──
  const skullScale = useSharedValue(0);
  const scoreCountUp = useSharedValue(0);
  const crownGlow = useSharedValue(0);

  useEffect(() => {
    skullScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 200 }));

    // Count up animation for score
    scoreCountUp.value = withDelay(
      600,
      withTiming(state.score, { duration: 1200, easing: Easing.out(Easing.cubic) })
    );

    if (isNewHighScore) {
      crownGlow.value = withDelay(
        1400,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sine) }),
            withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.sine) })
          ),
          -1,
          true
        )
      );
    }
  }, [skullScale, scoreCountUp, crownGlow, state.score, isNewHighScore]);

  const skullStyle = useAnimatedStyle(() => ({
    transform: [{ scale: skullScale.value }],
  }));

  const crownStyle = useAnimatedStyle(() => ({
    opacity: crownGlow.value,
  }));

  return (
    <LinearGradient
      colors={['#0A0A1A', '#1A0A2E', '#2A0A1E'] as [string, string, ...string[]]}
      style={styles.container}
    >
      <ParticleBackground />

      <View style={styles.content}>
        {/* ── Skull / Title ── */}
        <Animated.View style={[styles.skullContainer, skullStyle]}>
          <Text style={styles.skull}>💀</Text>
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(400).duration(600)} style={styles.title}>
          YOU DROPPED!
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(600).duration(600)} style={styles.subtitle}>
          The sequence was too much to handle...
        </Animated.Text>

        {/* ── Score Card ── */}
        <Animated.View entering={SlideInDown.delay(800).springify().damping(14)}>
          <GlassCard glowColor={COLORS.neonPink} style={styles.scoreCard}>
            {/* New high score badge */}
            {isNewHighScore && (
              <Animated.View style={[styles.newHighScoreBadge, crownStyle]}>
                <Text style={styles.newHighScoreText}>🎉 NEW HIGH SCORE! 🎉</Text>
              </Animated.View>
            )}

            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>FINAL SCORE</Text>
                <Text style={styles.scoreValue}>{state.score}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>LEVEL REACHED</Text>
                <Text style={[styles.scoreValue, { color: COLORS.neonBlue }]}>
                  {state.level}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Sequence Length</Text>
                <Text style={styles.statValue}>{state.sequence.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Best Score</Text>
                <Text style={styles.statValue}>{state.highScore}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* ── Buttons ── */}
        <View style={styles.buttonContainer}>
          <Animated.View entering={SlideInDown.delay(1000).springify()}>
            <AnimatedButton
              label="Play Again"
              onPress={startGame}
              size="lg"
              gradientColors={['#7B61FF', '#FF3CAC']}
              style={styles.button}
            />
          </Animated.View>

          <Animated.View entering={SlideInDown.delay(1100).springify()}>
            <AnimatedButton
              label="Home"
              onPress={goHome}
              size="md"
              gradientColors={['#2A2A5A', '#3A3A7A']}
              style={styles.button}
            />
          </Animated.View>
        </View>
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
  },

  // ── Skull ──
  skullContainer: {
    marginBottom: SPACING.md,
  },
  skull: {
    fontSize: 80,
  },

  // ── Title ──
  title: {
    fontSize: FONT_SIZE.hero,
    fontFamily: 'Inter_900Black',
    color: COLORS.neonPink,
    letterSpacing: 4,
    textShadowColor: COLORS.neonPink,
    ...(Platform.OS !== 'web' ? {
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 30,
    } : {}),
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },

  // ── Score Card ──
  scoreCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  newHighScoreBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  newHighScoreText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: SPACING.md,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    fontSize: FONT_SIZE.hero,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neonPink,
    ...(Platform.OS !== 'web' ? {
      textShadowColor: COLORS.neonPink,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 16,
    } : {}),
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.glassBorder,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter_700Bold',
    color: COLORS.textPrimary,
  },

  // ── Buttons ──
  buttonContainer: {
    gap: SPACING.md,
    alignItems: 'center',
  },
  button: {
    minWidth: 220,
  },
});
