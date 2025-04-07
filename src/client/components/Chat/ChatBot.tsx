import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatHistory from './ChatHistory'
import { user } from '../../../../types/models.ts';


interface ChatMessage {
  text: string;
  user: boolean;
}


interface ChatProps {
  user: user;
   
}



const ChatBot: React.FC <ChatProps> = ({user}) => {
  const [userMessage, setUserMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);
  
  const [sessionId, setSessionId] = useState(null); // ? Local Storage 
 
  useEffect(() => {
    // console.log(user)
    // check local storage for session ID
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      // console.log(storedSessionId);
      setSessionId(storedSessionId);
    } else {
      // Create new session ID
      fetch('/api/chats/new-session', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('sessionId', data.sessionId);
          setSessionId(data.sessionId);
        });
        // TODO have chat greet user on mount
    }


    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }

  }, [chatLog]);
 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setChatLog([...chatLog, { text: userMessage, user: true }]);
    setUserMessage('');


    try {
      

      const response = await axios.post('/api/chats', { userMessage, userId: user.id, sessionId });

      setChatLog(prev => [...prev, { text: response.data, user: false }]);

    } catch (error: any) { // Type the error
        console.error("Error sending message:", error);
        setChatLog(prev => [...prev, {text: "Error: Could not get response.", user: false }]);
    }
};



  
  return (
    <div style={{ display: 'flex', height: '100vh'}}>
      <div
        className='Chat-Bot'
        style={{ flex: 3, maxWidth: '800px', margin: '0 auto', padding: '20px' }}
      >
        <h1>Gata Bot</h1>
        <h2>Welcome {user.username}!</h2>
        <div
          className='chat-list'
          ref={chatLogRef}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            height: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {chatLog.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.user ? 'right' : 'left',
                color: msg.user ? 'blue' : 'grey',
                marginBottom: '5px'
              }}
            >
              <strong>{msg.user ? 'You:' : 'Gata:'}</strong> {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <input
            type='text'
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
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
      {/**Chat History */}
      <div style={{  width: '300px', borderLeft: '1px solid', overflowY: 'auto'}}>
        <ChatHistory user={user} />
      </div>
    </div>
        
  );
};

export default ChatBot;
