import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PickerOption {
  label: string;
  value: string;
}

interface CountryCityPickerProps {
  country: string;
  city: string;
  countries: PickerOption[];
  cities: PickerOption[];
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  countryError?: string;
  cityError?: string;
}

export default function CountryCityPicker({
  country,
  city,
  countries,
  cities,
  onCountryChange,
  onCityChange,
  countryError,
  cityError
}: CountryCityPickerProps) {
  return (
    <View>
      <Text style={styles.label}>País</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={onCountryChange}
          items={countries}
          value={country}
          style={pickerSelectStyles}
          placeholder={{ label: 'Selecciona un país', value: '' }}
          useNativeAndroidPickerStyle={false}
          Icon={() => Platform.OS === 'ios' ? <Ionicons name="chevron-down" size={24} color="#666" /> : null}
        />
      </View>
      {!!countryError && <Text style={styles.error}>{countryError}</Text>}

      <Text style={styles.label}>Ciudad</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={onCityChange}
          items={cities}
          value={city}
          style={pickerSelectStyles}
          placeholder={{ label: 'Selecciona una ciudad', value: '' }}
          useNativeAndroidPickerStyle={false}
          Icon={() => Platform.OS === 'ios' ? <Ionicons name="chevron-down" size={24} color="#666" /> : null}
        />
      </View>
      {!!cityError && <Text style={styles.error}>{cityError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f9f9f9',
    paddingRight: 30,
    paddingLeft: 10,
    paddingVertical: 12,
  },
  inputAndroid: {
    fontSize: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f9f9f9',
    paddingRight: 30,
    paddingLeft: 10,
    paddingVertical: 8,
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
});
