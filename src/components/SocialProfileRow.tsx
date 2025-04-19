import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SocialProfileRowProps {
  platform: string;
  username: string;
}

const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'instagram';
    case 'tiktok':
      return 'music-note';
    case 'youtube':
      return 'youtube';
    default:
      return 'link';
  }
};

const getColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '#E4405F';
    case 'tiktok':
      return '#010101';
    case 'youtube':
      return '#FF0000';
    default:
      return '#4CAF50';
  }
};

const SocialProfileRow: React.FC<SocialProfileRowProps> = ({ platform, username }) => {
  // Puedes ajustar el link real según la plataforma
  const getProfileUrl = () => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return `https://instagram.com/${username}`;
      case 'tiktok':
        return `https://tiktok.com/@${username}`;
      case 'youtube':
        return `https://youtube.com/@${username}`;
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(getProfileUrl())}>
      <MaterialCommunityIcons name={getIcon(platform)} size={28} color={getColor(platform)} style={styles.icon} />
      <Text style={styles.username}>@{username}</Text>
      <Text style={[styles.platform, { color: getColor(platform) }]}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 4,
  },
  icon: {
    marginRight: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  platform: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
});

export default SocialProfileRow;
