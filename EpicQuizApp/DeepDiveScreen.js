/**
 * Deep Dive Screen - Rich cultural content about the Ramayana
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

const DeepDiveScreen = ({ navigation }) => {
  const [selectedTopic, setSelectedTopic] = useState('overview');

  const topics = {
    overview: {
      title: '🕉️ The Ramayana Overview',
      content: `The Ramayana, composed by the sage Valmiki, is one of the two great Sanskrit epics of ancient India. This timeless tale of Prince Rama's journey teaches us about dharma (righteousness), devotion, courage, and the eternal battle between good and evil.

The epic consists of seven books (kandas) that chronicle Rama's life from birth to his return to Ayodhya as king. At its heart, the Ramayana is not just a story of adventure, but a profound spiritual and moral guide that has shaped Indian culture for millennia.`,
    },
    characters: {
      title: '👑 Major Characters',
      content: `**Rama (राम)** - The seventh avatar of Vishnu, embodying perfect dharma and righteousness. As the ideal man (Purushottama), Rama represents unwavering dedication to duty and truth.

**Sita (सीता)** - Rama's devoted wife, an incarnation of Goddess Lakshmi. She symbolizes purity, devotion, and inner strength. Her name means "furrow," representing fertility and earth.

**Hanuman (हनुमान)** - The devoted monkey deity known for his incredible strength, courage, and unwavering devotion to Rama. He represents the ideal devotee (bhakta).

**Lakshmana (लक्ष्मण)** - Rama's loyal younger brother who accompanies him into exile. He embodies brotherly love and selfless service.

**Ravana (रावण)** - The ten-headed demon king of Lanka, a great scholar who became corrupted by pride and desire. He represents the dangers of unchecked ego and power.`,
    },
    themes: {
      title: '🌟 Core Themes',
      content: `**Dharma (धर्म)** - Righteous duty and moral law. Rama's adherence to dharma, even in difficult circumstances, is the epic's central teaching.

**Bhakti (भक्ति)** - Devotional love, exemplified by Hanuman's devotion to Rama and Sita's devotion to her husband.

**Family Bonds** - The relationships between parents and children, siblings, and spouses demonstrate the importance of family duties and loyalty.

**Good vs. Evil** - The cosmic battle between righteousness (Rama) and evil (Ravana) reflects the eternal struggle within human nature.

**Exile and Return** - The journey from palace to forest and back again represents the soul's spiritual journey and eventual return to divine consciousness.`,
    },
    culture: {
      title: '🎭 Cultural Impact',
      content: `The Ramayana has profoundly influenced Indian and Southeast Asian culture for over 2,000 years:

**Literature & Arts** - Countless retellings in various languages, dance forms like Kathakali and Ramlila, and artistic traditions across India.

**Festivals** - Dussehra celebrates Rama's victory over Ravana, while Diwali marks his return to Ayodhya with lights symbolizing the triumph of good over evil.

**Philosophy** - The concept of dharma and ideal conduct (Rama Rajya - the rule of Rama) continues to influence Indian political and social thought.

**Regional Variations** - Different regions have their own versions: Tulsidas's Ramcharitmanas in Hindi, Kamban's Tamil Ramayana, and many others.

**Global Influence** - The epic has spread throughout Southeast Asia, with versions in Thailand (Ramakien), Indonesia (Kakawin Ramayana), and other cultures.`,
    },
    lessons: {
      title: '📚 Timeless Lessons',
      content: `**Duty Before Desire** - Rama chooses duty over personal happiness, teaching us to prioritize righteousness over comfort.

**The Power of Faith** - Hanuman's unwavering faith gives him supernatural strength, showing how devotion can overcome any obstacle.

**Consequences of Pride** - Ravana's downfall demonstrates how even great knowledge and power can be destroyed by ego and unchecked desires.

**Loyalty in Relationships** - The bonds between Rama-Lakshmana, Rama-Hanuman, and Rama-Sita show the strength that comes from genuine love and loyalty.

**Inner Transformation** - The forest exile represents the spiritual journey we must all undertake to discover our true nature and purpose.

**Justice Prevails** - Though evil may seem powerful temporarily, righteousness ultimately triumphs, giving hope in dark times.`,
    }
  };

  const topicButtons = [
    { key: 'overview', label: '🕉️ Overview', color: '#D4700A' },
    { key: 'characters', label: '👑 Characters', color: '#2E7D32' },
    { key: 'themes', label: '🌟 Themes', color: '#1565C0' },
    { key: 'culture', label: '🎭 Culture', color: '#7B1FA2' },
    { key: 'lessons', label: '📚 Lessons', color: '#E65100' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Topic Selection */}
      <View style={styles.topicContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicScrollContainer}
        >
          {topicButtons.map((topic) => (
            <TouchableOpacity
              key={topic.key}
              style={[
                styles.topicButton,
                { backgroundColor: selectedTopic === topic.key ? topic.color : '#ffffff' },
                { borderColor: topic.color }
              ]}
              onPress={() => setSelectedTopic(topic.key)}
            >
              <Text style={[
                styles.topicButtonText,
                { color: selectedTopic === topic.key ? '#ffffff' : topic.color }
              ]}>
                {topic.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>
            {topics[selectedTopic].title}
          </Text>
          <Text style={styles.contentText}>
            {topics[selectedTopic].content}
          </Text>
        </View>

        {/* Interactive Elements */}
        <View style={styles.interactiveContainer}>
          <Text style={styles.interactiveTitle}>🔍 Explore More</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.actionEmoji}>🎯</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Take Another Quiz</Text>
              <Text style={styles.actionDescription}>Test your expanded knowledge</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.actionEmoji}>📚</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Explore Other Epics</Text>
              <Text style={styles.actionDescription}>Discover the Mahabharata and more</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Cultural Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "धर्मो रक्षति रक्षितः"
          </Text>
          <Text style={styles.quoteTranslation}>
            "Dharma protects those who protect dharma"
          </Text>
          <Text style={styles.quoteSource}>- Ancient Sanskrit Wisdom</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topicContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  topicScrollContainer: {
    paddingHorizontal: 20,
  },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  topicButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 26,
    textAlign: 'left',
  },
  interactiveContainer: {
    marginBottom: 20,
  },
  interactiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  quoteContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#D4700A',
  },
  quoteText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteTranslation: {
    fontSize: 16,
    color: '#333333',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteSource: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default DeepDiveScreen;