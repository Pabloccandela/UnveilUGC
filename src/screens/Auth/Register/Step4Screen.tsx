import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegisterStackParamList } from '../../../navigation/type';
import { useAuth } from '../../../../context/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Step4NavigationProp = NativeStackNavigationProp<RegisterStackParamList, 'Step4'>;

interface SocialMedia {
  platform: string;
  username: string;
}

interface Step2Data {
  socialMedia: SocialMedia[];
  stats: {
    campaigns: number;
    reviews: string;
    level: string;
  };
}

const Step4Screen = () => {
  const navigation = useNavigation<Step4NavigationProp>();
  const { onboardingData, completeOnboarding } = useAuth();

  const handleFinishOnboarding = () => {
    completeOnboarding(); ;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 25,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      marginRight: 15,
    },
    profileInfo: {
      flex: 1,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    location: {
      fontSize: 16,
      color: '#666',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    socialGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -5,
    },
    socialItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 8,
      marginHorizontal: 5,
      marginBottom: 10,
    },
    socialUsername: {
      marginLeft: 8,
      fontSize: 14,
      color: '#333',
    },
    interestsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -5,
    },
    interestTag: {
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginHorizontal: 5,
      marginBottom: 10,
    },
    interestText: {
      color: '#4CAF50',
      fontSize: 14,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 14,
      color: '#666',
    },
    emptyState: {
      alignItems: 'center',
      padding: 20,
    },
    emptyStateText: {
      textAlign: 'center',
      color: '#666',
      marginTop: 10,
      fontSize: 14,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 50,
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
    },
    backButtonText: {
      color: '#666',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vista Previa de tu Perfil</Text>
        <Text style={styles.subtitle}>Paso 4: Resumen</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Información básica */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account-circle" size={80} color="#4CAF50" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{onboardingData?.step1?.fullName || 'Sin nombre'}</Text>
              <Text style={styles.location}>
                {onboardingData?.step1?.city ? `${onboardingData.step1.city}, ${onboardingData.step1.country}` : 'Ubicación no especificada'}
              </Text>
            </View>
          </View>
        </View>

        {/* Redes Sociales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redes Sociales</Text>
          <View style={styles.socialGrid}>
            {(onboardingData?.step2?.socialMedia as SocialMedia[] || []).map((social, index) => 
              social.username ? (
                <View key={index} style={styles.socialItem}>
                  <MaterialCommunityIcons 
                    name={social.platform.toLowerCase() === 'instagram' ? 'instagram' : 
                          social.platform.toLowerCase() === 'tiktok' ? 'music-note' : 
                          social.platform.toLowerCase() === 'youtube' ? 'youtube' : 'link'} 
                    size={24} 
                    color="#666" 
                  />
                  <Text style={styles.socialUsername}>{social.username}</Text>
                </View>
              ) : null
            )}
          </View>
        </View>

        {/* Intereses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intereses</Text>
          <View style={styles.interestsGrid}>
            {onboardingData?.step3?.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Clave</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Campañas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>N/A</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Principiante</Text>
              <Text style={styles.statLabel}>Nivel</Text>
            </View>
          </View>
        </View>

        {/* Campañas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campañas Realizadas</Text>
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="rocket-launch" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>
              ¡Completa tu primera campaña para empezar a construir tu currículum!
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleFinishOnboarding}
        >
          <Text style={styles.buttonText}>Ir al Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Step4Screen;
