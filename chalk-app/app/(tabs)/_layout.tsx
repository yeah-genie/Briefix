import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
<<<<<<< HEAD

import { colors, spacing } from '@/constants/Colors';
import { PencilIcon, CalendarIcon, ChartIcon, UsersIcon } from '@/components/Icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.default,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.bg.secondary,
          borderTopColor: colors.border.light,
          borderTopWidth: 0.5,
          height: 80,
          paddingTop: spacing.sm,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
=======
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors, { radius, spacing, shadows } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { PencilIcon, UsersIcon, ChartIcon, ClockIcon } from '@/components/Icons';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const tabBarHeight = 64;
  const tabBarBottom = Math.max(insets.bottom, 16);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: tabBarBottom,
          left: 16,
          right: 16,
          height: tabBarHeight,
          borderRadius: radius.xxl,
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(18, 30, 25, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          paddingBottom: 0,
          paddingTop: 0,
          ...shadows.lg,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: 2,
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
<<<<<<< HEAD
          title: 'Log',
          tabBarIcon: ({ color }) => <PencilIcon size={20} color={color} />,
=======
          title: '수업',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} colorScheme={colorScheme}>
              <PencilIcon size={22} color={color} />
            </TabIcon>
          ),
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
<<<<<<< HEAD
          title: 'Schedule',
          tabBarIcon: ({ color }) => <CalendarIcon size={20} color={color} />,
=======
          title: '학생',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} colorScheme={colorScheme}>
              <UsersIcon size={22} color={color} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '기록',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} colorScheme={colorScheme}>
              <ClockIcon size={22} color={color} />
            </TabIcon>
          ),
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
<<<<<<< HEAD
          title: 'Portfolio',
          tabBarIcon: ({ color }) => <ChartIcon size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <UsersIcon size={20} color={color} />,
=======
          title: '포트폴리오',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} colorScheme={colorScheme}>
              <ChartIcon size={22} color={color} />
            </TabIcon>
          ),
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
        }}
      />
    </Tabs>
  );
}

function TabIcon({ 
  focused, 
  colorScheme,
  children 
}: { 
  focused: boolean; 
  colorScheme: 'light' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.iconContainerFocused,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
  },
});
