/**
 * Explanation Screen - Basic explanation + Learn More
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { theme, Typography, ComponentSpacing } from '../constants';

type ExplanationScreenRouteProp = RouteProp<RootStackParamList, 'Explanation'>;

interface ExplanationScreenProps {
  route: ExplanationScreenRouteProp;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ route }) => {
  const { currentIndex } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explanation Screen</Text>
      <Text style={styles.subtitle}>Question {currentIndex + 1}</Text>
      <Text style={styles.subtitle}>Coming Soon: Basic explanation + Learn More</Text>
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

export default ExplanationScreen;