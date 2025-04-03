import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { user } from '../../../types/models.ts';



interface ChatMessage {
  text: string;
  user: boolean;
}



interface ChatProps {
  user: user;
}




const ChatBot: React.FC <ChatProps> = ({user}) => {
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);
  
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatLog([...chatLog, { text: message, user: true }]);
    setMessage('');

    try {
      const response = await axios.post('/api/chats', { message });
        setChatLog(prevChatLog => [...prevChatLog, { text: response.data, user: false }]);
    } catch (error: any) { // Type the error
        console.error("Error sending message:", error);
        setChatLog(prevChatLog => [...prevChatLog, {text: "Error: Could not get response.", user: false }]);
    }
};

useEffect(() => {
    // Scroll to bottom of chat log on update
    if (chatLogRef.current) {
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
}, [chatLog]);
  
  return (
    <div
      className='Chat-Bot'
      style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}
    >
      <h1>Gata Bot</h1>
      <div
        className='chat-list'
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '400px',
          // overflowY: 'scroll'
        }}
        ref={chatLogRef}
      >
        {chatLog.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.user ? 'right' : 'left',
              marginBottom: '5px'
            }}
          >
            <strong>{msg.user ? 'You:' : 'Bot:'}</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder='Type your message...'
          style={{ width: '70%', padding: '8px', marginRight: '10px' }}
        />
        <button
          type='submit'
          style={{
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>

        
  );
};

export default ChatBot;
