/**
 * GameScreen — Main gameplay screen for Dare or Drop
 *
 * Features:
 *  - Level & score display (ScoreBadge components)
 *  - 4-pad game board (2×2 grid)
 *  - "Watch!" / "Your turn!" status indicator
 *  - Sequence progress dots
 *  - Particle background for atmosphere
 */

import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { COLORS, FONT_SIZE, SPACING, GRADIENTS, GAME_PADS, BORDER_RADIUS } from '../constants/theme';
import { GamePad } from '../components/GamePad';
import { ScoreBadge } from '../components/ScoreBadge';
import { ParticleBackground } from '../components/ParticleBackground';
import { useGame } from '../context/GameContext';
import { useHaptics } from '../hooks/useHaptics';

const { width } = Dimensions.get('window');

export function GameScreen() {
  const { state, handlePlayerInput } = useGame();
  const { success, error } = useHaptics();

  // Fire haptics on result changes
  React.useEffect(() => {
    if (state.lastResult === 'correct' && state.canPlayerInput === false && state.level > 1) {
      success();
    } else if (state.lastResult === 'wrong') {
      error();
    }
  }, [state.lastResult, state.canPlayerInput, state.level, success, error]);

  const statusText = state.isShowingSequence
    ? '👀  Watch carefully!'
    : state.canPlayerInput
      ? '👆  Your turn!'
      : '⏳  Get ready...';

  const statusColor = state.isShowingSequence
    ? COLORS.neonYellow
    : state.canPlayerInput
      ? COLORS.neonGreen
      : COLORS.textMuted;

  // Progress dots showing how far through the sequence the player is
  const totalSteps = state.sequence.length;
  const completedSteps = state.playerInput.length;

  return (
    <LinearGradient
      colors={GRADIENTS.primary as unknown as [string, string, ...string[]]}
      style={styles.container}
    >
      <ParticleBackground />

      {/* ── Top Bar: Level & Score ── */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.topBar}>
        <ScoreBadge label="Level" value={state.level} glowColor={COLORS.neonBlue} />
        <View style={styles.titleMini}>
          <Text style={styles.titleText}>DARE</Text>
          <Text style={styles.titleTextPink}>DROP</Text>
        </View>
        <ScoreBadge label="Score" value={state.score} glowColor={COLORS.neonPink} />
      </Animated.View>

      {/* ── Status Indicator ── */}
      <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
      </Animated.View>

      {/* ── Sequence Progress Dots ── */}
      {totalSteps > 0 && (
        <Animated.View entering={FadeIn.delay(400)} style={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < completedSteps
                  ? styles.dotCompleted
                  : i === completedSteps && state.canPlayerInput
                    ? styles.dotCurrent
                    : styles.dotPending,
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* ── Game Board (2×2 pad grid) ── */}
      <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.board}>
        <View style={styles.padRow}>
          {GAME_PADS.slice(0, 2).map((pad) => (
            <GamePad
              key={pad.id}
              color={pad.color}
              activeColor={pad.activeColor}
              isActive={state.activePad === pad.id}
              onPress={() => handlePlayerInput(pad.id)}
              disabled={!state.canPlayerInput || state.isShowingSequence}
            />
          ))}
        </View>
        <View style={styles.padRow}>
          {GAME_PADS.slice(2, 4).map((pad) => (
            <GamePad
              key={pad.id}
              color={pad.color}
              activeColor={pad.activeColor}
              isActive={state.activePad === pad.id}
              onPress={() => handlePlayerInput(pad.id)}
              disabled={!state.canPlayerInput || state.isShowingSequence}
            />
          ))}
        </View>
      </Animated.View>

      {/* ── Bottom hint ── */}
      <Animated.View entering={FadeIn.delay(600)} style={styles.hintContainer}>
        <Text style={styles.hintText}>
          {state.isShowingSequence
            ? `Sequence length: ${totalSteps}`
            : state.canPlayerInput
              ? `${completedSteps} / ${totalSteps} correct`
              : ''}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.md,
  },
  titleMini: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_900Black',
    color: COLORS.neonBlue,
    letterSpacing: 4,
  },
  titleTextPink: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_900Black',
    color: COLORS.neonPink,
    letterSpacing: 4,
  },

  // ── Status ──
  statusContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },

  // ── Progress Dots ──
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotCompleted: {
    backgroundColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  dotCurrent: {
    backgroundColor: COLORS.neonYellow,
    shadowColor: COLORS.neonYellow,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  dotPending: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.3,
  },

  // ── Game Board ──
  board: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  padRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width - SPACING.xl * 2,
  },

  // ── Bottom Hint ──
  hintContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
  },
  hintText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
});
