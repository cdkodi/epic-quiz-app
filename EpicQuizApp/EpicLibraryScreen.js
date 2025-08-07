/**
 * Epic Library Screen - Simplified for Expo compatibility
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';

const EpicLibraryScreen = ({ navigation }) => {
  const handleEpicPress = () => {
    Alert.alert(
      '🎯 Start Quiz',
      'Ready to test your knowledge of THE RAMAYANA?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Learning',
          style: 'default',
          onPress: () => {
            navigation.navigate('Quiz');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>📚 Epic Library</Text>
          <Text style={styles.subtitle}>Discover Classical Literature</Text>
        </View>

        {/* Epic Card - Ramayana */}
        <TouchableOpacity 
          style={styles.epicCard}
          onPress={handleEpicPress}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.epicIcon}>🕉️</Text>
            <View style={styles.cardContent}>
              <Text style={styles.epicTitle}>THE RAMAYANA</Text>
              <Text style={styles.epicSubtitle}>Ancient Epic of Honor & Duty</Text>
              <Text style={styles.language}>Sanskrit</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
            <Text style={styles.progressText}>80% Complete</Text>
          </View>
          
          <Text style={styles.questionCount}>847 Questions Available</Text>
          <Text style={styles.availableTag}>🟢 AVAILABLE</Text>
        </TouchableOpacity>

        {/* Epic Card - Mahabharata (Locked) */}
        <TouchableOpacity 
          style={[styles.epicCard, styles.lockedCard]}
          onPress={() => Alert.alert('🔒 Locked', 'Complete more Ramayana quizzes to unlock!')}
          activeOpacity={0.6}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.epicIcon}>⚔️</Text>
            <View style={styles.cardContent}>
              <Text style={[styles.epicTitle, styles.lockedText]}>THE MAHABHARATA</Text>
              <Text style={[styles.epicSubtitle, styles.lockedText]}>Great Epic of Cosmic War</Text>
              <Text style={[styles.language, styles.lockedText]}>Sanskrit</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%', backgroundColor: '#ccc' }]} />
            </View>
            <Text style={styles.progressText}>0% Complete</Text>
          </View>
          
          <Text style={styles.questionCount}>1,200+ Questions Ready</Text>
          <Text style={styles.lockedTag}>🔒 UNLOCK BY COMPLETING RAMAYANA</Text>
        </TouchableOpacity>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <Text style={styles.achievementText}>🎖️ Characters Master</Text>
          <Text style={styles.achievementText}>🌟 5-Day Learning Streak</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  epicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  lockedCard: {
    opacity: 0.7,
    backgroundColor: '#f9f9f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  epicIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  epicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  epicSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  language: {
    fontSize: 12,
    color: '#999999',
  },
  lockedText: {
    color: '#aaa',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  questionCount: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 8,
  },
  availableTag: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  lockedTag: {
    fontSize: 12,
    color: '#D4700A',
    fontWeight: 'bold',
  },
  achievementsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  achievementText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
});

export default EpicLibraryScreen;