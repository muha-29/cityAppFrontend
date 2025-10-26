
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Modal } from 'react-native';
import { API_BASE_URL } from '../utils/config';
import Chatbot from '../components/Chatbot';

const StatusScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleSendMessage = (message) => {
    // Simple rule-based chatbot logic
    const complaintId = message.match(/\d+/);
    if (complaintId) {
      const complaint = complaints.find(c => c.id === parseInt(complaintId[0]));
      if (complaint) {
        alert(`Status of complaint #${complaint.id}: ${complaint.status}`);
      } else {
        alert(`Complaint #${complaintId[0]} not found.`);
      }
    } else {
      alert("I can only understand messages like: 'What is the status of complaint #123?'");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemStatus}>{item.status}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Issue Status</Text>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button title="Ask Chatbot" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Chatbot onSendMessage={handleSendMessage} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemDescription: {
    fontSize: 18,
  },
  itemStatus: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});

export default StatusScreen;
