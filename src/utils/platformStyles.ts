// utils/platformStyles.ts
import { Platform, StyleSheet } from 'react-native';

/**
 * Utilidad para crear estilos específicos de plataforma
 * Permite definir estilos diferentes para iOS y Android
 */
export const createPlatformStyles = () => {
  // Estilos de borde específicos para cada plataforma
  const borderStyles = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  });

  // Estilos de input específicos para cada plataforma
  const inputStyles = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      borderRadius: 8,
    },
    android: {
      elevation: 2,
      borderRadius: 4,
    },
  });

  // Estilos de botón específicos para cada plataforma
  const buttonStyles = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      borderRadius: 10,
    },
    android: {
      elevation: 3,
      borderRadius: 4,
    },
  });

  // Estilos de tarjeta específicos para cada plataforma
  const cardStyles = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      borderRadius: 12,
    },
    android: {
      elevation: 4,
      borderRadius: 8,
    },
  });

  // Estilos de cabecera específicos para cada plataforma
  const headerStyles = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      borderBottomWidth: 0,
    },
    android: {
      elevation: 2,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
  });

  return {
    border: borderStyles,
    input: inputStyles,
    button: buttonStyles,
    card: cardStyles,
    header: headerStyles,
  };
};

// Exportar los estilos de plataforma para uso en toda la aplicación
export const platformStyles = createPlatformStyles();
