/**
 * Welcome Screen - First impression for new users
 * Features Ramayana artwork background with overlay content
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme, Typography, Spacing } from '../constants';
import { Button } from '../components/common';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleGetStarted = () => {
    // Navigate to main Library screen (like screenshot)
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ImageBackground
        source={require('../assets/images/epics/ramayana/bala-kanda.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        {/* Dark overlay for text readability */}
        <View style={styles.overlay} />
        
        {/* Content Container */}
        <View style={styles.contentContainer}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* QuizVeda Text Logo */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                <Text style={styles.quizText}>Quiz</Text>
                <Text style={styles.vedaText}>Veda</Text>
              </Text>
            </View>
            <Text style={styles.tagline}>
              Discover Ancient Wisdom Through Interactive Learning
            </Text>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              style={styles.getStartedButton}
            />
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.skipText}>Skip Introduction</Text>
            </TouchableOpacity>
          </View>

          {/* Cultural Attribution */}
          <View style={styles.attributionSection}>
            <Text style={styles.attribution}>
              Featuring authentic artwork from classical epic traditions
            </Text>
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primarySaffron,
  },

  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },

  backgroundImageStyle: {
    opacity: 0.8,
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for text readability
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    zIndex: 1,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  logoText: {
    fontSize: 48,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  quizText: {
    color: '#FEF7ED', // Off-white/cream
  },

  vedaText: {
    color: '#EA580C', // Orange
  },

  tagline: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: Spacing.l,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Action Section
  actionSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  getStartedButton: {
    backgroundColor: theme.colors.primarySaffron,
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 25,
    elevation: 8,
    shadowColor: theme.colors.primarySaffron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: Spacing.m,
    minWidth: 200,
  },

  skipButton: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
  },

  skipText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Attribution Section
  attributionSection: {
    alignItems: 'center',
  },

  attribution: {
    ...Typography.caption,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default WelcomeScreen;