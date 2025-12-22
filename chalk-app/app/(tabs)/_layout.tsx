import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { PencilIcon, UsersIcon, ChartIcon } from '@/components/Icons';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark'; // 기본 다크모드
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 85,
          paddingTop: 8,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        headerShown: useClientOnlyValue(false, false), // 헤더 숨김 (커스텀 헤더 사용)
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '수업',
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: -4 }}>
              <PencilIcon size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: '학생',
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: -4 }}>
              <UsersIcon size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: '포트폴리오',
          tabBarIcon: ({ color }) => (
            <View style={{ marginBottom: -4 }}>
              <ChartIcon size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
