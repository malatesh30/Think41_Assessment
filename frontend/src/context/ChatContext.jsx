import { createContext, useState } from 'react';
import axios from 'axios';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        conversation_id: sessionId,
      });
      const aiMsg = { role: 'ai', text: res.data.response };
      setSessionId(res.data.conversation_id);
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong.' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loading, input, setInput, sendMessage, sessionId, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
