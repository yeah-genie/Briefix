// Chalk 앱 - Linear 스타일 다크 테마
// 미니멀, 프리미엄, 깔끔하면서 간지있는 디자인

const tintColorPrimary = '#10B981'; // Emerald - 성장/교육
const tintColorSecondary = '#06B6D4'; // Cyan - 신뢰/전문성

export default {
  light: {
    // Light mode도 제공하지만 기본은 dark
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    tint: tintColorPrimary,
    tintSecondary: tintColorSecondary,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorPrimary,
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    // Level colors
    levelHigh: '#10B981',
    levelMid: '#3B82F6',
    levelLow: '#F59E0B',
    // Card
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E7EB',
    // Gradient
    gradientStart: '#10B981',
    gradientEnd: '#06B6D4',
  },
  dark: {
    // Linear 스타일 다크 테마
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    background: '#0A0A0B', // 거의 블랙
    backgroundSecondary: '#111113', // 약간 밝은 블랙
    backgroundTertiary: '#18181B', // 카드/모달용
    tint: tintColorPrimary,
    tintSecondary: tintColorSecondary,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorPrimary,
    border: '#27272A', // 미묘한 보더
    borderLight: '#18181B',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    // Level colors (세련된 버전)
    levelHigh: '#34D399', // Emerald 400
    levelMid: '#60A5FA', // Blue 400
    levelLow: '#FBBF24', // Amber 400
    // Card - 글래스모피즘
    cardBackground: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    // Gradient
    gradientStart: '#10B981',
    gradientEnd: '#06B6D4',
    // Glass effect
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },
};

// 추가 디자인 토큰
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodySmall: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '500' as const },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  glow: {
    shadowColor: tintColorPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};
