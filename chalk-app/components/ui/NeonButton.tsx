import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  PressableProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors, { radius, spacing, shadows, animation, componentSizes } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface NeonButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: 'orange' | 'mint' | 'purple';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NeonButton({
  title,
  variant = 'primary',
  size = 'md',
  glowColor = 'orange',
  icon,
  iconPosition = 'left',
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  disabled,
  onPress,
  ...props
}: NeonButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, animation.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, animation.spring);
  };

  const sizeStyles = componentSizes.button[size];

  const getGlowColor = () => {
    switch (glowColor) {
      case 'orange': return colors.neonOrange || colors.tint;
      case 'mint': return colors.neonMint || colors.tintSecondary;
      case 'purple': return colors.neonPurple || colors.tintAccent;
    }
  };

  const getGlowShadow = () => {
    if (colorScheme === 'light' || variant === 'ghost' || variant === 'outline') return {};
    switch (glowColor) {
      case 'orange': return shadows.glowOrange;
      case 'mint': return shadows.glowMint;
      case 'purple': return shadows.glowPurple;
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (glowColor) {
      case 'orange': return [colors.gradientStart, '#FF8F65'];
      case 'mint': return [colors.gradientEnd, '#5FFBEA'];
      case 'purple': return [colors.gradientAccent || '#A855F7', '#C084FC'];
    }
  };

  const renderContent = () => (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? getGlowColor() : '#fff'} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles.fontSize },
              variant === 'outline' && { color: getGlowColor() },
              variant === 'ghost' && { color: getGlowColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <AnimatedPressable
        style={[
          animatedStyle,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        {...props}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            {
              height: sizeStyles.height,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
            getGlowShadow(),
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        variant === 'primary' && {
          backgroundColor: getGlowColor(),
          ...getGlowShadow(),
        },
        variant === 'secondary' && {
          backgroundColor: colors.backgroundTertiary,
        },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: getGlowColor(),
        },
        variant === 'ghost' && {
          backgroundColor: 'transparent',
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

