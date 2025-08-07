/**
 * Answer Option Component - Individual answer choice
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme, Typography, ComponentSpacing, BorderRadius, Spacing } from '../../constants';

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  index,
  isSelected,
  onPress,
  disabled = false,
}) => {
  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getOptionStyle = (): ViewStyle => {
    if (disabled) {
      return styles.optionDisabled;
    }
    if (isSelected) {
      return styles.optionSelected;
    }
    return styles.option;
  };

  const getTextStyle = () => {
    if (disabled) {
      return styles.optionTextDisabled;
    }
    if (isSelected) {
      return styles.optionTextSelected;
    }
    return styles.optionText;
  };

  return (
    <TouchableOpacity
      style={[getOptionStyle()]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={getTextStyle()}>
        {getOptionLabel(index)}) {option}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    backgroundColor: theme.backgrounds.card,
    borderWidth: 2,
    borderColor: theme.colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    minHeight: ComponentSpacing.minTouchTarget + 12, // Extra height for readability
    justifyContent: 'center',
  },
  
  optionSelected: {
    backgroundColor: theme.colors.softBlue,
    borderWidth: 2,
    borderColor: theme.colors.primaryBlue,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    minHeight: ComponentSpacing.minTouchTarget + 12,
    justifyContent: 'center',
  },
  
  optionDisabled: {
    backgroundColor: theme.colors.softGray,
    borderWidth: 2,
    borderColor: theme.colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    minHeight: ComponentSpacing.minTouchTarget + 12,
    justifyContent: 'center',
    opacity: 0.6,
  },
  
  optionText: {
    ...Typography.body,
    color: theme.text.primary,
    textAlign: 'left',
  },
  
  optionTextSelected: {
    ...Typography.body,
    color: theme.colors.primaryBlue,
    fontWeight: '600',
    textAlign: 'left',
  },
  
  optionTextDisabled: {
    ...Typography.body,
    color: theme.text.tertiary,
    textAlign: 'left',
  },
});

export default AnswerOption;