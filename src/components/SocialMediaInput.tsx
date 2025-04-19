import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

export type SocialMediaPlatform = {
  id: string;
  name: string;
  placeholder: string;
  icon: string; // Emoji por ahora, podríamos usar imágenes después
  urlPrefix: string;
};

export const SOCIAL_MEDIA_PLATFORMS: SocialMediaPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    placeholder: '@usuario o URL del perfil',
    icon: '📸',
    urlPrefix: 'https://instagram.com/',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    placeholder: '@usuario o URL del perfil',
    icon: '🎵',
    urlPrefix: 'https://tiktok.com/@',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    placeholder: '@usuario o URL del canal',
    icon: '🎥',
    urlPrefix: 'https://youtube.com/',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    placeholder: '@usuario o URL del perfil',
    icon: '🐦',
    urlPrefix: 'https://twitter.com/',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    placeholder: 'URL del perfil o página',
    icon: '👤',
    urlPrefix: 'https://facebook.com/',
  },
];

interface SocialMediaInputProps {
  value: {
    platform: string;
    username: string;
  };
  onChange: (value: { platform: string; username: string }) => void;
  onRemove?: () => void;
  error?: string;
  showRemoveButton?: boolean;
  usedPlatforms?: string[];
}

const SocialMediaInput = ({
  value,
  onChange,
  onRemove,
  error,
  showRemoveButton = true,
  usedPlatforms = [],
}: SocialMediaInputProps) => {
  const [showPlatformPicker, setShowPlatformPicker] = React.useState(false);
  const selectedPlatform = SOCIAL_MEDIA_PLATFORMS.find(p => p.id === value.platform) || SOCIAL_MEDIA_PLATFORMS[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.platformSelector}
        onPress={() => setShowPlatformPicker(true)}
      >
        <Text style={styles.platformIcon}>{selectedPlatform.icon}</Text>
        <Text style={styles.platformName}>{selectedPlatform.name}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder={selectedPlatform.placeholder}
          value={value.username}
          onChangeText={(text) => onChange({ ...value, username: text })}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {showRemoveButton && onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={showPlatformPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una red social</Text>
            <ScrollView>
              {SOCIAL_MEDIA_PLATFORMS
                .filter(platform => !usedPlatforms?.includes(platform.id) || platform.id === value.platform)
                .map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  style={styles.platformOption}
                  onPress={() => {
                    onChange({ platform: platform.id, username: value.username });
                    setShowPlatformPicker(false);
                  }}
                >
                  <Text style={styles.platformIcon}>{platform.icon}</Text>
                  <Text style={styles.platformOptionText}>{platform.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPlatformPicker(false)}
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
  container: {
    marginBottom: 15,
  },
  platformSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  platformIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  platformName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
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
  platformOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  platformOptionText: {
    fontSize: 16,
    color: '#333',
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

export default SocialMediaInput;
