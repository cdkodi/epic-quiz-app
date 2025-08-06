/**
 * Epic Quiz App - Color System
 * Based on sophisticated cultural colors: muted saffron, green, blue
 */

export const Colors = {
  // Saffron Tones (Wisdom & Learning)
  primarySaffron: '#D4700A',
  lightSaffron: '#F5B041',
  softSaffron: '#FCE4B6',
  deepSaffron: '#B7590A',

  // Green Tones (Growth & Progress)
  primaryGreen: '#2E7D32',
  lightGreen: '#66BB6A',
  softGreen: '#C8E6C9',
  deepGreen: '#1B5E20',

  // Blue Tones (Knowledge & Depth)
  primaryBlue: '#1565C0',
  lightBlue: '#42A5F5',
  softBlue: '#BBDEFB',
  deepBlue: '#0D47A1',

  // Neutral Colors
  charcoal: '#2C2C2C',
  darkGray: '#4A4A4A',
  mediumGray: '#757575',
  lightGray: '#E0E0E0',
  softGray: '#F5F5F5',
  white: '#FFFFFF',

  // Semantic Colors
  success: '#66BB6A',
  warning: '#F5B041',
  error: '#E57373',
  info: '#42A5F5',

  // Cultural Context Colors
  sanskritText: '#0D47A1',
  translationText: '#4A4A4A',
  culturalNotes: '#B7590A',
  modernRelevance: '#1B5E20',
} as const;

// Theme object for easy component usage
export const theme = {
  colors: Colors,
  
  // Background colors
  backgrounds: {
    primary: Colors.softGray,
    card: Colors.white,
    explanation: Colors.softSaffron,
    success: Colors.softGreen,
    info: Colors.softBlue,
  },

  // Text colors by context
  text: {
    primary: Colors.charcoal,
    secondary: Colors.darkGray,
    tertiary: Colors.mediumGray,
    inverse: Colors.white,
    accent: Colors.primarySaffron,
  },

  // Button colors
  buttons: {
    primary: {
      background: Colors.primarySaffron,
      text: Colors.white,
    },
    secondary: {
      background: Colors.primaryBlue,
      text: Colors.white,
    },
    success: {
      background: Colors.primaryGreen,
      text: Colors.white,
    },
    disabled: {
      background: Colors.lightGray,
      text: Colors.mediumGray,
    },
  },
};