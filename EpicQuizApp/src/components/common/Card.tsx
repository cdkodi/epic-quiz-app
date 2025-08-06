/**
 * Epic Quiz App - Reusable Card Component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme, ComponentSpacing, BorderRadius } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  padding = 'large' 
}) => {
  return (
    <View style={[
      styles.card, 
      styles[`${padding}Padding`],
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.backgrounds.card,
    borderRadius: BorderRadius.large,
    shadowColor: theme.colors.charcoal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  
  nonePadding: {
    padding: 0,
  },
  
  smallPadding: {
    padding: ComponentSpacing.s,
  },
  
  mediumPadding: {
    padding: ComponentSpacing.m,
  },
  
  largePadding: {
    padding: ComponentSpacing.cardPadding,
  },
});

export default Card;