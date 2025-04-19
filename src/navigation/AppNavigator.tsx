// navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useAuth } from '../../context/UserContext';
import { RootStackParamList } from './type';
import LoadingScreen from '../components/LoadingScreen';
import ErrorBoundaryScreen from '../components/ErrorBoundaryScreen';


const RootStack = createNativeStackNavigator<RootStackParamList>();

import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useEffect } from 'react';
import notificationService from '../services/notificationService';

export default function AppNavigator() {
  const { user, hasCompletedOnboarding, isLoading } = useAuth();

  useEffect(() => {
    notificationService.requestPermissions();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <NavigationContainer
          fallback={<ErrorBoundaryScreen />}
          onStateChange={(state) => {
            // Aquí se puede agregar analítica de navegación
            const currentRoute = state?.routes[state.routes.length - 1];
            if (currentRoute) {
              // Ejemplo: Analytics.logScreen(currentRoute.name);
            }
          }}
        >
          <RootStack.Navigator 
            screenOptions={{ 
              headerShown: false,
            }}
          >
            {user && hasCompletedOnboarding?
              <RootStack.Screen name="Main" component={MainStack} />
              :
              <RootStack.Screen name="Auth" component={AuthStack} />
            }
          </RootStack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}