
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { API_BASE_URL } from '../utils/config';

const MapScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/complaints`)
      .then(response => response.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {complaints.map(complaint => (
          <Marker
            key={complaint.id}
            coordinate={{ latitude: complaint.latitude, longitude: complaint.longitude }}
            title={complaint.description}
            description={complaint.status}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
