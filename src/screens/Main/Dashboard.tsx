import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/type';
import { useAuth } from '../../../context/UserContext';
import { MatchingService } from '../../services/matchingService';
import { Offer } from '../../models/Offer';
import { platformStyles } from '../../utils/platformStyles';
import BottomNavBar from '../../components/BottomNavBar';

type DashboardNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Dashboard'>;

// Pantalla principal (Dashboard) para el creador
// Muestra las ofertas disponibles filtradas por matching
const Dashboard: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useAuth();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [appliedOffers, setAppliedOffers] = useState<string[]>([]);
  const [offerStatuses, setOfferStatuses] = useState<{[offerId: string]: string}>({});

  // Cargar las ofertas que hacen match con el usuario
  const loadOffers = () => {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (user) {
        const matchingOffers = MatchingService.getMatchingOffersForUser(user);
        setOffers(matchingOffers);
        
        // Obtener las ofertas a las que el usuario ya ha aplicado
        const userAppliedOffers = MatchingService.getAppliedOffersByUser(user.id);
        setAppliedOffers(userAppliedOffers);
        
        // Obtener el estado de cada oferta
        const statuses: {[offerId: string]: string} = {};
        matchingOffers.forEach(offer => {
          const status = MatchingService.getUserApplicationStatus(offer.id, user.id);
          if (status.applied && status.status) {
            statuses[offer.id] = status.status;
          }
        });
        setOfferStatuses(statuses);
      }
      setLoading(false);
    }, 1000);
  };

  // Refrescar la lista al hacer pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadOffers();
    setRefreshing(false);
  };

  // Cargar ofertas al montar el componente
  useEffect(() => {
    loadOffers();
  }, [user]);

  // Navegar a la pantalla de detalles de la oferta
  const handleViewOffer = (offerId: string) => {
    navigation.navigate('OfferDetails', { offerId });
  };

  // Navegar al perfil del usuario
  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  // Render each offer item
  const renderOfferItem = ({ item }: { item: Offer }) => (
    <TouchableOpacity 
      style={styles.offerCard} 
      onPress={() => handleViewOffer(item.id)}
    >
      <View style={styles.offerHeader}>
        <Text style={styles.businessName}>{item.businessName}</Text>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.incentiveContainer}>
        <Text style={styles.incentiveLabel}>Incentivo:</Text>
        <Text style={styles.incentiveText}>{item.incentive.description}</Text>
      </View>
      
      <View style={styles.offerFooter}>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => handleViewOffer(item.id)}
        >
          <Text style={styles.viewDetailsText}>Ver Detalles</Text>
        </TouchableOpacity>
        {appliedOffers.includes(item.id) && (
          <View style={offerStatuses[item.id] === 'rejected' ? styles.rejectedBadge : styles.appliedBadge}>
            <Text style={offerStatuses[item.id] === 'rejected' ? styles.rejectedText : styles.appliedText}>
              {offerStatuses[item.id] === 'rejected' ? 'Rechazada' : 'Aplicada'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No hay ofertas disponibles</Text>
      <Text style={styles.emptyStateText}>
        No hemos encontrado ofertas que coincidan con tus intereses.
        Intenta añadir más intereses a tu perfil.
      </Text>
      <TouchableOpacity 
        style={styles.viewProfileButton}
        onPress={handleViewProfile}
      >
        <Text style={styles.viewProfileText}>Ver mi Perfil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola, {user?.fullName.split(' ')[0]}</Text>
          <Text style={styles.dashboardTitle}>Ofertas para ti</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={handleViewProfile}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.fullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Buscando ofertas para ti...</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.offersList}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#4CAF50']}
            />
          }
        />
      )}
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    ...platformStyles.header,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  offersList: {
    padding: 16,
    paddingBottom: 80,
  },
  offerCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    ...platformStyles.card,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  incentiveContainer: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  incentiveLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  incentiveText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  offerFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...platformStyles.button,
  },
  viewDetailsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  appliedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  appliedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectedBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  rejectedText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  viewProfileButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    ...platformStyles.button,
  },
  viewProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Dashboard;
