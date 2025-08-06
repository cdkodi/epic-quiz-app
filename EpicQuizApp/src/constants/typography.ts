/**
 * Epic Quiz App - Typography System
 * Mobile-first typography with cultural content support
 */

import { Platform } from 'react-native';

export const FontSizes = {
  hero: 32,
  h1: 28,
  h2: 24,
  h3: 20,
  bodyLarge: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

// Platform-specific font families
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  // Headings
  hero: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.hero * LineHeights.tight,
    fontFamily,
  },
  
  h1: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.semiBold,
    lineHeight: FontSizes.h1 * LineHeights.tight,
    fontFamily,
  },
  
  h2: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.semiBold,
    lineHeight: FontSizes.h2 * LineHeights.tight,
    fontFamily,
  },
  
  h3: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h3 * LineHeights.normal,
    fontFamily,
  },

  // Body text
  bodyLarge: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodyLarge * LineHeights.normal,
    fontFamily,
  },
  
  body: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    fontFamily,
  },
  
  bodySmall: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    fontFamily,
  },
  
  caption: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    fontFamily,
  },

  // Button text
  buttonPrimary: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
    lineHeight: FontSizes.body * LineHeights.tight,
    fontFamily,
  },

  buttonSecondary: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.bodySmall * LineHeights.tight,
    fontFamily,
  },

  // Cultural content
  questionText: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodyLarge * LineHeights.relaxed,
    fontFamily,
  },

  explanation: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.relaxed,
    fontFamily,
  },

  culturalContext: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.relaxed,
    fontFamily,
  },
} as const;