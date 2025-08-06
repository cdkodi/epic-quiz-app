/**
 * Epic Quiz App - Spacing System
 * Consistent spacing for components and layouts
 */

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
} as const;

export const ComponentSpacing = {
  // Card spacing
  cardPadding: Spacing.l,
  cardMargin: Spacing.m,
  
  // Button spacing
  buttonPaddingVertical: 14,
  buttonPaddingHorizontal: Spacing.l,
  
  // Screen margins
  screenHorizontal: Spacing.m,
  screenVertical: Spacing.l,
  
  // Section spacing
  sectionSpacing: Spacing.l,
  
  // List item spacing
  listItemPadding: 12,
  
  // Touch target minimum
  minTouchTarget: 44,
} as const;

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  round: 50,
} as const;