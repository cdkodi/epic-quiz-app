/**
 * Answer Option Component - Individual answer choice
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
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
      <View style={[styles.letterBadge, isSelected && styles.selectedBadge]}>
        <Text style={[styles.letterText, isSelected && styles.selectedLetterText]}>
          {getOptionLabel(index)}
        </Text>
      </View>
      <Text style={[getTextStyle(), styles.optionTextContent]}>
        {option}
      </Text>
      <View style={styles.selectionIndicator}>
        {isSelected ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed to flex-start for better multi-line text alignment
    backgroundColor: theme.backgrounds.card,
    borderRadius: BorderRadius.large,
    padding: ComponentSpacing.cardPadding,
    marginBottom: Spacing.m,
    minHeight: ComponentSpacing.minTouchTarget,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed to flex-start for consistency
    backgroundColor: theme.colors.softSaffron,
    borderWidth: 2,
    borderColor: theme.colors.primarySaffron,
    borderRadius: BorderRadius.large,
    padding: ComponentSpacing.cardPadding,
    marginBottom: Spacing.m,
    minHeight: ComponentSpacing.minTouchTarget,
    shadowColor: theme.colors.primarySaffron,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  optionDisabled: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed to flex-start for consistency
    backgroundColor: theme.colors.softGray,
    borderRadius: BorderRadius.large,
    padding: ComponentSpacing.cardPadding,
    marginBottom: Spacing.m,
    minHeight: ComponentSpacing.minTouchTarget,
    opacity: 0.6,
  },
  
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
    marginTop: 2, // Align with first line of text
    flexShrink: 0, // Don't shrink the badge
  },
  
  selectedBadge: {
    backgroundColor: theme.colors.primarySaffron,
  },
  
  letterText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.charcoal,
  },
  
  selectedLetterText: {
    color: theme.colors.white,
  },
  
  optionTextContent: {
    flex: 1,
    marginRight: Spacing.s,
    paddingTop: 2, // Align with letter badge
    lineHeight: 22, // Better line spacing for readability
  },
  
  optionText: {
    ...Typography.body,
    color: theme.text.primary,
  },
  
  optionTextSelected: {
    ...Typography.body,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
  },
  
  optionTextDisabled: {
    ...Typography.body,
    color: theme.text.tertiary,
  },
  
  selectionIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2, // Align with first line of text
    flexShrink: 0, // Don't shrink the indicator
  },
  
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primarySaffron,
  },
  
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme.colors.lightGray,
    backgroundColor: 'transparent',
  },
});

export default AnswerOption;