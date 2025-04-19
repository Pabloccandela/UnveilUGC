// navigation/RegisterStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Step1Screen from '../screens/Auth/Register/Step1Screen';
import Step2Screen from '../screens/Auth/Register/Step2Screen';
import Step3Screen from '../screens/Auth/Register/Step3Screen';
import Step4Screen from '../screens/Auth/Register/Step4Screen';
import { RegisterStackParamList } from './type';

const Stack = createNativeStackNavigator<RegisterStackParamList>();

export default function RegisterStack() {
  return (
    <Stack.Navigator
      initialRouteName="Step1"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Step1" component={Step1Screen} options={{ animation: 'slide_from_right' }}/>
      <Stack.Screen name="Step2" component={Step2Screen} options={{ animation: 'slide_from_right' }}/>
      <Stack.Screen name="Step3" component={Step3Screen} options={{ animation: 'slide_from_right' }}/>
      <Stack.Screen name="Step4" component={Step4Screen} options={{ animation: 'slide_from_right' }}/>
    </Stack.Navigator>
  );
}
