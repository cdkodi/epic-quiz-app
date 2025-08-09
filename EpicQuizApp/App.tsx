/**
 * Epic Quiz App - With Epic Library Screen
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EpicLibraryScreen from './src/screens/EpicLibraryScreen';
import QuizScreen from './src/screens/QuizScreen';
import QuizResultsScreen from './src/screens/QuizResultsScreen';
import ExplanationScreen from './src/screens/ExplanationScreen';
import DeepDiveScreen from './src/screens/DeepDiveScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
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
          }}
        />
        
        <Stack.Screen
          name="QuizResults"
          component={QuizResultsScreen}
          options={{
            title: '🎉 Quiz Complete!',
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen
          name="Explanation"
          component={ExplanationScreen}
          options={{
            title: '📖 Answer Review',
          }}
        />
        
        <Stack.Screen
          name="DeepDive"
          component={DeepDiveScreen}
          options={{
            title: '🔍 Deep Dive',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;