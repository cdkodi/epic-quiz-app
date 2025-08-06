/**
 * Epic Quiz App - Progress Bar Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, Typography, Spacing, BorderRadius } from '../../constants';

interface ProgressBarProps {
  progress: number; // 0-1
  showLabel?: boolean;
  label?: string;
  height?: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  label,
  height = 8,
  color = theme.colors.primaryGreen,
}) => {
  const percentage = Math.round(progress * 100);
  
  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          {label || `${percentage}%`}
        </Text>
      )}
      <View style={[styles.track, { height }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: color,
              height,
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  label: {
    ...Typography.caption,
    color: theme.text.tertiary,
    marginBottom: Spacing.xs,
    textAlign: 'right',
  },
  
  track: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: BorderRadius.small,
    overflow: 'hidden',
  },
  
  fill: {
    borderRadius: BorderRadius.small,
  },
});

export default ProgressBar;