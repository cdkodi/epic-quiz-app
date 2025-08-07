/**
 * Epic Quiz App - With Epic Library Screen
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EpicLibraryScreen from './EpicLibraryScreen';
import QuizScreen from './QuizScreen';
import QuizResultsScreen from './QuizResultsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EpicLibrary"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Stack.Screen
          name="EpicLibrary"
          component={EpicLibraryScreen}
          options={{
            title: '📚 Epic Library',
          }}
        />
        
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{
            title: '🕉️ THE RAMAYANA',
            headerBackTitleVisible: false,
          }}
        />
        
        <Stack.Screen
          name="QuizResults"
          component={QuizResultsScreen}
          options={{
            title: '🎉 Quiz Complete!',
            headerBackTitleVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;