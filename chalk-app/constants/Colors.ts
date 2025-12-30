// Minimalist Dark Mode - Linear/Raycast inspired
// 핵심: 색상 최소, 여백 최대, 정보는 필요할 때만

const tintColorDark = '#10B981'; // Emerald 500 - Primary brand

export const colors = {
  bg: {
    base: '#09090B',      // 통일된 배경색
    secondary: '#111113', // 카드 배경 (미세한 차이)
    tertiary: '#18181B',  // hover 상태
    elevated: '#111113',  // 모달
  },
  text: {
    primary: '#FAFAFA',   // 거의 화이트
    secondary: '#A1A1AA', // 뮤트
    muted: '#71717A',     // 더 뮤트
    inverse: '#FFFFFF',
  },
  accent: {
    default: '#10B981',   // Emerald - 단일 브랜드 컬러
    hover: '#34D399',     // 밝은 Emerald
    pressed: '#059669',   // 어두운 Emerald
    muted: 'rgba(16, 185, 129, 0.15)',
    subtle: 'rgba(16, 185, 129, 0.05)',
    glow: 'rgba(16, 185, 129, 0.3)',
    // 그라디언트는 CTA 버튼에만 사용
    gradientStart: '#10B981',
    gradientEnd: '#06B6D4', // Cyan
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.03)', // 더 미세한 테두리
    light: 'rgba(255, 255, 255, 0.06)',
    focus: '#10B981',
  },
  level: {
    high: '#10B981',
    mid: '#F59E0B',
    low: '#EF4444',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// 타이포그래피 4단계로 단순화
export const typography = {
  // 페이지 타이틀
  xl: { fontSize: 28, fontWeight: '700' as '700', letterSpacing: -0.5, color: colors.text.primary },
  // 섹션 타이틀
  lg: { fontSize: 18, fontWeight: '600' as '600', color: colors.text.primary },
  // 본문/버튼
  sm: { fontSize: 14, fontWeight: '500' as '500', lineHeight: 20, color: colors.text.primary },
  // 보조 정보/캡션
  xs: { fontSize: 12, fontWeight: '400' as '400', color: colors.text.secondary },

  // 호환성을 위한 별칭
  h1: { fontSize: 28, fontWeight: '700' as '700', letterSpacing: -0.5, color: colors.text.primary },
  h2: { fontSize: 22, fontWeight: '600' as '600', letterSpacing: -0.5, color: colors.text.primary },
  h3: { fontSize: 18, fontWeight: '600' as '600', color: colors.text.primary },
  body: { fontSize: 14, fontWeight: '400' as '400', lineHeight: 20, color: colors.text.primary },
  small: { fontSize: 14, fontWeight: '500' as '500', color: colors.text.primary },
  caption: { fontSize: 12, fontWeight: '400' as '400', color: colors.text.secondary },
};


export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  glow: {
    shadowColor: colors.accent.default,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const components = {
  button: {
    sm: 36,
    md: 48,
    lg: 56,
  },
};

// 다크 모드 전용 (라이트 모드 미지원)
export default {
  light: {
    text: '#09090B',
    background: '#FFFFFF',
    tint: tintColorDark,
    tabIconDefault: '#71717A',
    tabIconSelected: tintColorDark,
  },
  dark: {
    text: '#FAFAFA',
    background: '#09090B',
    tint: tintColorDark,
    tabIconDefault: '#71717A',
    tabIconSelected: tintColorDark,
  },
};
