import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { PasswordInput } from '../../../components/PasswordInput';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegisterStackParamList, RootStackParamList } from '../../../navigation/type';
import { useAuth } from '../../../../context/UserContext';
import { COUNTRIES, CITIES_BY_COUNTRY, MOCK_USERS } from '../../../services/mockData';
import { User } from '../../../models/User';
import { getPasswordValidationErrors } from '../../../utils/validation';

type RegisterNavigationProp = NativeStackNavigationProp<RegisterStackParamList, 'Step1'>;

const Step1Screen = () => {
  const navigation = useNavigation<RegisterNavigationProp>();

  const { onboardingData, updateOnboardingData, register, resetOnboarding } = useAuth();

  // Form state
  const [fullName, setFullName] = useState(onboardingData?.step1?.fullName || '');
  const [email, setEmail] = useState(onboardingData?.step1?.email || '');
  const [password, setPassword] = useState(onboardingData?.step1?.password || '');
  const [country, setCountry] = useState(onboardingData?.step1?.country || '');
  const [city, setCity] = useState(onboardingData?.step1?.city || '')
  
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);


  // Actualizar datos en el contexto cuando cambien
  useEffect(() => {
    updateOnboardingData('step1', {
      fullName,
      email,
      password,
      country,
      city,
    });
  }, [fullName, email, password, country, city]);

  // Actualizar ciudades cuando cambia el país
  useEffect(() => {
    if (country) {
      setAvailableCities(CITIES_BY_COUNTRY[country] || []);
    } else {
      setAvailableCities([]);
    }
  }, [country]);

  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    country: '',
    city: '',
  });

  // Validaciones individuales
  const validateFullName = (name: string) => {
    if (!name.trim()) return 'El nombre completo es requerido';
    return '';
  };
  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'El correo electrónico es requerido';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Ingresa un correo electrónico válido';
    // Validar si el correo ya existe en MOCK_USERS
    const emailExists = MOCK_USERS.some((u: User) => u.email === email);
    if (emailExists) return 'Este correo ya está registrado.';
    return '';
  };
  const validatePassword = (pass: string) => {
    if (!pass) return 'La contraseña es requerida';
    const errors = getPasswordValidationErrors(pass);
    if (errors.length > 0) return errors[0]; // Muestra solo el primer error, o puedes concatenar todos
    return '';
  };

  const validateCountry = (c: string) => {
    if (!c) return 'Selecciona un país';
    return '';
  };
  const validateCity = (c: string) => {
    if (!c) return 'Selecciona una ciudad';
    return '';
  };

  const handleNext = async () => {
    // Validar todos los campos al intentar avanzar
    const newErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      country: validateCountry(country),
      city: validateCity(city),
    };
    const hasErrors = Object.values(newErrors).some((err) => !!err);
    setErrors(newErrors);

    if (!hasErrors) {
      try {
        // Registrar al usuario

        register({
          email,
          password,
          fullName,
          country,
          city
        });

        // Guardar datos en el onboarding
        updateOnboardingData('step1', {
          fullName,
          email,
          password,
          country,
          city,
        });
        
        // Navegar al siguiente paso
        navigation.navigate('Step2');

      } catch (error) {
        console.error('Error en el registro:', error);
        setErrors((prev) => ({
          ...prev,
          email: 'Error al registrar el usuario. Por favor intenta de nuevo.'
        }));
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Paso 1: Información básica</Text>
        <Text style={styles.description}>Ingresa tus datos para comenzar</Text>
      </View>

      <ScrollView style={styles.formScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={[styles.input, errors.fullName ? styles.inputError : null]}
              placeholder="Ej: Juan Pérez"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setErrors(prev => ({ ...prev, fullName: validateFullName(text) }));
              }}
              onBlur={() => setErrors(prev => ({ ...prev, fullName: validateFullName(fullName) }))}
            />
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Ej: juan@ejemplo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: validateEmail(text) }));
              }}
              onBlur={() => setErrors(prev => ({ ...prev, email: validateEmail(email) }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <PasswordInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: validatePassword(text) }));
              }}
              error={errors.password}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>País</Text>
            <TouchableOpacity
              style={[styles.input, errors.country ? styles.inputError : null]}
              onPress={() => setShowCountryPicker(true)}
              onBlur={() => setErrors(prev => ({ ...prev, country: validateCountry(country) }))}
            >
              <Text style={country ? styles.inputText : styles.placeholderText}>
                {country || 'Selecciona tu país'}
              </Text>
            </TouchableOpacity>
            {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad</Text>
            <TouchableOpacity
              style={[styles.input, errors.city ? styles.inputError : null]}
              onPress={() => country && setShowCityPicker(true)}
              onBlur={() => setErrors(prev => ({ ...prev, city: validateCity(city) }))}
              disabled={!country}
            >
              <Text style={[city ? styles.inputText : styles.placeholderText, !country && styles.disabledText]}>
                {city || (country ? 'Selecciona tu ciudad' : 'Primero selecciona un país')}
              </Text>
            </TouchableOpacity>
            {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity 
            onPress={() =>{
              // Borrar datos
              // Navegar al flujo de login
                resetOnboarding()
                navigation.getParent()?.navigate('Login')
              }}
          >
            <Text style={styles.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showCountryPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona tu país</Text>
            <ScrollView>
              {COUNTRIES.map((countryName) => (
                <TouchableOpacity
                  key={countryName}
                  style={styles.modalItem}
                  onPress={() => {
                    setCountry(countryName);
                    setCity('');
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{countryName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCountryPicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCityPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona tu ciudad</Text>
            <ScrollView>
              {availableCities.map((cityName) => (
                <TouchableOpacity
                  key={cityName}
                  style={styles.modalItem}
                  onPress={() => {
                    setCity(cityName);
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{cityName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCityPicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCityPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona tu ciudad</Text>
            <ScrollView>
              {availableCities.map((cityName) => (
                <TouchableOpacity
                  key={cityName}
                  style={styles.modalItem}
                  onPress={() => {
                    setCity(cityName);
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{cityName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCityPicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  formScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
    marginBottom: 30,
    color: '#666',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#999',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    marginStart: 10,
    marginBottom: 15,
    fontSize: 12,
  },
  inputText: {
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  disabledText: {
    color: '#ccc',
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Step1Screen;
