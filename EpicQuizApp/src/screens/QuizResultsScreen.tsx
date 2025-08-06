/**
 * Quiz Results Screen - Score + reviewable questions
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { theme, Typography, ComponentSpacing } from '../constants';

type QuizResultsScreenRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;

interface QuizResultsScreenProps {
  route: QuizResultsScreenRouteProp;
}

const QuizResultsScreen: React.FC<QuizResultsScreenProps> = ({ route }) => {
  const { score } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results Screen</Text>
      <Text style={styles.subtitle}>Score: {score}%</Text>
      <Text style={styles.subtitle}>Coming Soon: Score + reviewable questions</Text>
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

export default QuizResultsScreen;