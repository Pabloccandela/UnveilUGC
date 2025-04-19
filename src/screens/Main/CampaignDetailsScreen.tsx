import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/type';
import { useAuth } from '../../../context/UserContext';
import { MOCK_OFFERS } from '../../services/mockData';
import { Campaign, Offer } from '../../models/Offer';
import { MatchingService } from '../../services/matchingService';
import { platformStyles } from '../../utils/platformStyles';
import BottomNavBar from '../../components/BottomNavBar';

type CampaignDetailsRouteProp = RouteProp<MainStackParamList, 'CampaignDetails'>;
type CampaignDetailsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CampaignDetails'>;

const CampaignDetailsScreen: React.FC = () => {
  const navigation = useNavigation<CampaignDetailsNavigationProp>();
  const route = useRoute<CampaignDetailsRouteProp>();
  const { campaignId } = route.params;
  const { user } = useAuth();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Obtener el nombre del negocio a partir del businessId
  const getBusinessName = (businessId: string): string => {
    const matchingOffer = MOCK_OFFERS.find(offer => offer.businessId === businessId);
    return matchingOffer ? matchingOffer.businessName : 'Negocio desconocido';
  };

  // Cargar detalles de la campaña
  useEffect(() => {
    const loadCampaignDetails = () => {
      setLoading(true);
      
      // Simular retraso de red
      setTimeout(() => {
        if (user) {
          // Buscar la campaña por ID usando el servicio de matching
          const foundCampaign = MatchingService.getCampaignById(campaignId);
          
          if (foundCampaign) {
            setCampaign(foundCampaign);
            
            // Buscar la oferta asociada a esta campaña
            // En un caso real, podríamos tener un campo offerId en la campaña
            // Por ahora, asumimos que el businessId puede ayudarnos a encontrar una oferta relacionada
            const relatedOffer = MOCK_OFFERS.find(o => o.businessId === foundCampaign.businessId);
            if (relatedOffer) {
              setOffer(relatedOffer);
            }
          }
        }
        setLoading(false);
      }, 1000);
    };
    
    loadCampaignDetails();
  }, [campaignId, user]);

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

  // Manejar la cancelación de la campaña
  const handleCancelCampaign = () => {
    Alert.alert(
      "Cancelar Campaña",
      "¿Estás seguro de que deseas cancelar esta campaña?",
      [
        {
          text: "No",
          style: "cancel"
        },
        { 
          text: "Sí, cancelar", 
          onPress: () => {
            // Aquí se implementaría la lógica real para cancelar la campaña
            Alert.alert(
              "Campaña Cancelada",
              "La campaña ha sido cancelada exitosamente.",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          },
          style: "destructive"
        }
      ]
    );
  };

  // Manejar la entrega de contenido
  const handleSubmitContent = () => {
    // Aquí se implementaría la navegación a una pantalla de entrega de contenido
    Alert.alert(
      "Entregar Contenido",
      "Aquí podrás subir el contenido para esta campaña.",
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Campaña</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
        <BottomNavBar />
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de Campaña</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró la campaña solicitada.</Text>
          <TouchableOpacity 
            style={styles.returnButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.returnButtonText}>Volver a Mis Campañas</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de Campaña</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.campaignHeader}>
          <Text style={styles.campaignId}>#{campaign.id}</Text>
          <View style={[styles.statusTag, { backgroundColor: getStatusColor(campaign.status) }]}>
            <Text style={styles.statusText}>{getStatusText(campaign.status)}</Text>
          </View>
        </View>

        {/* Sección de información básica */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Negocio:</Text>
            <Text style={styles.detailValue}>
              {getBusinessName(campaign.businessId)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de creación:</Text>
            <Text style={styles.detailValue}>
              {campaign.createdAt ? campaign.createdAt.toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de expiración:</Text>
            <Text style={styles.detailValue}>
              {campaign.expiresAt ? campaign.expiresAt.toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Detalles de la oferta asociada */}
        {offer && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Detalles de la Oferta</Text>
            <View style={styles.offerCard}>
              <Text style={styles.offerBusinessName}>{offer.businessName}</Text>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
              
              <View style={styles.offerDetails}>
                <Text style={styles.detailLabel}>Categoría:</Text>
                <Text style={styles.detailValue}>{offer.category}</Text>
              </View>
              
              <View style={styles.offerDetails}>
                <Text style={styles.detailLabel}>Nivel requerido:</Text>
                <Text style={styles.detailValue}>{offer.requiredLevel}</Text>
              </View>
              
              <View style={styles.offerDetails}>
                <Text style={styles.detailLabel}>Incentivo:</Text>
                <Text style={styles.detailValue}>{offer.incentive.description}</Text>
              </View>

              {offer.deadline && (
                <View style={styles.offerDetails}>
                  <Text style={styles.detailLabel}>Fecha límite:</Text>
                  <Text style={styles.detailValue}>{offer.deadline.toLocaleDateString()}</Text>
                </View>
              )}

              {offer.platformsRequired && offer.platformsRequired.length > 0 && (
                <View style={styles.offerDetails}>
                  <Text style={styles.detailLabel}>Plataformas:</Text>
                  <Text style={styles.detailValue}>{offer.platformsRequired.join(', ')}</Text>
                </View>
              )}

              {offer.contentType && offer.contentType.length > 0 && (
                <View style={styles.offerDetails}>
                  <Text style={styles.detailLabel}>Tipo de contenido:</Text>
                  <Text style={styles.detailValue}>{offer.contentType.join(', ')}</Text>
                </View>
              )}
              
              {offer.customTags && offer.customTags.length > 0 && (
                <View style={styles.offerDetails}>
                  <Text style={styles.detailLabel}>Etiquetas:</Text>
                  <View style={styles.tagsContainer}>
                    {offer.customTags.map((tag, index) => (
                      <View key={index} style={styles.tagItem}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sección de acciones */}
        <View style={styles.actionsContainer}>
          {campaign.status === 'active' && (
            <>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitContent}
              >
                <Text style={styles.submitButtonText}>Entregar Contenido</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelCampaign}
              >
                <Text style={styles.cancelButtonText}>Cancelar Campaña</Text>
              </TouchableOpacity>
            </>
          )}
          
          {campaign.status === 'completed' && (
            <View style={styles.completedMessage}>
              <Text style={styles.completedText}>
                ¡Campaña completada con éxito! Gracias por tu participación.
              </Text>
            </View>
          )}
          
          {campaign.status === 'pending' && (
            <View style={styles.pendingMessage}>
              <Text style={styles.pendingText}>
                Tu solicitud está siendo revisada. Te notificaremos cuando haya una actualización.
              </Text>
            </View>
          )}
          
          {campaign.status === 'rejected' && (
            <View style={styles.rejectedMessage}>
              <Text style={styles.rejectedText}>
                Lo sentimos, tu solicitud no fue aprobada para esta campaña.
              </Text>
            </View>
          )}
          
          {campaign.status === 'canceled' && (
            <View style={styles.canceledMessage}>
              <Text style={styles.canceledText}>
                Esta campaña ha sido cancelada.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    ...platformStyles.header,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Espacio para la barra de navegación
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  campaignId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionContainer: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
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
    width: '60%',
  },
  offerCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  offerBusinessName: {
    fontSize: 14,
    color: '#666',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  offerDetails: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedMessage: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  completedText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  pendingMessage: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  pendingText: {
    color: '#F57F17',
    fontSize: 14,
  },
  rejectedMessage: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  rejectedText: {
    color: '#C62828',
    fontSize: 14,
  },
  canceledMessage: {
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9E9E9E',
  },
  canceledText: {
    color: '#546E7A',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e1f0ff',
  },
  tagText: {
    color: '#4CAF50',
    fontSize: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CampaignDetailsScreen;
