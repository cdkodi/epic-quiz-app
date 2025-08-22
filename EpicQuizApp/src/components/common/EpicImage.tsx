/**
 * Epic Image Component - Displays images for Kandas/Epics with fallback handling
 */

import React, { useState } from 'react';
import { 
  Image, 
  View, 
  Text, 
  StyleSheet, 
  ImageStyle, 
  ViewStyle 
} from 'react-native';
import { theme, Typography, Spacing } from '../../constants';

interface EpicImageProps {
  epicId: string;
  kandaName?: string;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  aspectRatio?: 'square' | 'wide' | 'tall';
  showFallback?: boolean;
  fallbackIcon?: string;
}

const EpicImage: React.FC<EpicImageProps> = ({
  epicId,
  kandaName,
  style,
  containerStyle,
  aspectRatio = 'wide',
  showFallback = true,
  fallbackIcon
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Static image mapping - React Native requires static paths
  const getImagePath = () => {
    // Ramayana Kanda images
    if (epicId === 'ramayana' && kandaName) {
      const kandaKey = kandaName.toLowerCase().replace(/\s+/g, '-');
      
      switch (kandaKey) {
        case 'bala-kanda':
          return require('../../assets/images/epics/ramayana/bala-kanda.png');
        case 'ayodhya-kanda':
          // return require('../../assets/images/epics/ramayana/ayodhya-kanda.png');
          return null; // Image not added yet
        case 'aranya-kanda':
          // return require('../../assets/images/epics/ramayana/aranya-kanda.png');
          return null; // Image not added yet
        case 'kishkindha-kanda':
          // return require('../../assets/images/epics/ramayana/kishkindha-kanda.png');
          return null; // Image not added yet
        case 'sundara-kanda':
          // return require('../../assets/images/epics/ramayana/sundara-kanda.png');
          return null; // Image not added yet
        case 'yuddha-kanda':
          // return require('../../assets/images/epics/ramayana/yuddha-kanda.png');
          return null; // Image not added yet
        case 'uttara-kanda':
          // return require('../../assets/images/epics/ramayana/uttara-kanda.png');
          return null; // Image not added yet
        default:
          return null;
      }
    }
    
    // Epic cover images
    if (!kandaName) {
      switch (epicId) {
        case 'ramayana':
          return require('../../assets/images/epics/ramayana/cover.png');
        case 'mahabharata':
          return require('../../assets/images/epics/mahabharata/cover.png');
        case 'bhagavad_gita':
          return require('../../assets/images/epics/bhagavad_gita/cover.png');
        default:
          return null;
      }
    }
    
    return null; // Fallback for any other case
  };

  // Get fallback icon based on epic/kanda
  const getFallbackIcon = () => {
    if (fallbackIcon) return fallbackIcon;
    
    if (epicId === 'ramayana') {
      if (kandaName) {
        switch (kandaName.toLowerCase()) {
          case 'bala kanda': return '👶';
          case 'ayodhya kanda': return '🏰';
          case 'aranya kanda': return '🌲';
          case 'kishkindha kanda': return '🐒';
          case 'sundara kanda': return '🕊️';
          case 'yuddha kanda': return '⚔️';
          case 'uttara kanda': return '🏡';
          default: return '📖';
        }
      }
      return '🕉️';
    }
    return '📚';
  };

  // Get aspect ratio dimensions
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case 'square':
        return { aspectRatio: 1 };
      case 'tall':
        return { aspectRatio: 3/4 };
      case 'wide':
      default:
        return { aspectRatio: 16/9 };
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Show fallback if error, no image available, or path is null
  const imagePath = getImagePath();
  const showFallbackContent = imageError || !imagePath || !showFallback;

  return (
    <View style={[styles.container, getAspectRatioStyle(), containerStyle]}>
      {!showFallbackContent && imagePath ? (
        <>
          <Image
            source={imagePath}
            style={[styles.image, style]}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="cover"
          />
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackIcon}>{getFallbackIcon()}</Text>
          {kandaName && (
            <Text style={styles.fallbackText}>{kandaName}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.lightGray + '20',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.lightGray + '50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    ...Typography.caption,
    color: theme.text.secondary,
  },

  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySaffron + '10',
    padding: Spacing.m,
  },

  fallbackIcon: {
    fontSize: 32,
    marginBottom: Spacing.s,
  },

  fallbackText: {
    ...Typography.caption,
    color: theme.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default EpicImage;