import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/type';
import { useAuth } from '../../../context/UserContext';
import { MatchingService } from '../../services/matchingService';
import { Offer } from '../../models/Offer';
import { platformStyles } from '../../utils/platformStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

type OfferDetailsRouteProp = RouteProp<MainStackParamList, 'OfferDetails'>;
type OfferDetailsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'OfferDetails'>;

// Pantalla de detalles de una oferta
// Permite ver información y proponer fechas para la campaña
const OfferDetailsScreen: React.FC = () => {
  const navigation = useNavigation<OfferDetailsNavigationProp>();
  const route = useRoute<OfferDetailsRouteProp>();
  const { user } = useAuth();
  const { offerId } = route.params;
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [proposedDates, setProposedDates] = useState<Date[]>([new Date()]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [applicationStatus, setApplicationStatus] = useState<string>('');
  const [responseModal, setResponseModal] = useState<{
    visible: boolean;
    accepted: boolean;
    message: string;
  }>({ visible: false, accepted: false, message: '' });

  // Cargar los detalles de la oferta seleccionada
  useEffect(() => {
    const loadOffer = () => {
      setLoading(true);
      const offerData = MatchingService.getOfferById(offerId);
      
      if (offerData) {
        setOffer(offerData);
        
        // Verificar si el usuario ya ha aplicado a esta oferta
        if (user) {
          const status = MatchingService.getUserApplicationStatus(offerId, user.id);
          setHasApplied(status.applied);
          setApplicationStatus(status.status || '');
        }
      } else {
        Alert.alert('Error', 'No se pudo encontrar la oferta solicitada.');
        navigation.goBack();
      }
      
      setLoading(false);
    };
    
    loadOffer();
  }, [offerId, navigation, user]);

  // Manejar el cambio de fecha propuesta por el creador
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      const updatedDates = [...proposedDates];
      updatedDates[currentDateIndex] = selectedDate;
      setProposedDates(updatedDates);
    }
  };

  // Add a new date y abrir el calendario directamente
  const addDate = () => {
    if (proposedDates.length < 2) {
      const newDate = new Date();
      setCurrentDateIndex(proposedDates.length);
      setProposedDates(prev => [...prev, newDate]);
      setShowDatePicker(true);
    }
  };

  // Remove a date (asegura que siempre haya al menos una fecha válida)
  const removeDate = (index: number) => {
    if (proposedDates.length > 1) {
      const updatedDates = proposedDates.filter((_, i) => i !== index);
      setProposedDates(updatedDates);
      // Si estamos eliminando la fecha actual seleccionada, actualizamos el índice
      if (currentDateIndex >= updatedDates.length) {
        setCurrentDateIndex(updatedDates.length - 1);
      }
    } else {
      // Si solo queda una fecha, la mantenemos como está
      // No hacemos nada para evitar el error de value undefined
      return;
    }
  };

  // Show date picker for a specific date
  const showDatePickerForIndex = (index: number) => {
    setCurrentDateIndex(index);
    setShowDatePicker(true);
  };

  // Submit proposal
  const submitProposal = async () => {
    if (!user || !offer) return;
    
    setSubmitting(true);
    
    try {
      // Simulate business response
      const response = await MatchingService.simulateBusinessResponse(
        offer.id,
        user.id,
        proposedDates
      );
      
      // Show response modal
      setResponseModal({
        visible: true,
        accepted: response.accepted,
        message: response.message,
      });
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar tu propuesta. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Close response modal and navigate back
  const handleCloseResponseModal = () => {
    setResponseModal({ ...responseModal, visible: false });
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando detalles de la oferta...</Text>
      </View>
    );
  }

  if (!offer) return null;

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
          <Text style={styles.headerTitle}>Detalles de la Oferta</Text>
        </View>

        <View style={styles.businessHeader}>
          <Text style={styles.businessName}>{offer.businessName}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{offer.category}</Text>
          </View>
        </View>

        <Text style={styles.offerTitle}>{offer.title}</Text>
        
        {offer.customTags && offer.customTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {offer.customTags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{offer.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Oferta</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Nivel requerido: <Text style={styles.detailValue}>{offer.requiredLevel}</Text></Text>
            {(offer.country || offer.city || offer.isRemote) && (
              <Text style={styles.detailLabel}>Ubicación: <Text style={styles.detailValue}>{offer.isRemote ? 'Remoto' : `${offer.city ? offer.city + ', ' : ''}${offer.country || ''}`}</Text></Text>
            )}
            {offer.deadline && (
              <Text style={styles.detailLabel}>Fecha límite: <Text style={styles.detailValue}>{new Date(offer.deadline).toLocaleDateString('es-ES')}</Text></Text>
            )}
            {offer.platformsRequired && offer.platformsRequired.length > 0 && (
              <Text style={styles.detailLabel}>Plataformas requeridas: <Text style={styles.detailValue}>{offer.platformsRequired.join(', ')}</Text></Text>
            )}
            {offer.contentType && offer.contentType.length > 0 && (
              <Text style={styles.detailLabel}>Tipo de contenido: <Text style={styles.detailValue}>{offer.contentType.join(', ')}</Text></Text>
            )}
            {typeof offer.exclusive === 'boolean' && (
              <Text style={styles.detailLabel}>Exclusiva: <Text style={styles.detailValue}>{offer.exclusive ? 'Sí' : 'No'}</Text></Text>
            )}
            {typeof offer.ndaRequired === 'boolean' && (
              <Text style={styles.detailLabel}>NDA requerido: <Text style={styles.detailValue}>{offer.ndaRequired ? 'Sí' : 'No'}</Text></Text>
            )}
            {typeof offer.availableSlots === 'number' && (
              <Text style={styles.detailLabel}>Cupos disponibles: <Text style={styles.detailValue}>{offer.availableSlots}</Text></Text>
            )}
            {offer.isUrgent && (
              <Text style={styles.detailLabel}>¡Oferta urgente!</Text>
            )}
            {typeof offer.mustAttendEvent === 'boolean' && (
              <Text style={styles.detailLabel}>¿Requiere asistencia presencial?: <Text style={styles.detailValue}>{offer.mustAttendEvent ? 'Sí' : 'No'}</Text></Text>
            )}
            {offer.ageRange && (
              <Text style={styles.detailLabel}>Edad requerida: <Text style={styles.detailValue}>{offer.ageRange[0]} - {offer.ageRange[1]}</Text></Text>
            )}
            {offer.genderRequired && offer.genderRequired !== 'any' && (
              <Text style={styles.detailLabel}>Género requerido: <Text style={styles.detailValue}>{offer.genderRequired === 'male' ? 'Masculino' : 'Femenino'}</Text></Text>
            )}
            {offer.languagesRequired && offer.languagesRequired.length > 0 && (
              <Text style={styles.detailLabel}>Idiomas requeridos: <Text style={styles.detailValue}>{offer.languagesRequired.join(', ')}</Text></Text>
            )}
            {offer.expiresAt && (
              <Text style={styles.detailLabel}>Expira: <Text style={styles.detailValue}>{new Date(offer.expiresAt).toLocaleDateString('es-ES')}</Text></Text>
            )}
            {typeof offer.minFollowers === 'number' && (
              <Text style={styles.detailLabel}>Mínimo de seguidores: <Text style={styles.detailValue}>{offer.minFollowers}</Text></Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incentivo</Text>
          <View style={styles.incentiveContainer}>
            <Text style={styles.incentiveType}>{offer.incentive.type}</Text>
            <Text style={styles.incentiveDescription}>{offer.incentive.description}</Text>
            {offer.incentive.value && (
              <Text style={styles.incentiveValue}>Valor estimado: {offer.incentive.value}€</Text>
            )}
          </View>
        </View>

        {!hasApplied ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Proponer Fechas</Text>
              <Text style={styles.sectionDescription}>
                Selecciona hasta 2 fechas posibles para realizar esta campaña. El negocio elegirá una de ellas o te propondrá alternativas.
              </Text>

              {proposedDates.map((date, index) => (
                <View key={index} style={styles.dateContainer}>
                  <TouchableOpacity 
                    style={styles.dateSelector}
                    onPress={() => showDatePickerForIndex(index)}
                  >
                    <Text style={styles.dateText}>
                      {date.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </TouchableOpacity>
                  
                  {proposedDates.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeDateButton}
                      onPress={() => removeDate(index)}
                    >
                      <Text style={styles.removeDateText}>Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {proposedDates.length < 2 && (
                <TouchableOpacity 
                  style={styles.addDateButton}
                  onPress={addDate}
                >
                  <Text style={styles.addDateText}>+ Añadir otra fecha</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={submitProposal}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Propuesta</Text>
              )}
            </TouchableOpacity>
          </>
        ) : applicationStatus === 'rejected' ? (
          <View style={styles.section}>
            <View style={styles.rejectedContainer}>
              <View style={styles.rejectedIcon}>
                <Text style={styles.rejectedIconText}>×</Text>
              </View>
              <Text style={styles.rejectedTitle}>Propuesta Rechazada</Text>
              <Text style={styles.rejectedDescription}>
                Lo sentimos, el negocio ha seleccionado a otro creador para esta oferta. 
                Te animamos a aplicar a otras ofertas similares.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.appliedContainer}>
              <View style={styles.appliedIcon}>
                <Text style={styles.appliedIconText}>✓</Text>
              </View>
              <Text style={styles.appliedTitle}>Ya has aplicado a esta oferta</Text>
              <Text style={styles.appliedDescription}>
                Tu propuesta ha sido enviada al negocio. Te notificaremos cuando recibamos una respuesta.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={proposedDates[currentDateIndex]}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Modal
        visible={responseModal.visible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {responseModal.accepted ? (
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>✓</Text>
              </View>
            ) : (
              <View style={styles.iconCircleRed}>
                <Text style={styles.iconText}>×</Text>
              </View>
            )}
            <Text style={styles.modalTitle}>
              {responseModal.accepted ? '¡Propuesta Aceptada!' : 'Propuesta Rechazada'}
            </Text>
            <Text style={styles.modalMessage}>{responseModal.message}</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleCloseResponseModal}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 2,
    fontSize: 14,
  },
  detailValue: {
    fontWeight: 'normal',
    color: '#222',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  businessHeader: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  incentiveContainer: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    ...platformStyles.card,
  },
  incentiveType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  incentiveDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  incentiveValue: {
    fontSize: 14,
    color: '#666',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateSelector: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    ...platformStyles.input,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  removeDateButton: {
    marginLeft: 12,
    padding: 8,
  },
  removeDateText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  addDateButton: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 8,
    ...platformStyles.button,
  },
  addDateText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    ...platformStyles.button,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...platformStyles.card,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  rejectIcon: {
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: '#FFEBEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    ...platformStyles.button,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  iconCircleRed: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFEBEE',
  },
  iconText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  appliedContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  appliedIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appliedIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appliedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  appliedDescription: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    lineHeight: 20,
  },
  rejectedContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  rejectedIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rejectedIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  rejectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  rejectedDescription: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    lineHeight: 20,
  },
  tagItem: {
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1f0ff',
  },
  tagText: {
    color: '#4CAF50',
    fontSize: 14,
  },
});

export default OfferDetailsScreen;
