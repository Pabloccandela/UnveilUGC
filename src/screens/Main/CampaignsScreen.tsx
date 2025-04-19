import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/type';
import { useAuth } from '../../../context/UserContext';
import { MOCK_OFFERS } from '../../services/mockData';
import { Campaign, Offer } from '../../models/Offer';
import { MatchingService } from '../../services/matchingService';
import { platformStyles } from '../../utils/platformStyles';
import BottomNavBar from '../../components/BottomNavBar';

type CampaignsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Campaigns'>;

const CampaignsScreen: React.FC = () => {
  const navigation = useNavigation<CampaignsScreenNavigationProp>();
  const { user } = useAuth();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Cargar campañas del usuario
  const loadCampaigns = () => {
    setLoading(true);
    
    // Simular retraso de red
    setTimeout(() => {
      if (user) {
        // Obtener campañas del usuario usando el servicio de matching
        const userCampaigns = MatchingService.getUserCampaigns(user.id);
        setCampaigns(userCampaigns);
        // Cargar todas las ofertas para poder obtener los nombres de los negocios
        setOffers(MOCK_OFFERS);
      }
      setLoading(false);
    }, 1000);
  };

  // Manejar pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadCampaigns();
    setRefreshing(false);
  };

  // Cargar campañas cuando el componente se monta
  useEffect(() => {
    loadCampaigns();
  }, [user]);

  // Obtener el color según el estado de la campaña
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50'; // Verde
      case 'completed':
        return '#2196F3'; // Azul
      case 'pending':
        return '#FFC107'; // Amarillo
      case 'rejected':
        return '#F44336'; // Rojo
      case 'canceled':
        return '#9E9E9E'; // Gris
      default:
        return '#9E9E9E';
    }
  };

  // Traducir el estado de la campaña
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazada';
      case 'canceled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Obtener el nombre del negocio a partir del businessId
  const getBusinessById = (businessId: string): Offer | undefined => {
    return offers.find(offer => offer.businessId === businessId);
  };
  
  // Renderizar cada elemento de campaña
  const renderCampaignItem = ({ item }: { item: Campaign }) => (
    <TouchableOpacity 
      style={styles.campaignCard}
      onPress={() => navigation.navigate('CampaignDetails', { campaignId: item.id })}
    >
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignBusiness}>{getBusinessById(item.businessId)?.businessName}</Text>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.campaignDetails}>
        <Text style={styles.detailValue}>{getBusinessById(item.businessId)?.title}</Text>
      </View>
      
      <View style={styles.campaignDetails}>
        <Text style={styles.detailLabel}>Fecha de creación:</Text>
        <Text style={styles.detailValue}>{item.createdAt ? item.createdAt.toLocaleDateString() : 'N/A'}</Text>
      </View>
      
      <View style={styles.campaignDetails}>
        <Text style={styles.detailLabel}>Fecha de expiración:</Text>
        <Text style={styles.detailValue}>{item.expiresAt ? item.expiresAt.toLocaleDateString() : 'N/A'}</Text>
      </View>
      
      <View style={styles.campaignFooter}>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => navigation.navigate('CampaignDetails', { campaignId: item.id })}
        >
          <Text style={styles.viewDetailsText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Renderizar estado vacío
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No tienes campañas activas</Text>
      <Text style={styles.emptyStateText}>
        Aún no has aplicado a ninguna campaña.
        Explora las ofertas disponibles y aplica a las que te interesen.
      </Text>
      <TouchableOpacity 
        style={styles.viewOffersButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.viewOffersText}>Ver Ofertas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Mis Campañas</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando tus campañas...</Text>
        </View>
      ) : (
        <FlatList
          data={campaigns}
          renderItem={renderCampaignItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.campaignsList}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    ...platformStyles.header,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  campaignsList: {
    padding: 16,
    paddingBottom: 80, // Espacio para la barra de navegación
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  campaignBusiness: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  campaignDetails: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: '40%',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    width: '100%',
  },
  campaignFooter: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  viewDetailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
  },
  viewDetailsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  viewOffersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  viewOffersText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CampaignsScreen;
