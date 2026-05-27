/**
 * Theme constants for Dare or Drop
 * Premium dark-mode aesthetic with neon accents
 */

export const COLORS = {
  // Core backgrounds
  background: '#0A0A1A',
  backgroundLight: '#12122A',
  surface: '#1A1A3E',
  surfaceLight: '#252560',

  // Neon accents
  neonBlue: '#00D4FF',
  neonPink: '#FF3CAC',
  neonPurple: '#7B61FF',
  neonGreen: '#00FF87',
  neonYellow: '#FFE066',
  neonOrange: '#FF6B35',

  // Game pad colors (vibrant, accessible)
  padRed: '#FF4757',
  padBlue: '#3742FA',
  padGreen: '#2ED573',
  padYellow: '#FFA502',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C8',
  textMuted: '#6B6B9E',

  // Status
  success: '#00FF87',
  error: '#FF4757',
  warning: '#FFE066',

  // Glassmorphism
  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassHighlight: 'rgba(255, 255, 255, 0.08)',
} as const;

export const GRADIENTS = {
  primary: ['#0A0A1A', '#12122A', '#1A1A3E'],
  neonBlue: ['#00D4FF', '#7B61FF'],
  neonPink: ['#FF3CAC', '#784BA0', '#2B86C5'],
  card: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'],
  success: ['#00FF87', '#00D4FF'],
  danger: ['#FF4757', '#FF3CAC'],
  button: ['#7B61FF', '#FF3CAC'],
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 48,
  mega: 64,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  neonBlue: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  neonPink: {
    shadowColor: '#FF3CAC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Game pad configuration
export const GAME_PADS = [
  { id: 0, color: 'rgba(255, 71, 87, 0.25)',    activeColor: '#FF4757', label: 'Red' },
  { id: 1, color: 'rgba(55, 66, 250, 0.25)',   activeColor: '#3742FA', label: 'Blue' },
  { id: 2, color: 'rgba(46, 213, 115, 0.25)',  activeColor: '#2ED573', label: 'Green' },
  { id: 3, color: 'rgba(255, 165, 2, 0.25)', activeColor: '#FFA502', label: 'Yellow' },
] as const;

// Timing constants
export const TIMING = {
  padFlashDuration: 400,
  padGapDuration: 200,
  sequenceStartDelay: 800,
  levelUpDelay: 1200,
  gameOverDelay: 600,
} as const;
