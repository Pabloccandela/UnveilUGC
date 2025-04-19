import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ErrorBoundaryScreen() {
  const handleRetry = () => {
    // Aquí podríamos implementar lógica de reinicio de la app
    // Por ejemplo: RootNavigation.reset()
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Ups! Algo salió mal</Text>
      <Text style={styles.message}>
        Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  button: {
    backgroundColor: '#0000ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
