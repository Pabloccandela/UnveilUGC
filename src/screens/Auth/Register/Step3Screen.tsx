/**
 * Step3Screen: Pantalla de selección de intereses/categorías
 * Permite al usuario seleccionar entre 1 y 5 categorías que representan su contenido
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegisterStackParamList } from '../../../navigation/type';
import { useAuth } from '../../../../context/UserContext';
import { UGC_CATEGORIES } from '../../../services/mockData';

type RegisterNavigationProp = NativeStackNavigationProp<RegisterStackParamList, 'Step3'>;

const Step3Screen = () => {
  // Hooks de navegación y contexto de usuario
  const navigation = useNavigation<RegisterNavigationProp>();
  const { onboardingData, updateOnboardingData } = useAuth();

  // Estado para almacenar los intereses seleccionados y mensajes de error
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    onboardingData?.step3?.interests || []
  );
  const [error, setError] = useState('');

  /**
   * Alterna la selección de un interés
   * Si ya está seleccionado, lo quita
   * Si no está seleccionado y hay menos de 5, lo agrega
   */
  const toggleInterest = (interest: string) => {
    setError('');
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      setError('Máximo 5 intereses permitidos');
    }
  };

  /**
   * Maneja la navegación al siguiente paso
   * Valida que haya al menos 1 interés seleccionado
   * Guarda los intereses en el contexto y avanza
   */
  const handleNext = () => {
    if (selectedInterests.length === 0) {
      setError('Selecciona al menos 1 interés');
      return;
    }

    updateOnboardingData('step3', {
      interests: selectedInterests,
    });

    navigation.navigate('Step4');
  };

  // Cálculo del ancho de los items para el grid de 2 columnas
  const numColumns = 2;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 60) / numColumns; // 60 = padding total (20 * 2 + 20 entre items)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus intereses</Text>
        <Text style={styles.subtitle}>Paso 3: Selección de categorías</Text>
        <Text style={styles.description}>
          Selecciona hasta 5 categorías que mejor representen tu contenido
        </Text>
      </View>

      {/* ScrollView independiente para las categorías */}
      <ScrollView 
        style={styles.categoriesScroll} 
        contentContainerStyle={styles.categoriesContent}
      >
        <View style={styles.interestsGrid}>
          {UGC_CATEGORIES.map((interest, index) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestButton,
              { width: itemWidth },
              selectedInterests.includes(interest) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={[
                styles.interestText,
                selectedInterests.includes(interest) && styles.selectedInterestText,
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>

      {/* Sección de errores y conteo */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.selectedContainer}>
        <Text style={styles.selectedTitle}>
          Seleccionados: {selectedInterests.length}/5
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.selectedInterests}
          contentContainerStyle={styles.selectedInterestsContent}
        >
          {selectedInterests.map(interest => (
            <View key={interest} style={styles.selectedInterestChip}>
              <Text style={styles.selectedInterestChipText}>{interest}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Botón de siguiente */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
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

// Estilos de la pantalla
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  categoriesScroll: {
    flex: 1,
    minHeight: 200,
    maxHeight: '60%',
    marginVertical: 10,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    paddingHorizontal: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  interestButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  selectedInterest: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  interestText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedInterestText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  selectedContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectedTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  selectedInterests: {
    maxHeight: 50,
  },
  selectedInterestsContent: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
  },
  selectedInterestChip: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedInterestChipText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Step3Screen;
