import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ReviewCardProps {
  name: string;
  stars: number;
  text: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, stars, text }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.starsRow}>
          {[1,2,3,4,5].map((n) => (
            <MaterialCommunityIcons
              key={n}
              name={n <= stars ? 'star' : 'star-outline'}
              size={20}
              color={n <= stars ? '#FFC107' : '#BDBDBD'}
              style={{ marginHorizontal: 1 }}
            />
          ))}
        </View>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fafbfc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
});

export default ReviewCard;
