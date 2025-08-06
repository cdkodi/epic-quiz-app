/**
 * Epic Quiz App - Reusable Button Component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme, ComponentSpacing, BorderRadius } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'disabled';
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
  disabled = false,
}) => {
  const buttonVariant = disabled ? 'disabled' : variant;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`${size}Button`],
        styles[`${buttonVariant}Button`],
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.buttonText,
        styles[`${size}Text`],
        styles[`${buttonVariant}Text`],
        textStyle,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ComponentSpacing.buttonPaddingVertical,
    paddingHorizontal: ComponentSpacing.buttonPaddingHorizontal,
    minHeight: ComponentSpacing.minTouchTarget,
  },
  
  // Size variants
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  // Color variants
  primaryButton: {
    backgroundColor: theme.buttons.primary.background,
  },
  
  secondaryButton: {
    backgroundColor: theme.buttons.secondary.background,
  },
  
  successButton: {
    backgroundColor: theme.buttons.success.background,
  },
  
  disabledButton: {
    backgroundColor: theme.buttons.disabled.background,
  },
  
  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  largeText: {
    fontSize: 16,
  },
  
  mediumText: {
    fontSize: 15,
  },
  
  smallText: {
    fontSize: 14,
  },
  
  // Text color variants
  primaryText: {
    color: theme.buttons.primary.text,
  },
  
  secondaryText: {
    color: theme.buttons.secondary.text,
  },
  
  successText: {
    color: theme.buttons.success.text,
  },
  
  disabledText: {
    color: theme.buttons.disabled.text,
  },
});

export default Button;