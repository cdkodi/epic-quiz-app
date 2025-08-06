/**
 * Quiz Screen - Clean question presentation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { theme, Typography, ComponentSpacing } from '../constants';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

interface QuizScreenProps {
  route: QuizScreenRouteProp;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ route }) => {
  const { epic } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Screen</Text>
      <Text style={styles.subtitle}>Epic: {epic.title}</Text>
      <Text style={styles.subtitle}>Coming Soon: Clean question presentation</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgrounds.primary,
    padding: ComponentSpacing.screenHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  title: {
    ...Typography.h1,
    color: theme.text.primary,
    marginBottom: ComponentSpacing.m,
    textAlign: 'center',
  },
  
  subtitle: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: ComponentSpacing.s,
  },
});

export default QuizScreen;