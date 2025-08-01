
import { Text, View, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { commonStyles, colors } from '../styles/commonStyles';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { StyleSheet } from 'react-native';

interface UserStats {
  totalPushUps: number;
  totalSquats: number;
  totalAbs: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string;
  level: number;
  xp: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: (stats: UserStats) => boolean;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPushUps: 0,
    totalSquats: 0,
    totalAbs: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: '',
    level: 1,
    xp: 0
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Comprehensive achievement system with hundreds of achievements
  const achievements: Achievement[] = [
    // Push-up Achievements
    {
      id: 'pushup_10',
      title: 'Push-up Starter',
      description: 'Complete 10 push-ups total',
      icon: 'fitness',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 10,
      category: 'push-ups',
      rarity: 'common'
    },
    {
      id: 'pushup_50',
      title: 'Push-up Enthusiast',
      description: 'Complete 50 push-ups total',
      icon: 'fitness',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 50,
      category: 'push-ups',
      rarity: 'common'
    },
    {
      id: 'pushup_100',
      title: 'Push-up Warrior',
      description: 'Complete 100 push-ups total',
      icon: 'fitness',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 100,
      category: 'push-ups',
      rarity: 'rare'
    },
    {
      id: 'pushup_250',
      title: 'Push-up Champion',
      description: 'Complete 250 push-ups total',
      icon: 'fitness',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 250,
      category: 'push-ups',
      rarity: 'rare'
    },
    {
      id: 'pushup_500',
      title: 'Push-up Master',
      description: 'Complete 500 push-ups total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 500,
      category: 'push-ups',
      rarity: 'epic'
    },
    {
      id: 'pushup_750',
      title: 'Push-up Elite',
      description: 'Complete 750 push-ups total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 750,
      category: 'push-ups',
      rarity: 'epic'
    },
    {
      id: 'pushup_1000',
      title: 'Push-up Legend',
      description: 'Complete 1000 push-ups total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 1000,
      category: 'push-ups',
      rarity: 'legendary'
    },
    {
      id: 'pushup_1500',
      title: 'Push-up Titan',
      description: 'Complete 1500 push-ups total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 1500,
      category: 'push-ups',
      rarity: 'legendary'
    },
    {
      id: 'pushup_2000',
      title: 'Push-up God',
      description: 'Complete 2000 push-ups total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 2000,
      category: 'push-ups',
      rarity: 'legendary'
    },
    {
      id: 'pushup_2500',
      title: 'Push-up Immortal',
      description: 'Complete 2500 push-ups total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 2500,
      category: 'push-ups',
      rarity: 'legendary'
    },
    {
      id: 'pushup_3000',
      title: 'Push-up Transcendent',
      description: 'Complete 3000 push-ups total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 3000,
      category: 'push-ups',
      rarity: 'legendary'
    },
    {
      id: 'pushup_5000',
      title: 'Push-up Universe',
      description: 'Complete 5000 push-ups total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 5000,
      category: 'push-ups',
      rarity: 'legendary'
    },

    // Squat Achievements
    {
      id: 'squat_10',
      title: 'Squat Beginner',
      description: 'Complete 10 squats total',
      icon: 'body',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 10,
      category: 'squats',
      rarity: 'common'
    },
    {
      id: 'squat_50',
      title: 'Squat Explorer',
      description: 'Complete 50 squats total',
      icon: 'body',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 50,
      category: 'squats',
      rarity: 'common'
    },
    {
      id: 'squat_100',
      title: 'Squat Soldier',
      description: 'Complete 100 squats total',
      icon: 'body',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 100,
      category: 'squats',
      rarity: 'rare'
    },
    {
      id: 'squat_250',
      title: 'Squat Warrior',
      description: 'Complete 250 squats total',
      icon: 'body',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 250,
      category: 'squats',
      rarity: 'rare'
    },
    {
      id: 'squat_500',
      title: 'Squat Champion',
      description: 'Complete 500 squats total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 500,
      category: 'squats',
      rarity: 'epic'
    },
    {
      id: 'squat_750',
      title: 'Squat Elite',
      description: 'Complete 750 squats total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 750,
      category: 'squats',
      rarity: 'epic'
    },
    {
      id: 'squat_1000',
      title: 'Squat Legend',
      description: 'Complete 1000 squats total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 1000,
      category: 'squats',
      rarity: 'legendary'
    },
    {
      id: 'squat_1500',
      title: 'Squat Titan',
      description: 'Complete 1500 squats total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 1500,
      category: 'squats',
      rarity: 'legendary'
    },
    {
      id: 'squat_2000',
      title: 'Squat God',
      description: 'Complete 2000 squats total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 2000,
      category: 'squats',
      rarity: 'legendary'
    },
    {
      id: 'squat_2500',
      title: 'Squat Immortal',
      description: 'Complete 2500 squats total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 2500,
      category: 'squats',
      rarity: 'legendary'
    },
    {
      id: 'squat_3000',
      title: 'Squat Transcendent',
      description: 'Complete 3000 squats total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 3000,
      category: 'squats',
      rarity: 'legendary'
    },
    {
      id: 'squat_5000',
      title: 'Squat Universe',
      description: 'Complete 5000 squats total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 5000,
      category: 'squats',
      rarity: 'legendary'
    },

    // Abs Achievements
    {
      id: 'abs_10',
      title: 'Core Starter',
      description: 'Complete 10 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 10,
      category: 'abs',
      rarity: 'common'
    },
    {
      id: 'abs_50',
      title: 'Core Builder',
      description: 'Complete 50 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 50,
      category: 'abs',
      rarity: 'common'
    },
    {
      id: 'abs_100',
      title: 'Core Warrior',
      description: 'Complete 100 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 100,
      category: 'abs',
      rarity: 'rare'
    },
    {
      id: 'abs_250',
      title: 'Core Champion',
      description: 'Complete 250 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 250,
      category: 'abs',
      rarity: 'rare'
    },
    {
      id: 'abs_500',
      title: 'Abs Master',
      description: 'Complete 500 abs exercises total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 500,
      category: 'abs',
      rarity: 'epic'
    },
    {
      id: 'abs_750',
      title: 'Abs Elite',
      description: 'Complete 750 abs exercises total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 750,
      category: 'abs',
      rarity: 'epic'
    },
    {
      id: 'abs_1000',
      title: 'Abs Legend',
      description: 'Complete 1000 abs exercises total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 1000,
      category: 'abs',
      rarity: 'legendary'
    },
    {
      id: 'abs_1500',
      title: 'Abs Titan',
      description: 'Complete 1500 abs exercises total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 1500,
      category: 'abs',
      rarity: 'legendary'
    },
    {
      id: 'abs_2000',
      title: 'Abs God',
      description: 'Complete 2000 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 2000,
      category: 'abs',
      rarity: 'legendary'
    },
    {
      id: 'abs_2500',
      title: 'Abs Immortal',
      description: 'Complete 2500 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 2500,
      category: 'abs',
      rarity: 'legendary'
    },
    {
      id: 'abs_3000',
      title: 'Abs Transcendent',
      description: 'Complete 3000 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 3000,
      category: 'abs',
      rarity: 'legendary'
    },
    {
      id: 'abs_5000',
      title: 'Abs Universe',
      description: 'Complete 5000 abs exercises total',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 5000,
      category: 'abs',
      rarity: 'legendary'
    },

    // Total Exercise Achievements
    {
      id: 'total_25',
      title: 'First Steps',
      description: 'Complete 25 total exercises',
      icon: 'star',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 25,
      category: 'total',
      rarity: 'common'
    },
    {
      id: 'total_100',
      title: 'Century Club',
      description: 'Complete 100 total exercises',
      icon: 'star',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 100,
      category: 'total',
      rarity: 'common'
    },
    {
      id: 'total_250',
      title: 'Quarter Master',
      description: 'Complete 250 total exercises',
      icon: 'star',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 250,
      category: 'total',
      rarity: 'rare'
    },
    {
      id: 'total_500',
      title: 'Half Thousand',
      description: 'Complete 500 total exercises',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 500,
      category: 'total',
      rarity: 'rare'
    },
    {
      id: 'total_1000',
      title: 'Thousand Club',
      description: 'Complete 1000 total exercises',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 1000,
      category: 'total',
      rarity: 'epic'
    },
    {
      id: 'total_2000',
      title: 'Double Thousand',
      description: 'Complete 2000 total exercises',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 2000,
      category: 'total',
      rarity: 'epic'
    },
    {
      id: 'total_3000',
      title: 'Triple Threat',
      description: 'Complete 3000 total exercises',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 3000,
      category: 'total',
      rarity: 'legendary'
    },
    {
      id: 'total_5000',
      title: 'Five Thousand Strong',
      description: 'Complete 5000 total exercises',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 5000,
      category: 'total',
      rarity: 'legendary'
    },
    {
      id: 'total_7500',
      title: 'Unstoppable Force',
      description: 'Complete 7500 total exercises',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 7500,
      category: 'total',
      rarity: 'legendary'
    },
    {
      id: 'total_10000',
      title: 'Ten Thousand Legend',
      description: 'Complete 10000 total exercises',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 10000,
      category: 'total',
      rarity: 'legendary'
    },

    // Streak Achievements
    {
      id: 'streak_3',
      title: 'Streak Starter',
      description: 'Maintain a 3-day streak',
      icon: 'flame',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 3,
      category: 'streaks',
      rarity: 'common'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 7,
      category: 'streaks',
      rarity: 'common'
    },
    {
      id: 'streak_14',
      title: 'Two Week Champion',
      description: 'Maintain a 14-day streak',
      icon: 'flame',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 14,
      category: 'streaks',
      rarity: 'rare'
    },
    {
      id: 'streak_21',
      title: 'Three Week Master',
      description: 'Maintain a 21-day streak',
      icon: 'flame',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 21,
      category: 'streaks',
      rarity: 'rare'
    },
    {
      id: 'streak_30',
      title: 'Monthly Dedication',
      description: 'Maintain a 30-day streak',
      icon: 'calendar',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 30,
      category: 'streaks',
      rarity: 'epic'
    },
    {
      id: 'streak_50',
      title: 'Fifty Day Hero',
      description: 'Maintain a 50-day streak',
      icon: 'calendar',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 50,
      category: 'streaks',
      rarity: 'epic'
    },
    {
      id: 'streak_75',
      title: 'Consistency King',
      description: 'Maintain a 75-day streak',
      icon: 'calendar',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 75,
      category: 'streaks',
      rarity: 'epic'
    },
    {
      id: 'streak_100',
      title: 'Hundred Day Legend',
      description: 'Maintain a 100-day streak',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 100,
      category: 'streaks',
      rarity: 'legendary'
    },
    {
      id: 'streak_150',
      title: 'Unstoppable Streak',
      description: 'Maintain a 150-day streak',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 150,
      category: 'streaks',
      rarity: 'legendary'
    },
    {
      id: 'streak_200',
      title: 'Streak Immortal',
      description: 'Maintain a 200-day streak',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 200,
      category: 'streaks',
      rarity: 'legendary'
    },
    {
      id: 'streak_365',
      title: 'Year Long Warrior',
      description: 'Maintain a 365-day streak',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 365,
      category: 'streaks',
      rarity: 'legendary'
    },

    // Level Achievements
    {
      id: 'level_5',
      title: 'Level Up!',
      description: 'Reach level 5',
      icon: 'trending-up',
      unlocked: false,
      requirement: (stats) => stats.level >= 5,
      category: 'levels',
      rarity: 'common'
    },
    {
      id: 'level_10',
      title: 'Double Digits',
      description: 'Reach level 10',
      icon: 'trending-up',
      unlocked: false,
      requirement: (stats) => stats.level >= 10,
      category: 'levels',
      rarity: 'common'
    },
    {
      id: 'level_15',
      title: 'Fifteen Strong',
      description: 'Reach level 15',
      icon: 'trending-up',
      unlocked: false,
      requirement: (stats) => stats.level >= 15,
      category: 'levels',
      rarity: 'rare'
    },
    {
      id: 'level_20',
      title: 'Twenty Power',
      description: 'Reach level 20',
      icon: 'trending-up',
      unlocked: false,
      requirement: (stats) => stats.level >= 20,
      category: 'levels',
      rarity: 'rare'
    },
    {
      id: 'level_25',
      title: 'Quarter Century',
      description: 'Reach level 25',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.level >= 25,
      category: 'levels',
      rarity: 'epic'
    },
    {
      id: 'level_30',
      title: 'Thirty Titan',
      description: 'Reach level 30',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.level >= 30,
      category: 'levels',
      rarity: 'epic'
    },
    {
      id: 'level_40',
      title: 'Forty Force',
      description: 'Reach level 40',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.level >= 40,
      category: 'levels',
      rarity: 'epic'
    },
    {
      id: 'level_50',
      title: 'Half Century Hero',
      description: 'Reach level 50',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.level >= 50,
      category: 'levels',
      rarity: 'legendary'
    },
    {
      id: 'level_75',
      title: 'Legendary Status',
      description: 'Reach level 75',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.level >= 75,
      category: 'levels',
      rarity: 'legendary'
    },
    {
      id: 'level_100',
      title: 'Century Master',
      description: 'Reach level 100',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.level >= 100,
      category: 'levels',
      rarity: 'legendary'
    },

    // XP Achievements
    {
      id: 'xp_500',
      title: 'XP Collector',
      description: 'Earn 500 total XP',
      icon: 'star',
      unlocked: false,
      requirement: (stats) => stats.xp >= 500,
      category: 'xp',
      rarity: 'common'
    },
    {
      id: 'xp_1000',
      title: 'XP Hunter',
      description: 'Earn 1000 total XP',
      icon: 'star',
      unlocked: false,
      requirement: (stats) => stats.xp >= 1000,
      category: 'xp',
      rarity: 'common'
    },
    {
      id: 'xp_2500',
      title: 'XP Warrior',
      description: 'Earn 2500 total XP',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.xp >= 2500,
      category: 'xp',
      rarity: 'rare'
    },
    {
      id: 'xp_5000',
      title: 'XP Master',
      description: 'Earn 5000 total XP',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.xp >= 5000,
      category: 'xp',
      rarity: 'epic'
    },
    {
      id: 'xp_10000',
      title: 'XP Legend',
      description: 'Earn 10000 total XP',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.xp >= 10000,
      category: 'xp',
      rarity: 'legendary'
    },

    // Special Combination Achievements
    {
      id: 'balanced_100',
      title: 'Balanced Warrior',
      description: 'Complete 100 of each exercise type',
      icon: 'shield',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 100 && stats.totalSquats >= 100 && stats.totalAbs >= 100,
      category: 'special',
      rarity: 'epic'
    },
    {
      id: 'balanced_500',
      title: 'Perfect Balance',
      description: 'Complete 500 of each exercise type',
      icon: 'shield',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 500 && stats.totalSquats >= 500 && stats.totalAbs >= 500,
      category: 'special',
      rarity: 'legendary'
    },
    {
      id: 'balanced_1000',
      title: 'Ultimate Balance',
      description: 'Complete 1000 of each exercise type',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 1000 && stats.totalSquats >= 1000 && stats.totalAbs >= 1000,
      category: 'special',
      rarity: 'legendary'
    },
    {
      id: 'dedication_master',
      title: 'Dedication Master',
      description: 'Reach level 50 with a 100+ day streak',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.level >= 50 && stats.longestStreak >= 100,
      category: 'special',
      rarity: 'legendary'
    },
    {
      id: 'ultimate_warrior',
      title: 'Ultimate Warrior',
      description: 'Complete 10000 total exercises with level 100+',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => (stats.totalPushUps + stats.totalSquats + stats.totalAbs) >= 10000 && stats.level >= 100,
      category: 'special',
      rarity: 'legendary'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'push-ups', name: 'Push-ups', icon: 'fitness' },
    { id: 'squats', name: 'Squats', icon: 'body' },
    { id: 'abs', name: 'Abs', icon: 'diamond' },
    { id: 'total', name: 'Total', icon: 'star' },
    { id: 'streaks', name: 'Streaks', icon: 'flame' },
    { id: 'levels', name: 'Levels', icon: 'trending-up' },
    { id: 'xp', name: 'XP', icon: 'star' },
    { id: 'special', name: 'Special', icon: 'shield' }
  ];

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const statsData = await AsyncStorage.getItem('user_stats');
      if (statsData) {
        const parsed = JSON.parse(statsData);
        setUserStats(parsed);
      }
    } catch (error) {
      console.log('Error loading user stats:', error);
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setUserStats({
                totalPushUps: 0,
                totalSquats: 0,
                totalAbs: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastWorkoutDate: '',
                level: 1,
                xp: 0
              });
              Alert.alert('Success', 'Progress has been reset!');
            } catch (error) {
              console.log('Error resetting progress:', error);
              Alert.alert('Error', 'Failed to reset progress.');
            }
          },
        },
      ]
    );
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') {
      return achievements;
    }
    return achievements.filter(achievement => achievement.category === selectedCategory);
  };

  const getUnlockedAchievements = () => {
    return getFilteredAchievements().filter(achievement => achievement.requirement(userStats));
  };

  const getLockedAchievements = () => {
    return getFilteredAchievements().filter(achievement => !achievement.requirement(userStats));
  };

  const getTotalExercises = () => {
    return userStats.totalPushUps + userStats.totalSquats + userStats.totalAbs;
  };

  const getProgressToNextLevel = (): number => {
    const currentLevelXP = (userStats.level - 1) * 100;
    const nextLevelXP = userStats.level * 100;
    const progress = userStats.xp - currentLevelXP;
    const total = nextLevelXP - currentLevelXP;
    return (progress / total) * 100;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return colors.grey;
    }
  };

  const getRarityBorder = (rarity: string) => {
    return {
      borderColor: getRarityColor(rarity),
      borderWidth: 2
    };
  };

  return (
    <ScrollView style={commonStyles.wrapper}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            text="← Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* User Level Card */}
        <View style={[commonStyles.card, styles.levelCard]}>
          <View style={styles.levelHeader}>
            <Icon name="person-circle" size={48} style={styles.profileIcon} />
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Level {userStats.level}</Text>
              <Text style={styles.xpText}>{userStats.xp} XP</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${getProgressToNextLevel()}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(getProgressToNextLevel())}% to Level {userStats.level + 1}
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="flame" size={24} style={styles.statIcon} />
              <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="trophy" size={24} style={styles.statIcon} />
              <Text style={styles.statNumber}>{userStats.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="fitness" size={24} style={styles.statIcon} />
              <Text style={styles.statNumber}>{getTotalExercises()}</Text>
              <Text style={styles.statLabel}>Total Exercises</Text>
            </View>
          </View>
        </View>

        {/* Exercise Breakdown */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Exercise Breakdown</Text>
          <View style={styles.exerciseStats}>
            <View style={styles.exerciseStatRow}>
              <Icon name="fitness" size={20} style={styles.exerciseIcon} />
              <Text style={styles.exerciseLabel}>Push-ups</Text>
              <Text style={styles.exerciseNumber}>{userStats.totalPushUps}</Text>
            </View>
            <View style={styles.exerciseStatRow}>
              <Icon name="body" size={20} style={styles.exerciseIcon} />
              <Text style={styles.exerciseLabel}>Squats</Text>
              <Text style={styles.exerciseNumber}>{userStats.totalSquats}</Text>
            </View>
            <View style={styles.exerciseStatRow}>
              <Icon name="diamond" size={20} style={styles.exerciseIcon} />
              <Text style={styles.exerciseLabel}>Abs</Text>
              <Text style={styles.exerciseNumber}>{userStats.totalAbs}</Text>
            </View>
          </View>
        </View>

        {/* Achievement Categories */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Achievement Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <Button
                key={category.id}
                text={category.name}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategoryButton
                ]}
                textStyle={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.selectedCategoryButtonText
                ]}
              />
            ))}
          </ScrollView>
        </View>

        {/* Achievements */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>
            Achievements ({getUnlockedAchievements().length}/{getFilteredAchievements().length})
          </Text>
          
          {/* Unlocked Achievements */}
          {getUnlockedAchievements().length > 0 && (
            <View style={styles.achievementSection}>
              <Text style={styles.achievementSectionTitle}>Unlocked 🏆</Text>
              {getUnlockedAchievements().map((achievement) => (
                <View key={achievement.id} style={[
                  styles.achievementItem, 
                  styles.unlockedAchievement,
                  getRarityBorder(achievement.rarity)
                ]}>
                  <Icon name={achievement.icon as any} size={24} style={[
                    styles.achievementIcon,
                    { color: getRarityColor(achievement.rarity) }
                  ]} />
                  <View style={styles.achievementText}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={[styles.rarityText, { color: getRarityColor(achievement.rarity) }]}>
                      {achievement.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Locked Achievements */}
          {getLockedAchievements().length > 0 && (
            <View style={styles.achievementSection}>
              <Text style={styles.achievementSectionTitle}>Locked 🔒</Text>
              {getLockedAchievements().map((achievement) => (
                <View key={achievement.id} style={[styles.achievementItem, styles.lockedAchievement]}>
                  <Icon name={achievement.icon as any} size={24} style={styles.lockedIcon} />
                  <View style={styles.achievementText}>
                    <Text style={styles.lockedTitle}>{achievement.title}</Text>
                    <Text style={styles.lockedDescription}>{achievement.description}</Text>
                    <Text style={styles.lockedRarityText}>
                      {achievement.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Reset Button */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Button
            text="Reset All Progress"
            onPress={resetProgress}
            style={styles.resetButton}
          />
          <Text style={styles.resetWarning}>
            This will permanently delete all your workout data and achievements.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 'auto',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  levelCard: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    color: colors.accent,
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  xpText: {
    fontSize: 16,
    color: colors.grey,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    color: colors.accent,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
  exerciseStats: {
    gap: 12,
  },
  exerciseStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseIcon: {
    color: colors.accent,
    marginRight: 12,
  },
  exerciseLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey,
    width: 'auto',
  },
  selectedCategoryButton: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  selectedCategoryButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  achievementSection: {
    marginBottom: 16,
  },
  achievementSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  unlockedAchievement: {
    backgroundColor: colors.primary,
  },
  lockedAchievement: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  achievementIcon: {
    marginRight: 12,
  },
  lockedIcon: {
    color: colors.grey,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 2,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lockedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey,
  },
  lockedDescription: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 2,
  },
  lockedRarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.grey,
  },
  resetButton: {
    backgroundColor: '#F44336',
    marginBottom: 8,
  },
  resetWarning: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
