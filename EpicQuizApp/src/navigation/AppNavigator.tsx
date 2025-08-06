/**
 * Epic Quiz App - Main Navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../constants';

// Screen imports (we'll create these next)
import EpicLibraryScreen from '../screens/EpicLibraryScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import ExplanationScreen from '../screens/ExplanationScreen';
import DeepDiveScreen from '../screens/DeepDiveScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EpicLibrary"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.white,
          },
          headerTintColor: theme.colors.charcoal,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.backgrounds.primary,
          },
        }}
      >
        <Stack.Screen
          name="EpicLibrary"
          component={EpicLibraryScreen}
          options={{
            title: '📚 Epic Library',
            headerLargeTitle: true,
          }}
        />
        
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={({ route }) => ({
            title: route.params.epic.title,
            headerBackTitleVisible: false,
          })}
        />
        
        <Stack.Screen
          name="QuizResults"
          component={QuizResultsScreen}
          options={{
            title: '🎉 Quiz Complete!',
            headerBackTitleVisible: false,
            gestureEnabled: false, // Prevent swipe back on results
          }}
        />
        
        <Stack.Screen
          name="Explanation"
          component={ExplanationScreen}
          options={{
            title: 'Question Review',
            headerBackTitleVisible: false,
          }}
        />
        
        <Stack.Screen
          name="DeepDive"
          component={DeepDiveScreen}
          options={{
            title: 'Deep Dive Content',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;