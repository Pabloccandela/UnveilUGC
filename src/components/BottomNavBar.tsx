import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Si tienes instalada la librería:
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Fallback manual si no tienes la librería:
const useSafeAreaInsets = () => ({ bottom: Platform.OS === 'ios' ? 20 : 16 });

import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/type';

const BottomNavBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // Determinar la ruta activa
  const isActive = (routeName: keyof MainStackParamList) => {
    return route.name === routeName;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: '#fff' }]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <View style={[styles.iconContainer, isActive('Dashboard') && styles.activeIconContainer]}>
          <MaterialIcons
            name="home"
            size={24}
            color={isActive('Dashboard') ? '#4CAF50' : '#666'}
          />
        </View>
        <Text style={[styles.navText, isActive('Dashboard') && styles.activeNavText]}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <View style={[styles.iconContainer, isActive('Profile') && styles.activeIconContainer]}>
          <MaterialIcons
            name="person"
            size={24}
            color={isActive('Profile') ? '#4CAF50' : '#666'}
          />
        </View>
        <Text style={[styles.navText, isActive('Profile') && styles.activeNavText]}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Campaigns')}
      >
        <View style={[styles.iconContainer, isActive('Campaigns') && styles.activeIconContainer]}>
          <MaterialIcons
            name="list-alt"
            size={24}
            color={isActive('Campaigns') ? '#4CAF50' : '#666'}
          />
        </View>
        <Text style={[styles.navText, isActive('Campaigns') && styles.activeNavText]}>Campañas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: '#f0f8ff',
  },
  iconText: {
    fontSize: 20,
  },
  activeIconText: {
    color: '#4CAF50',
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default BottomNavBar;
