/**
 * Score Circle Component - Circular progress visualization for quiz results
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, Typography } from '../../constants';

interface ScoreCircleProps {
  score: number; // 0-100
  size?: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  score, 
  size = 120 
}) => {
  const radius = size / 2;
  const strokeWidth = 8;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * innerRadius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.colors.lightGreen;
    if (score >= 70) return theme.colors.primaryGreen;
    if (score >= 50) return theme.colors.lightSaffron;
    return theme.colors.error;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: strokeWidth,
          borderColor: theme.colors.lightGray,
        }
      ]} />
      
      {/* Progress Circle */}
      <View style={[
        styles.progressCircle,
        {
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: strokeWidth,
          borderColor: getScoreColor(score),
          borderTopColor: getScoreColor(score),
          borderRightColor: score > 25 ? getScoreColor(score) : theme.colors.lightGray,
          borderBottomColor: score > 50 ? getScoreColor(score) : theme.colors.lightGray,
          borderLeftColor: score > 75 ? getScoreColor(score) : theme.colors.lightGray,
          transform: [{ rotate: '-90deg' }],
        }
      ]} />
      
      {/* Score Text */}
      <View style={styles.scoreContainer}>
        <Text style={[
          styles.scoreText,
          { fontSize: size * 0.25 }
        ]}>
          {score}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  circle: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  
  progressCircle: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  
  scoreText: {
    ...Typography.hero,
    fontWeight: 'bold',
    color: theme.text.primary,
    textAlign: 'center',
  },
});

export default ScoreCircle;