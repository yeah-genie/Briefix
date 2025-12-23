import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors, { componentSizes, radius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gradient' | 'solid' | 'ring';
  color?: 'orange' | 'mint' | 'purple' | 'default';
  style?: ViewStyle;
}

export function Avatar({
  name,
  size = 'md',
  variant = 'gradient',
  color = 'default',
  style,
}: AvatarProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  
  const dimension = componentSizes.avatar[size];
  const fontSize = dimension * 0.4;
  const initial = name.charAt(0).toUpperCase();

  const getGradientColors = (): [string, string] => {
    switch (color) {
      case 'orange': return [colors.gradientStart, '#FF8F65'];
      case 'mint': return ['#00D4B8', colors.gradientEnd];
      case 'purple': return [colors.gradientAccent || '#A855F7', '#C084FC'];
      default: return [colors.gradientStart, colors.gradientEnd];
    }
  };

  const getSolidColor = () => {
    switch (color) {
      case 'orange': return colors.tint;
      case 'mint': return colors.tintSecondary;
      case 'purple': return colors.tintAccent;
      default: return colors.tint;
    }
  };

  if (variant === 'ring') {
    return (
      <View style={[styles.ringOuter, { width: dimension, height: dimension }, style]}>
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.ringGradient, { borderRadius: dimension / 2 }]}
        >
          <View
            style={[
              styles.ringInner,
              {
                width: dimension - 4,
                height: dimension - 4,
                borderRadius: (dimension - 4) / 2,
                backgroundColor: colors.background,
              },
            ]}
          >
            <Text style={[styles.initial, { fontSize, color: colors.text }]}>
              {initial}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (variant === 'solid') {
    return (
      <View
        style={[
          styles.solid,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            backgroundColor: getSolidColor(),
          },
          style,
        ]}
      >
        <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
      </View>
    );
  }

  // Default: gradient
  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradient,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGradient: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#fff',
    fontWeight: '700',
  },
});

