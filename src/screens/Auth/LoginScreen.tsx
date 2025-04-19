// screens/Auth/LoginScreen.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Button, Title, HelperText, ActivityIndicator } from 'react-native-paper';
import { PasswordInput } from '../../components/PasswordInput';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../context/UserContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AuthStackParamList } from '../../navigation/type';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().required('Requerido')
});

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;


import { MOCK_USERS } from '../../services/mockData';
import type { UserRole } from '../../models/User';

export default function LoginScreen() {
  const { login } = useAuth();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const authNavigation = useNavigation<AuthNavigationProp>();
  const [loginError, setLoginError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoginError('');
    try {
      setLoading(true);
      // Simulando login con datos mock
      const mockUser = MOCK_USERS.find(u => u.email === values.email);
      if (!mockUser) throw new Error('Usuario no encontrado');
      await login(mockUser);
      // El AppNavigator manejará la navegación basado en el estado del usuario
    } catch (error) {
      setLoginError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Title style={styles.title}>Iniciar sesión</Title>
          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <ActivityIndicator size="large" />
              <Text>Procesando...</Text>
            </View>
          )}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
                <PasswordInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
                  placeholder="Contraseña"
                />
                {loginError ? (
                  <HelperText type="error">{loginError}</HelperText>
                ) : null}
                <Button mode="contained" onPress={handleSubmit as any} style={styles.button}>
                  Ingresar
                </Button>
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>¿No tienes cuenta?</Text>
                  <TouchableOpacity 
                    onPress={() => 
                      // Navegar al flujo de registro
                      authNavigation.navigate('Register')
                    }
                  >
                    <Text style={styles.registerLink}>Regístrate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
  },
  form: {
    width: '100%',
    marginBottom: 20
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 24,
    color: '#333'
  },
  button: {
    marginTop: 16,
    paddingVertical: 8
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  registerText: {
    color: '#666'
  },
  registerLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 5
  }
});