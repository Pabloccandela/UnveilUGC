import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/type';
import { useAuth } from '../../../context/UserContext';
import SocialProfileRow from '../../components/SocialProfileRow';
import ReviewCard from '../../components/ReviewCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';

type ProfileNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Safe reviews array and average stars
  const reviewsArr = Array.isArray(user.stats.reviews) ? user.stats.reviews : [];
  const avgStars =
    reviewsArr.length > 0
      ? reviewsArr.reduce((acc, r) => acc + (r.stars || 0), 0) / reviewsArr.length
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.fullName}</Text>
            <Text style={styles.profileLocation}>{user.city}, {user.country}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{user.stats.level}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Intereses</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest) => (
              <View key={interest} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {user.socialMedia.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Redes Sociales</Text>
            <View style={{marginTop: 4}}>
              {user.socialMedia.map((item, index) => (
                <SocialProfileRow key={index} platform={item.platform} username={item.username} />
              ))}
            </View>
          </View>
        )}
        <View style={styles.sectionContainer}>
  <Text style={styles.sectionTitle}>Estadísticas Clave</Text>
  <View style={styles.statsContainer}>
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{user.stats.campaigns}</Text>
      <Text style={styles.statLabel}>Campañas</Text>
    </View>
    <View style={styles.statItem}>
      <View style={styles.starsRow}>
  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333', marginRight: 4 }}>
    {avgStars.toFixed(1)}
  </Text>
  <MaterialCommunityIcons
    name="star"
    size={20}
    color="#FFC107"
    style={{ marginLeft: 1 }}
  />
</View>
<Text style={styles.statLabel}>Valoración</Text>
    </View>
    <View style={styles.statItem}>
      <Text style={styles.statValue}>
        {user.stats.level === 'Principiante' ? '1' : 
         user.stats.level === 'Intermedio' ? '2' : '3'}
      </Text>
      <Text style={styles.statLabel}>Nivel</Text>
    </View>
  </View>
</View>

{/* Reseñas tipo tarjeta */}
{Array.isArray(user.stats.reviews) && user.stats.reviews.length > 0 && (
  <View style={{marginTop: 8}}>
    <Text style={[styles.sectionTitle, {marginBottom: 8}]}>Reseñas</Text>
    {user.stats.reviews.map((review, idx) => {
      // Buscar nombre de empresa según businessId
      let businessName = '';
      try {
        const businesses = require('../../services/mockData').MOCK_BUSINESSES;
        const match = businesses.find((b: any) => b.id_usuario === review.businessId);
        businessName = match ? match.nombreEmpresa : 'Empresa';
      } catch {
        businessName = 'Empresa';
      }
      return (
        <ReviewCard
          key={idx}
          name={businessName}
          stars={review.stars || 0}
          text={review.textReview}
        />
      );
    })}
  </View>
)}

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 0,
    marginVertical: 12,
    alignItems: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
  },
  reviewQuote: {
    fontSize: 36,
    color: '#BDBDBD',
    marginRight: 8,
    fontWeight: 'bold',
    lineHeight: 36,
    marginTop: -10,
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    flex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#666',
    fontSize: 14,
  },
  socialMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialMediaPlatform: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  socialMediaUsername: {
    fontSize: 14,
    color: '#666',
  },
  emptyCampaigns: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyCampaignsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
