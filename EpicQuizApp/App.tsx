/**
 * Epic Quiz App - Main Application Entry Point
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.white}
      />
      <AppNavigator />
    </Provider>
  );
};

export default App;