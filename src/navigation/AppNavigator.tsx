// navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import RegisterStack from './RegisterStack';
import MainStack from './MainStack';
import { useAuth } from '../../context/UserContext';
import { RootStackParamList } from './type';
import LoadingScreen from '../components/LoadingScreen';
import ErrorBoundaryScreen from '../components/ErrorBoundaryScreen';
import { View } from 'react-native';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, hasCompletedOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
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
        {hasCompletedOnboarding?
          <RootStack.Screen name="Main" component={MainStack} />
          :
          <RootStack.Screen name="Auth" component={AuthStack} />
        }
      </RootStack.Navigator>
    </NavigationContainer>
  );
}