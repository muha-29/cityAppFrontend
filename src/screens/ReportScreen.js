
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Platform } from 'react-native';
import { API_BASE_URL } from '../utils/config';
// Note: You'll need to install and link these libraries
// import ImagePicker from 'react-native-image-picker';
// import Geolocation from 'react-native-geolocation-service';

const ReportScreen = () => {
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const handleChoosePhoto = () => {
    // Code to open image picker and set photo
  };

  const handleGetLocation = () => {
    // Code to get current location and set location
  };

  const handleReport = async () => {
    // Code to handle reporting the issue
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Report a Civic Issue
      </Text>
      <TextInput
        placeholder="Description of the issue"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20 }}
      />
      <View style={{ marginBottom: 20 }}>
        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={{ width: '100%', height: 200, resizeMode: 'cover' }}
          />
        )}
        <Button title="Choose Photo" onPress={handleChoosePhoto} />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Button title="Get Location" onPress={handleGetLocation} />
        {location && (
          <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>
        )}
      </View>
      <Button title="Report" onPress={handleReport} />
    </View>
  );
};

export default ReportScreen;
