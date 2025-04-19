import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/type';

type BottomNavBarProps = {
  // Puedes añadir props adicionales si es necesario
};

const BottomNavBar: React.FC<BottomNavBarProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute();

  // Determinar la ruta activa
  const isActive = (routeName: keyof MainStackParamList) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <View style={[styles.iconContainer, isActive('Dashboard') && styles.activeIconContainer]}>
          {/* Aquí podrías añadir un icono */}
          <Text style={[styles.iconText, isActive('Dashboard') && styles.activeIconText]}>🏠</Text>
        </View>
        <Text style={[styles.navText, isActive('Dashboard') && styles.activeNavText]}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <View style={[styles.iconContainer, isActive('Profile') && styles.activeIconContainer]}>
          {/* Aquí podrías añadir un icono */}
          <Text style={[styles.iconText, isActive('Profile') && styles.activeIconText]}>👤</Text>
        </View>
        <Text style={[styles.navText, isActive('Profile') && styles.activeNavText]}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Campaigns')}
      >
        <View style={[styles.iconContainer, isActive('Campaigns') && styles.activeIconContainer]}>
          {/* Aquí podrías añadir un icono */}
          <Text style={[styles.iconText, isActive('Campaigns') && styles.activeIconText]}>📋</Text>
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
