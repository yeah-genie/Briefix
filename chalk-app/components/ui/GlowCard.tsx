import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  PressableProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors, { radius, spacing, shadows, animation } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface GlowCardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'neon';
  glowColor?: 'orange' | 'mint' | 'purple' | 'none';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  noBorder?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlowCard({
  children,
  variant = 'default',
  glowColor = 'none',
  style,
  contentStyle,
  noBorder = false,
  onPress,
  ...props
}: GlowCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, animation.spring);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, animation.spring);
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return colors.backgroundElevated;
      case 'glass':
        return colors.glassBackground;
      case 'neon':
        return colors.cardBackground;
      default:
        return colors.backgroundTertiary;
    }
  };

  const getBorderColor = () => {
    if (noBorder) return 'transparent';
    if (variant === 'glass') return colors.glassBorder;
    if (variant === 'neon' && glowColor !== 'none') {
      switch (glowColor) {
        case 'orange': return colors.neonOrange || colors.tint;
        case 'mint': return colors.neonMint || colors.tintSecondary;
        case 'purple': return colors.neonPurple || colors.tintAccent;
      }
    }
    return colors.border;
  };

  const getGlowShadow = () => {
    if (glowColor === 'none' || colorScheme === 'light') return {};
    switch (glowColor) {
      case 'orange': return shadows.glowOrange;
      case 'mint': return shadows.glowMint;
      case 'purple': return shadows.glowPurple;
      default: return {};
    }
  };

  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: noBorder ? 0 : 1,
        },
        variant === 'neon' && glowColor !== 'none' && getGlowShadow(),
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </AnimatedPressable>
  );
}

// Gradient border card variant
export function GradientBorderCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.gradientBorderContainer, style]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View
          style={[
            styles.gradientBorderInner,
            { backgroundColor: colors.backgroundElevated },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.lg,
  },
  gradientBorderContainer: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 1.5,
    borderRadius: radius.lg,
  },
  gradientBorderInner: {
    borderRadius: radius.lg - 1,
    padding: spacing.lg,
  },
});

