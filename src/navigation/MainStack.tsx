// navigation/MainStack.tsx
import React from 'react';
import { View } from 'react-native';
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        >
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ animation: 'slide_from_left' }}/>
          <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} options={{ animation: 'fade_from_bottom' }}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_bottom' }}/>
          <Stack.Screen name="Campaigns" component={CampaignsScreen} options={{ animation: 'slide_from_right' }}/>
          <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} options={{ animation: 'fade_from_bottom' }}/>
        </Stack.Navigator>
      </View>
    </View>
  );
}