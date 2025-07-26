import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const UserInput = () => {
  const { input, setInput, sendMessage, loading } = useContext(ChatContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-top d-flex gap-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="form-control"
        placeholder="Type your message..."
        disabled={loading}
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? '...' : 'Send'}
      </button>
    </form>
  );
};

export default UserInput;
