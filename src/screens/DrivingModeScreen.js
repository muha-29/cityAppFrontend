
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

const DrivingModeScreen = () => {
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);

  const handleStartJourney = () => {
    // Code to get the route and display it on the map
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driving Mode</Text>
      <TextInput
        placeholder="Enter your destination"
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />
      <Button title="Start Journey" onPress={handleStartJourney} />
      <MapView style={styles.map}>
        {route && <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
  },
  map: {
    flex: 1,
    marginTop: 20,
  },
});

export default DrivingModeScreen;
