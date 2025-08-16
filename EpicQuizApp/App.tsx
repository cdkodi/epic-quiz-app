/**
 * Epic Quiz App - With Bottom Tab Navigation
 */

import * as React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EpicLibraryScreen from './src/screens/EpicLibraryScreen';
import QuizzesScreen from './src/screens/QuizzesScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuizScreen from './src/screens/QuizScreen';
import QuizResultsScreen from './src/screens/QuizResultsScreen';
import ExplanationScreen from './src/screens/ExplanationScreen';
import DeepDiveScreen from './src/screens/DeepDiveScreen';
import { theme } from './src/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Root Stack Navigator for quiz flow overlays
const RootStack = createNativeStackNavigator();

// Tab Navigator Component
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primarySaffron,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tab.Screen
        name="Library"
        component={EpicLibraryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: 24, 
              color: focused ? theme.colors.primarySaffron : '#8E8E93'
            }}>
              📚
            </Text>
          ),
          headerShown: true,
          headerTitle: '📚 Epic Library',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      />
      
      <Tab.Screen
        name="Quizzes"
        component={QuizzesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: 24, 
              color: focused ? theme.colors.primarySaffron : '#8E8E93'
            }}>
              📝
            </Text>
          ),
          headerShown: true,
          headerTitle: '🎯 Quizzes',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      />
      
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: 24, 
              color: focused ? theme.colors.primarySaffron : '#8E8E93'
            }}>
              📊
            </Text>
          ),
          headerShown: true,
          headerTitle: '📊 Progress',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: 24, 
              color: focused ? theme.colors.primarySaffron : '#8E8E93'
            }}>
              👤
            </Text>
          ),
          headerShown: true,
          headerTitle: '👤 Profile',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        
        {/* Quiz Flow Screens - presented modally */}
        <RootStack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{
            headerShown: true,
            title: '🕉️ THE RAMAYANA',
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#333333',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
            presentation: 'card',
          }}
        />
        
        <RootStack.Screen
          name="QuizResults"
          component={QuizResultsScreen}
          options={{
            headerShown: true,
            title: '🎉 Quiz Complete!',
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#333333',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        />
        
        <RootStack.Screen
          name="Explanation"
          component={ExplanationScreen}
          options={{
            headerShown: true,
            title: '📖 Answer Review',
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#333333',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        />
        
        <RootStack.Screen
          name="DeepDive"
          component={DeepDiveScreen}
          options={{
            headerShown: true,
            title: '🔍 Deep Dive',
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#333333',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;