/**
 * Chalk Design System - "Noir Academy"
 * 
 * Premium dark theme with neon accents
 * Inspired by chalkboard + highlighter aesthetic
 */

// ===========================================
// BRAND COLORS - Neon Duo Tone
// ===========================================
const brand = {
  // Primary: Neon Orange
  primary: '#FF6B35',
  primaryLight: '#FF8F65',
  primaryDark: '#E85A2A',
  primaryMuted: 'rgba(255, 107, 53, 0.15)',
  primaryGlow: 'rgba(255, 107, 53, 0.4)',
  
  // Secondary: Neon Mint
  secondary: '#00F5D4',
  secondaryLight: '#5FFBEA',
  secondaryDark: '#00D4B8',
  secondaryMuted: 'rgba(0, 245, 212, 0.15)',
  secondaryGlow: 'rgba(0, 245, 212, 0.4)',
  
  // Accent: Electric Purple (AI features)
  accent: '#A855F7',
  accentLight: '#C084FC',
  accentMuted: 'rgba(168, 85, 247, 0.15)',
  accentGlow: 'rgba(168, 85, 247, 0.4)',
};

// ===========================================
// COLOR THEMES
// ===========================================
export default {
  light: {
    // Text hierarchy - Warm tones
    text: '#1A1A2E',
    textSecondary: '#4A4A5A',
    textMuted: '#8A8A9A',
    textChalk: '#F0EDE5', // Chalk white

    // Background hierarchy
    background: '#FAFAF8',
    backgroundElevated: '#FFFFFF',
    backgroundSurface: '#F5F5F3',
    backgroundSecondary: '#EEEEEC',
    backgroundTertiary: '#E8E8E6',
    backgroundHover: '#E0E0DE',

    // Brand
    tint: brand.primary,
    tintSecondary: brand.secondary,
    tintAccent: brand.accent,
    brandMuted: brand.primaryMuted,

    // Tabs
    tabIconDefault: '#9CA3AF',
    tabIconSelected: brand.primary,

    // Borders
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.12)',
    borderFocus: brand.primary,
    borderGlow: brand.primaryGlow,

    // Status
    success: '#22C55E',
    successMuted: 'rgba(34, 197, 94, 0.1)',
    warning: '#FBBF24',
    warningMuted: 'rgba(251, 191, 36, 0.1)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',
    infoMuted: 'rgba(59, 130, 246, 0.1)',

    // Level indicators
    levelHigh: brand.secondary,
    levelMid: brand.primary,
    levelLow: '#FBBF24',

    // Card
    cardBackground: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    cardGlow: 'transparent',

    // Gradient
    gradientStart: brand.primary,
    gradientEnd: brand.secondary,
    gradientAccent: brand.accent,
  },

  dark: {
    // Text hierarchy - Chalk inspired
    text: '#F0EDE5',           // Warm chalk white
    textSecondary: '#B8B5AD',  // Faded chalk
    textMuted: '#6B6962',      // Very faded
    textChalk: '#F0EDE5',

    // Background hierarchy - Deep slate
    background: '#0D1117',        // GitHub dark
    backgroundElevated: '#161B22',
    backgroundSurface: '#1C2128',
    backgroundSecondary: '#21262D',
    backgroundTertiary: '#282E36',
    backgroundHover: '#30363D',

    // Brand
    tint: brand.primary,
    tintSecondary: brand.secondary,
    tintAccent: brand.accent,
    brandMuted: brand.primaryMuted,

    // Tabs
    tabIconDefault: '#6B6962',
    tabIconSelected: brand.primary,

    // Borders - Subtle glow capable
    border: 'rgba(255, 255, 255, 0.06)',
    borderHover: 'rgba(255, 255, 255, 0.1)',
    borderFocus: brand.primary,
    borderGlow: brand.primaryGlow,

    // Status - Neon variants
    success: '#00F5D4',
    successMuted: 'rgba(0, 245, 212, 0.15)',
    warning: '#FFD93D',
    warningMuted: 'rgba(255, 217, 61, 0.15)',
    error: '#FF6B6B',
    errorMuted: 'rgba(255, 107, 107, 0.15)',
    info: '#4CC9F0',
    infoMuted: 'rgba(76, 201, 240, 0.15)',

    // Level indicators - Neon
    levelHigh: brand.secondary,    // Mint for good
    levelMid: brand.primary,       // Orange for okay
    levelLow: '#FFD93D',           // Yellow for needs work

    // Card - Glass morphism with glow
    cardBackground: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    cardGlow: brand.primaryGlow,

    // Gradient - Duo tone
    gradientStart: brand.primary,
    gradientEnd: brand.secondary,
    gradientAccent: brand.accent,

    // Neon effects
    neonOrange: brand.primary,
    neonOrangeGlow: brand.primaryGlow,
    neonMint: brand.secondary,
    neonMintGlow: brand.secondaryGlow,
    neonPurple: brand.accent,
    neonPurpleGlow: brand.accentGlow,

    // Glass effect
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassBackgroundStrong: 'rgba(255, 255, 255, 0.08)',
  },
};

// ===========================================
// SPACING (4px base unit)
// ===========================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ===========================================
// TYPOGRAPHY
// ===========================================
export const typography = {
  // Display - Big impact numbers
  display: {
    fontSize: 48,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 56,
  },
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  // Body
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  // Caption
  caption: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  // Label
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  // Mono - for stats
  mono: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
} as const;

// ===========================================
// BORDER RADIUS
// ===========================================
export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

// ===========================================
// SHADOWS (for React Native)
// ===========================================
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  // Neon glow shadows
  glowOrange: {
    shadowColor: brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  glowMint: {
    shadowColor: brand.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  glowPurple: {
    shadowColor: brand.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// ===========================================
// ANIMATION DURATIONS
// ===========================================
export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
  },
} as const;

// ===========================================
// COMPONENT SIZES
// ===========================================
export const componentSizes = {
  button: {
    sm: { height: 36, paddingHorizontal: 14, fontSize: 13 },
    md: { height: 44, paddingHorizontal: 18, fontSize: 15 },
    lg: { height: 52, paddingHorizontal: 24, fontSize: 16 },
  },
  input: {
    sm: { height: 36, paddingHorizontal: 12, fontSize: 13 },
    md: { height: 44, paddingHorizontal: 16, fontSize: 15 },
    lg: { height: 52, paddingHorizontal: 18, fontSize: 16 },
  },
  avatar: {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 56,
    xl: 72,
  },
  tabBar: {
    height: 64,
    iconSize: 24,
  },
} as const;

// Type exports
export type ColorTheme = typeof import('./Colors').default.dark;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Radius = typeof radius;
