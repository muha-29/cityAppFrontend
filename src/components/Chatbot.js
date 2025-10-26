
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Chatbot = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ask about your complaint status..."
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginRight: 10,
  },
});

export default Chatbot;
