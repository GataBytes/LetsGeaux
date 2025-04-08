import React, { useState, useEffect, MouseEvent } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon'; 
// import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import MailIcon from '@mui/icons-material/MailOutlineOutlined';//! find a more fun icon

import { user, chatHistory, message } from '../../../../types/models.ts';
// import { response } from 'express';

interface ChatMessage {
  botMessage: string;
  humanMessage: string;
}
// type Sessions: {

// }

// interface UserSession {

// }
// interface UserSessions {
//   sessions: Array<chatHistory>
// }
interface ChatHistProps {
  user: user;
}
interface SessionWithMessages {
  session: chatHistory;
  messages: message[];
}

const ChatHistory: React.FC<ChatHistProps> = ({ user }) => {
  // const [messages, setMessages] = useState<message[][]>([]); // if storing messages per session
  const [sessionsWithMessages, setSessionsWithMessages] = useState<SessionWithMessages[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState<string>('');

  const userId = user.id;
  //* Fetch Conversations *//
  const getUserSessions = async () => {
    try {
      const response = await axios.get<chatHistory[]>(
        `/api/chats/chat-history/${userId}`
      );
      const sessions = response.data;
      // console.log(sessions)
      const sessionMessages: SessionWithMessages[] = [];

      for (const session of sessions) {
        // console.log(session);
        const msgRes = await axios.get<message[]>(
          `/api/chats/messages/${session.sessionId}`
        );
        // console.log(msgRes);
        sessionMessages.push({
          session: session,
          messages: msgRes.data
        });
      }
      setSessionsWithMessages(sessionMessages);
    } catch (error) {
      console.error('failed to generate user convos', error);
    }
  };
  //* When Page Loads *//
  useEffect(() => {
    getUserSessions();
  }, []);

  //* Change Name *//
  const startEditing = (sessionId: string, currentTitle: string) => {
    
    setEditingSessionId(sessionId);
    setEditedTitle(currentTitle || '');
  };

  const saveEditedName = async (sessionId: string) => {
    try {
      
      const response = await axios.patch(`/api/chats/chat-history/${sessionId}`, {
        conversationName: editedTitle

      });
      setEditingSessionId(null);
      getUserSessions();
    } catch (error) {
      console.error('Failed to change name on client', error);
    }
  }
  const handleDelete = async(sessionId: string) => {
    // console.log(sessionId)
    try {
      const response = await axios.delete(`/api/chats/${sessionId}`);
      console.log('deleted session and messages');
      getUserSessions();
      
    } catch (error) {
      console.error('failed to delete session')
      
    }

  }
  // const handleNameChange = async (id: string) => {
  //   console.log('name change clicked');
  //   try {
  //     const response = await axios.patch(`/api/chat-history/${id}`, {
  //       conversationName: 'New Name'
  //     })
  //   } catch (error) {
  //     console.error('Failed to change name on client', error);
  //   }
  // };
  

  return (
    <List>
      {sessionsWithMessages.map(({ session, messages }) => (
        <React.Fragment  key={session.sessionId}>
          <ListItem id='session.sessionId' onClick={() =>
            setExpandedSessionId(prev =>
              prev === session.sessionId ? null : session.sessionId)
          }>

          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
            {editingSessionId === session.sessionId ? (
              <TextField
                type='text'
                size='small'
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {saveEditedName(session.sessionId);}
                }}
                autoFocus
              />
            ) : (
              <ListItemText
                primary={session.conversationName || 'Untitled Conversation'}
                secondary={`Last active: ${new Date(session.lastActive).toLocaleString()}`}
              />
            )}
          </ListItem>

          <ButtonGroup orientation='vertical' sx={{ pl:2 }}> 
            <Button 
              // id='change-name'
              variant='contained'
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                startEditing(session.sessionId, session.conversationName || '')}}
            >
              Change Name 
            </Button>
            <Divider/>
            <Button 
            variant='contained'
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              handleDelete(session.sessionId)}}
            > Delete Session </Button>
          </ButtonGroup>

          {expandedSessionId === session.sessionId && (
            <List component='div' disablePadding sx={{ pl: 4 }}>
              {messages.map(msg => (
                <ListItem key={msg.id}>
                  <ListItemText
                    primary={`You: ${msg.userMessage}`}
                    secondary={`Bot: ${msg.botResponse}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ChatHistory;
