
import { Text, View, ScrollView, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { commonStyles, colors } from '../styles/commonStyles';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { StyleSheet } from 'react-native';

interface ExerciseData {
  pushUps: number;
  squats: number;
  abs: number;
}

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

export default function HomeScreen() {
  const [todayExercises, setTodayExercises] = useState<ExerciseData>({
    pushUps: 0,
    squats: 0,
    abs: 0
  });
  
  const [inputValues, setInputValues] = useState<ExerciseData>({
    pushUps: 0,
    squats: 0,
    abs: 0
  });

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

  const [hasWorkedOutToday, setHasWorkedOutToday] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const todayKey = new Date().toDateString();
      const todayData = await AsyncStorage.getItem(`workout_${todayKey}`);
      const statsData = await AsyncStorage.getItem('user_stats');
      
      if (todayData) {
        const parsed = JSON.parse(todayData);
        setTodayExercises(parsed);
        setInputValues(parsed);
        setHasWorkedOutToday(true);
      }
      
      if (statsData) {
        const parsed = JSON.parse(statsData);
        setUserStats(parsed);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const calculateXP = (exercises: ExerciseData): number => {
    return exercises.pushUps * 2 + exercises.squats * 1.5 + exercises.abs * 2.5;
  };

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 100) + 1;
  };

  const updateStreak = (lastDate: string): { currentStreak: number; longestStreak: number } => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWorkout = lastDate ? new Date(lastDate) : null;
    
    let newCurrentStreak = userStats.currentStreak;
    
    if (!lastWorkout) {
      newCurrentStreak = 1;
    } else if (lastWorkout.toDateString() === yesterday.toDateString()) {
      newCurrentStreak = userStats.currentStreak + 1;
    } else if (lastWorkout.toDateString() !== today.toDateString()) {
      newCurrentStreak = 1;
    }
    
    const newLongestStreak = Math.max(userStats.longestStreak, newCurrentStreak);
    
    return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak };
  };

  const saveWorkout = async () => {
    try {
      const todayKey = new Date().toDateString();
      const totalExercises = inputValues.pushUps + inputValues.squats + inputValues.abs;
      
      if (totalExercises === 0) {
        Alert.alert('No exercises', 'Please add at least one exercise before saving!');
        return;
      }

      // Save today's workout
      await AsyncStorage.setItem(`workout_${todayKey}`, JSON.stringify(inputValues));
      
      // Calculate new XP
      const newXP = calculateXP(inputValues);
      const streakData = updateStreak(userStats.lastWorkoutDate);
      
      // Update user stats
      const newStats: UserStats = {
        totalPushUps: userStats.totalPushUps + inputValues.pushUps,
        totalSquats: userStats.totalSquats + inputValues.squats,
        totalAbs: userStats.totalAbs + inputValues.abs,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastWorkoutDate: new Date().toDateString(),
        xp: userStats.xp + newXP,
        level: calculateLevel(userStats.xp + newXP)
      };
      
      await AsyncStorage.setItem('user_stats', JSON.stringify(newStats));
      
      setTodayExercises(inputValues);
      setUserStats(newStats);
      setHasWorkedOutToday(true);
      
      Alert.alert(
        'Workout Saved! 🎉', 
        `Great job! You earned ${Math.round(newXP)} XP!\nCurrent streak: ${streakData.currentStreak} days`
      );
    } catch (error) {
      console.log('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const updateInput = (exercise: keyof ExerciseData, value: string) => {
    const numValue = parseInt(value) || 0;
    setInputValues(prev => ({
      ...prev,
      [exercise]: numValue
    }));
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
          <Text style={styles.headerTitle}>FitTracker 💪</Text>
          <Button
            text="Profile"
            onPress={() => router.push('/profile')}
            style={styles.profileButton}
          />
        </View>

        {/* Streak Card */}
        <View style={[commonStyles.card, styles.streakCard]}>
          <View style={styles.streakContent}>
            <Icon name="flame" size={32} style={styles.streakIcon} />
            <View>
              <Text style={styles.streakNumber}>{userStats.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          <Text style={styles.streakSubtext}>
            Longest: {userStats.longestStreak} days
          </Text>
        </View>

        {/* Level Progress */}
        <View style={[commonStyles.card, styles.levelCard]}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelText}>Level {userStats.level}</Text>
            <Text style={styles.xpText}>{userStats.xp} XP</Text>
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

        {/* Today's Workout */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Today&apos;s Workout</Text>
          
          {/* Push-ups */}
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseInfo}>
              <Icon name="fitness" size={24} style={styles.exerciseIcon} />
              <Text style={styles.exerciseName}>Push-ups</Text>
            </View>
            <TextInput
              style={styles.input}
              value={inputValues.pushUps.toString()}
              onChangeText={(value) => updateInput('pushUps', value)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.grey}
            />
          </View>

          {/* Squats */}
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseInfo}>
              <Icon name="body" size={24} style={styles.exerciseIcon} />
              <Text style={styles.exerciseName}>Squats</Text>
            </View>
            <TextInput
              style={styles.input}
              value={inputValues.squats.toString()}
              onChangeText={(value) => updateInput('squats', value)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.grey}
            />
          </View>

          {/* Abs */}
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseInfo}>
              <Icon name="diamond" size={24} style={styles.exerciseIcon} />
              <Text style={styles.exerciseName}>Abs</Text>
            </View>
            <TextInput
              style={styles.input}
              value={inputValues.abs.toString()}
              onChangeText={(value) => updateInput('abs', value)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.grey}
            />
          </View>

          <Button
            text={hasWorkedOutToday ? "Update Workout" : "Save Workout"}
            onPress={saveWorkout}
            style={styles.saveButton}
          />
        </View>

        {/* Quick Stats */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalPushUps}</Text>
              <Text style={styles.statLabel}>Total Push-ups</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalSquats}</Text>
              <Text style={styles.statLabel}>Total Squats</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalAbs}</Text>
              <Text style={styles.statLabel}>Total Abs</Text>
            </View>
          </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: 'auto',
  },
  streakCard: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakIcon: {
    marginRight: 12,
    color: '#FF6B35',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  streakLabel: {
    fontSize: 16,
    color: colors.grey,
  },
  streakSubtext: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  levelCard: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  xpText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
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
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseIcon: {
    marginRight: 12,
    color: colors.accent,
  },
  exerciseName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
});
