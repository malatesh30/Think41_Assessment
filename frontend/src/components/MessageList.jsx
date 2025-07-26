import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import Message from './Message';

const MessageList = () => {
  const { messages } = useContext(ChatContext);
  return (
    <div className="d-flex flex-column gap-3">
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} text={msg.text} />
      ))}
    </div>
  );
};

export default MessageList;
