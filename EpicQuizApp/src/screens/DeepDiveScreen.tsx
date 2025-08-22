/**
 * Deep Dive Screen - Rich cultural content
 */

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Card, Button } from '../components/common';
import { apiService } from '../services/api';
import { DeepDiveContent } from '../types/api';

type DeepDiveScreenRouteProp = RouteProp<RootStackParamList, 'DeepDive'>;

interface DeepDiveScreenProps {
  route: DeepDiveScreenRouteProp;
}

const DeepDiveScreen: React.FC<DeepDiveScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { questionId, questionText } = route.params;
  const [deepDiveContent, setDeepDiveContent] = useState<DeepDiveContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeepDiveContent = async () => {
      try {
        setLoading(true);
        console.log(`🔍 Fetching deep dive content for question: ${questionId}`);
        
        const response = await apiService.getDeepDiveContent(questionId);
        
        if (response.success && response.data) {
          console.log('✅ Deep dive content loaded successfully');
          setDeepDiveContent(response.data);
        } else {
          console.warn('⚠️ No deep dive content available:', response.error);
          setError(response.message || 'Content not available');
        }
      } catch (err) {
        console.error('❌ Failed to fetch deep dive content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeepDiveContent();
  }, [questionId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primarySaffron} />
          <Text style={styles.loadingText}>Loading cultural insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !deepDiveContent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.errorCard}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>🏛️</Text>
            </View>
            <Text style={styles.title}>Cultural Deep Dive</Text>
            <Text style={styles.subtitle}>Exploring the Rich Heritage</Text>
            <View style={styles.divider} />
            <Text style={styles.questionText}>{questionText}</Text>
            
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>📚</Text>
              <Text style={styles.errorTitle}>Rich Content Coming Soon</Text>
              <Text style={styles.errorMessage}>
                We're working on enriching this question with detailed content 
                from the authentic Ramayana text and traditional summaries.
              </Text>
              
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>📚 Content will include:</Text>
                <Text style={styles.placeholderContent}>
                  🏛️ Chapter context and narrative summary{'\n'}
                  👑 Key characters and their roles{'\n'}
                  ⚔️ Important events and their significance{'\n'}
                  🎭 Cultural themes and teachings{'\n'}
                  📖 Traditional interpretations
                </Text>
              </View>
            </View>

            <Button
              title="← Back to Review"
              onPress={() => navigation.goBack()}
              variant="primary"
              style={styles.backButton}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>🏛️</Text>
          </View>
          <Text style={styles.title}>Cultural Deep Dive</Text>
          <Text style={styles.subtitle}>Exploring the Rich Heritage</Text>
          <View style={styles.divider} />
          <Text style={styles.questionText}>{questionText}</Text>
        </Card>

        {/* Detailed Explanation */}
        {deepDiveContent.detailedExplanation && (
          <Card style={styles.contentCard}>
            <Text style={styles.sectionTitle}>🔍 Detailed Explanation</Text>
            <Text style={styles.contentText}>
              {deepDiveContent.detailedExplanation}
            </Text>
          </Card>
        )}

        {/* Historical Background */}
        {deepDiveContent.historicalBackground && (
          <Card style={styles.contentCard}>
            <Text style={styles.sectionTitle}>🏛️ Historical Background</Text>
            <Text style={styles.contentText}>
              {deepDiveContent.historicalBackground}
            </Text>
          </Card>
        )}

        {/* Cultural Significance */}
        {deepDiveContent.culturalSignificance && (
          <Card style={[styles.contentCard, styles.culturalCard]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎭</Text>
              <Text style={styles.sectionTitle}>Cultural Significance</Text>
            </View>
            <Text style={styles.contentText}>
              {deepDiveContent.culturalSignificance}
            </Text>
          </Card>
        )}

        {/* Chapter Summary */}
        {deepDiveContent.chapterSummary && (
          <Card style={[styles.contentCard, styles.chapterCard]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📖</Text>
              <Text style={styles.sectionTitle}>Chapter Context</Text>
            </View>
            <Text style={styles.chapterTitle}>
              {deepDiveContent.chapterSummary.title}
            </Text>
            
            {deepDiveContent.chapterSummary.narrativeSummary && (
              <>
                <Text style={styles.subsectionTitle}>Story Summary</Text>
                <Text style={styles.contentText}>
                  {deepDiveContent.chapterSummary.narrativeSummary}
                </Text>
              </>
            )}
            
            {deepDiveContent.chapterSummary.keyEvents && (
              <>
                <Text style={styles.subsectionTitle}>Key Events</Text>
                <Text style={styles.contentText}>
                  {deepDiveContent.chapterSummary.keyEvents}
                </Text>
              </>
            )}
            
            {deepDiveContent.chapterSummary.mainCharacters && (
              <>
                <Text style={styles.subsectionTitle}>Main Characters</Text>
                <Text style={styles.contentText}>
                  {deepDiveContent.chapterSummary.mainCharacters}
                </Text>
              </>
            )}
          </Card>
        )}

        {/* Scholarly Notes */}
        {deepDiveContent.scholarlyNotes && (
          <Card style={styles.contentCard}>
            <Text style={styles.sectionTitle}>🎓 Scholarly Insights</Text>
            <Text style={styles.contentText}>
              {deepDiveContent.scholarlyNotes}
            </Text>
          </Card>
        )}


        {/* Back Button */}
        <Button
          title="← Back to Review"
          onPress={() => navigation.goBack()}
          variant="primary"
          style={styles.backButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgrounds.primary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: ComponentSpacing.screenHorizontal,
    paddingVertical: ComponentSpacing.screenVertical,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ComponentSpacing.screenHorizontal,
  },
  
  loadingText: {
    ...Typography.body,
    color: theme.text.secondary,
    marginTop: Spacing.m,
    textAlign: 'center',
  },
  
  headerCard: {
    marginBottom: Spacing.m,
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.backgrounds.accent,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primarySaffron,
  },
  
  headerIcon: {
    marginBottom: Spacing.m,
  },
  
  headerEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  
  title: {
    ...Typography.h1,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.s,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  subtitle: {
    ...Typography.subtitle,
    color: theme.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.m,
  },
  
  divider: {
    width: 60,
    height: 2,
    backgroundColor: theme.colors.primarySaffron,
    marginBottom: Spacing.m,
  },
  
  questionText: {
    ...Typography.h3,
    color: theme.text.primary,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  
  contentCard: {
    marginBottom: Spacing.m,
    padding: Spacing.l,
    borderRadius: 12,
  },
  
  culturalCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primaryBlue,
    backgroundColor: theme.backgrounds.secondary,
  },
  
  chapterCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primaryGreen,
    backgroundColor: theme.backgrounds.tertiary,
  },
  
  connectionsCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primarySaffron,
    backgroundColor: theme.backgrounds.accent,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  
  sectionIcon: {
    fontSize: 24,
    marginRight: Spacing.s,
  },
  
  sectionTitle: {
    ...Typography.h2,
    color: theme.colors.primaryBlue,
    fontWeight: '600',
    flex: 1,
  },
  
  contentText: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 24,
    textAlign: 'justify',
  },
  
  chapterTitle: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.m,
    fontWeight: '600',
  },
  
  subsectionTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginTop: Spacing.m,
    marginBottom: Spacing.s,
  },
  
  listItem: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  
  connectionItem: {
    marginBottom: Spacing.m,
    paddingLeft: Spacing.s,
  },
  
  connectionEpic: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  connectionDetail: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  
  topicTag: {
    backgroundColor: theme.colors.primaryBlue,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginBottom: Spacing.xs,
  },
  
  topicText: {
    ...Typography.caption,
    color: theme.colors.white,
    fontWeight: '500',
  },
  
  bookItem: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 24,
    marginBottom: Spacing.s,
    paddingLeft: Spacing.s,
  },
  
  backButton: {
    marginTop: Spacing.l,
    marginHorizontal: Spacing.m,
  },
  
  // Error/Placeholder styles
  errorCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  
  errorContainer: {
    alignItems: 'center',
    marginTop: Spacing.l,
    marginBottom: Spacing.xl,
  },
  
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.m,
  },
  
  errorTitle: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.m,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  errorMessage: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.l,
  },
  
  previewContainer: {
    backgroundColor: theme.backgrounds.secondary,
    borderRadius: 8,
    padding: Spacing.m,
    marginTop: Spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.primarySaffron,
  },
  
  previewTitle: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
    marginBottom: Spacing.s,
    textAlign: 'center',
  },
  
  placeholderContent: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 24,
    textAlign: 'left',
  },
});

export default DeepDiveScreen;