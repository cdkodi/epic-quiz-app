/**
 * Epic Quiz App - With Bottom Tab Navigation
 */

import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
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
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingEpicsScreen from './src/screens/OnboardingEpicsScreen';
import RamayanaOverviewScreen from './src/screens/RamayanaOverviewScreen';
import BlockSelectionScreen from './src/screens/BlockSelectionScreen';
import { theme } from './src/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Root Stack Navigator for quiz flow overlays
const RootStack = createNativeStackNavigator();

// Home Stack Navigator for Library and Ramayana Overview
const HomeStack = createNativeStackNavigator();

// Home Stack Component
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
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
    >
      <HomeStack.Screen 
        name="Library" 
        component={EpicLibraryScreen}
        options={{
          title: 'Library',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <HomeStack.Screen 
        name="RamayanaOverview" 
        component={RamayanaOverviewScreen}
        options={{
          title: '📖 Ramayana',
        }}
      />
    </HomeStack.Navigator>
  );
};

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
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ 
              fontSize: 24, 
              color: focused ? theme.colors.primarySaffron : '#8E8E93'
            }}>
              📚
            </Text>
          ),
          tabBarLabel: 'Library',
          headerShown: false, // HomeStack handles headers now
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
      <RootStack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Welcome"
      >
        {/* Welcome Screen - First time user experience */}
        <RootStack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        
        {/* Onboarding Epic Selection */}
        <RootStack.Screen 
          name="OnboardingEpics" 
          component={OnboardingEpicsScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: '📚 Choose Your Epic',
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#333333',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                style={{ marginRight: 16 }}
              >
                <Text style={{ 
                  color: theme.colors.primarySaffron, 
                  fontWeight: '600',
                  fontSize: 16 
                }}>
                  Skip
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        
        {/* Progressive Learning Flow */}
        <RootStack.Screen
          name="BlockSelection"
          component={BlockSelectionScreen}
          options={{
            headerShown: true,
            title: '📚 Choose Your Path',
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