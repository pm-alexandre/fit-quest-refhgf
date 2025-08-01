
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

  const achievements: Achievement[] = [
    {
      id: 'first_workout',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: 'star',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps + stats.totalSquats + stats.totalAbs > 0
    },
    {
      id: 'pushup_master',
      title: 'Push-up Master',
      description: 'Complete 100 push-ups total',
      icon: 'trophy',
      unlocked: false,
      requirement: (stats) => stats.totalPushUps >= 100
    },
    {
      id: 'squat_champion',
      title: 'Squat Champion',
      description: 'Complete 200 squats total',
      icon: 'medal',
      unlocked: false,
      requirement: (stats) => stats.totalSquats >= 200
    },
    {
      id: 'abs_warrior',
      title: 'Abs Warrior',
      description: 'Complete 150 abs exercises total',
      icon: 'shield',
      unlocked: false,
      requirement: (stats) => stats.totalAbs >= 150
    },
    {
      id: 'streak_starter',
      title: 'Streak Starter',
      description: 'Maintain a 3-day streak',
      icon: 'flame',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 3
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'calendar',
      unlocked: false,
      requirement: (stats) => stats.currentStreak >= 7
    },
    {
      id: 'level_up',
      title: 'Level Up!',
      description: 'Reach level 5',
      icon: 'trending-up',
      unlocked: false,
      requirement: (stats) => stats.level >= 5
    },
    {
      id: 'dedication',
      title: 'Dedication',
      description: 'Reach level 10',
      icon: 'diamond',
      unlocked: false,
      requirement: (stats) => stats.level >= 10
    }
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

  const getUnlockedAchievements = () => {
    return achievements.filter(achievement => achievement.requirement(userStats));
  };

  const getLockedAchievements = () => {
    return achievements.filter(achievement => !achievement.requirement(userStats));
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

        {/* Achievements */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>
            Achievements ({getUnlockedAchievements().length}/{achievements.length})
          </Text>
          
          {/* Unlocked Achievements */}
          {getUnlockedAchievements().length > 0 && (
            <View style={styles.achievementSection}>
              <Text style={styles.achievementSectionTitle}>Unlocked 🏆</Text>
              {getUnlockedAchievements().map((achievement) => (
                <View key={achievement.id} style={[styles.achievementItem, styles.unlockedAchievement]}>
                  <Icon name={achievement.icon as any} size={24} style={styles.achievementIcon} />
                  <View style={styles.achievementText}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
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
    borderWidth: 1,
    borderColor: colors.accent,
  },
  lockedAchievement: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  achievementIcon: {
    color: colors.accent,
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
  },
  lockedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey,
  },
  lockedDescription: {
    fontSize: 12,
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
