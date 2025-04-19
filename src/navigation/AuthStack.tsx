// navigation/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterStack from '../navigation/RegisterStack';
import { AuthStackParamList } from './type';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        animation: 'slide_from_left',
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_left' }}/>
      <Stack.Screen name="Register" component={RegisterStack} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}