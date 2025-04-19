import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegisterStackParamList } from '../../../navigation/type';
import { useAuth } from '../../../../context/UserContext';
import SocialMediaInput, { SOCIAL_MEDIA_PLATFORMS } from '../../../components/SocialMediaInput';

type RegisterNavigationProp = NativeStackNavigationProp<RegisterStackParamList, 'Step2'>;

interface SocialMedia {
  platform: string;
  username: string;
}

interface Step2Data {
  socialMedia: SocialMedia[];
  stats: {
    campaigns: number;
    reviews: Object[];
    level: string;
  };
}

interface SocialMediaProfile {
  platform: string;
  username: string;
}

const Step2Screen = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { onboardingData, updateOnboardingData } = useAuth();

  // Form state
  const [profiles, setProfiles] = useState<SocialMediaProfile[]>(
    onboardingData?.step2?.socialMedia
      ? (onboardingData.step2.socialMedia as SocialMedia[]).map(social => ({
          platform: social.platform,
          username: social.username
        }))
      : [{ platform: 'instagram', username: '' }]
  );
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const [generalError, setGeneralError] = useState('');

  // Actualizar datos en el contexto cuando cambien los perfiles
  useEffect(() => {
    const socialMedia = profiles
      .filter(profile => profile.username.trim() !== '')
      .map(profile => ({
        platform: profile.platform,
        username: profile.username.trim()
      }));

    updateOnboardingData('step2', {
      socialMedia,
      stats: {
        campaigns: 0,
        reviews: [],
        level: 'Principiante'
      }
    });
  }, [profiles]);

  const validateProfile = (profile: SocialMediaProfile): boolean => {
    const platform = SOCIAL_MEDIA_PLATFORMS.find(p => p.id === profile.platform);
    if (!platform) return false;

    if (!profile.username) return false;

    // Validar si es una URL o un nombre de usuario
    if (profile.username.startsWith('http')) {
      return profile.username.startsWith(platform.urlPrefix);
    } else {
      // Validar nombre de usuario (letras, números, puntos y guiones bajos)
      return /^[a-zA-Z0-9._]{1,30}$/.test(profile.username);
    }
  };

  const handleAddProfile = () => {
    setProfiles([...profiles, { platform: 'instagram', username: '' }]);
    setGeneralError('');
  };

  const handleRemoveProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
    setGeneralError('');
  };

  const handleProfileChange = (index: number, newProfile: SocialMediaProfile) => {
    // Verificar si el username ya existe en otro perfil
    const isDuplicateUsername = profiles.some(
      (profile, i) => i !== index && 
      profile.platform === newProfile.platform && 
      profile.username.trim().toLowerCase() === newProfile.username.trim().toLowerCase()
    );

    // Actualizar los perfiles primero
    const newProfiles = [...profiles];
    newProfiles[index] = newProfile;
    setProfiles(newProfiles);

    // Actualizar errores después
    if (isDuplicateUsername && newProfile.username.trim() !== '') {
      setErrors({
        ...errors,
        [index]: 'Este nombre de usuario ya está en uso'
      });
    } else if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
    setGeneralError('');
  };

  const handleNext = () => {
    // Validar perfiles
    let hasErrors = false;
    const newErrors: { [key: number]: string } = {};

    // Verificar que haya al menos 2 redes sociales con usuario
    const validProfiles = profiles.filter(profile => profile.username.trim() !== '');
    if (validProfiles.length < 2) {
      setGeneralError('Debes agregar al menos 2 redes sociales');
      return;
    }

    profiles.forEach((profile, index) => {
      if (!validateProfile(profile)) {
        newErrors[index] = 'Perfil inválido';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Convertir perfiles al formato esperado
    const socialMedia = profiles.map(profile => ({
      platform: profile.platform,
      username: profile.username
    }));

    // Guardar datos
    updateOnboardingData('step2', {
      socialMedia,
      stats: {
        campaigns: 0,
        reviews: '0',
        level: 'Principiante'
      }
    });

    // Navegar al siguiente paso
    navigation.navigate('Step3');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conecta tus redes</Text>
        <Text style={styles.subtitle}>Paso 2: Redes Sociales</Text>
        <Text style={styles.description}>
          Agrega al menos 2 redes sociales donde compartes contenido
        </Text>
      </View>

      <ScrollView style={styles.formScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {profiles.map((profile, index) => (
            <SocialMediaInput
              key={index}
              value={profile}
              onChange={(value) => handleProfileChange(index, value)}
              onRemove={profiles.length > 1 ? () => handleRemoveProfile(index) : undefined}
              error={errors[index]}
              showRemoveButton={profiles.length > 1}

            />
          ))}

          {profiles.length < 5 && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
              <Text style={styles.addButtonText}>+ Agregar red social</Text>
            </TouchableOpacity>
          )}

          {generalError ? (
            <Text style={styles.generalError}>{generalError}</Text>
          ) : null}
        </View>
      </ScrollView>

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
  form: {
    width: '100%',
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4CAF50',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generalError: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 15,
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

export default Step2Screen;
