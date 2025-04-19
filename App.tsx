import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main App component that serves as the entry point for the Unveil UGC platform
 * Implements the necessary providers and navigation structure
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <AppNavigator />
          </SafeAreaView>
          <StatusBar style="auto" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

