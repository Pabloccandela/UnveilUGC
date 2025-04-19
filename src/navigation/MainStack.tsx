// navigation/MainStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/Main/Dashboard';
import OfferDetailsScreen from '../screens/Main/OfferDetailsScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import CampaignsScreen from '../screens/Main/CampaignsScreen';
import CampaignDetailsScreen from '../screens/Main/CampaignDetailsScreen';
import { MainStackParamList } from './type';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Campaigns" component={CampaignsScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
    </Stack.Navigator>
  );
}