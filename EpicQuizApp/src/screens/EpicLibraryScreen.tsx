/**
 * Epic Library Screen - Browse available literature
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, Typography, ComponentSpacing } from '../constants';

const EpicLibraryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Epic Library Screen</Text>
      <Text style={styles.subtitle}>Coming Soon: Browse classical literature</Text>
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
  },
});

export default EpicLibraryScreen;