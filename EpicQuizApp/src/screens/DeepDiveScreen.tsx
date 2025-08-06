/**
 * Deep Dive Screen - Rich cultural content
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { theme, Typography, ComponentSpacing } from '../constants';

type DeepDiveScreenRouteProp = RouteProp<RootStackParamList, 'DeepDive'>;

interface DeepDiveScreenProps {
  route: DeepDiveScreenRouteProp;
}

const DeepDiveScreen: React.FC<DeepDiveScreenProps> = ({ route }) => {
  const { questionText } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Dive Screen</Text>
      <Text style={styles.subtitle}>Question: {questionText}</Text>
      <Text style={styles.subtitle}>Coming Soon: Rich cultural content</Text>
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

export default DeepDiveScreen;