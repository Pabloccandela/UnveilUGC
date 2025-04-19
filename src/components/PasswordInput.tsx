import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPasswordValidationErrors } from '../utils/validation';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}

export const PasswordInput = ({ value, onChangeText, error, placeholder = 'Contraseña' }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const errors = getPasswordValidationErrors(password);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    validatePassword(text);
  };


  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={!showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      
      {(validationErrors.length > 0 || !!error) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    paddingRight: 40,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  validationContainer: {
    marginTop: 8,
    paddingLeft: 5,
  },
  validationText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginStart: 10,
  },
});
