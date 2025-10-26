
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Chatbot from './Chatbot';

describe('Chatbot', () => {
  it('should call onSendMessage with the message when the send button is pressed', () => {
    const onSendMessage = jest.fn();
    const { getByPlaceholderText, getByText } = render(<Chatbot onSendMessage={onSendMessage} />);

    const input = getByPlaceholderText('Ask about your complaint status...');
    fireEvent.changeText(input, 'test message');

    const sendButton = getByText('Send');
    fireEvent.press(sendButton);

    expect(onSendMessage).toHaveBeenCalledWith('test message');
  });
});
