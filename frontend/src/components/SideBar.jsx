import { useEffect, useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import axios from 'axios';

const Sidebar = () => {
  const [sessions, setSessions] = useState([]);
  const { setMessages } = useContext(ChatContext);

  const loadSession = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/chat/history/${id}`);
    setMessages(res.data.messages);
  };

  useEffect(() => {
    async function fetchSessions() {
      const res = await axios.get('http://localhost:5000/api/chat/user/anonymous');
      setSessions(res.data);
    }
    fetchSessions();
  }, []);

  return (
    <div className="border-end bg-light" style={{ width: '18rem', overflowY: 'auto' }}>
      <h5 className="p-3 border-bottom">History</h5>
      <ul className="list-group list-group-flush">
        {sessions.map(s => (
          <li
            key={s._id}
            onClick={() => loadSession(s._id)}
            className="list-group-item list-group-item-action"
            style={{ cursor: 'pointer' }}
          >
            {new Date(s.updatedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
