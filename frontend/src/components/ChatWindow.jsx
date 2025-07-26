import Sidebar from './Sidebar';
import MessageList from '../MessageList.jsx';
import UserInput from './UserInput';

const ChatWindow = () => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1 overflow-auto p-3 border">
          <MessageList />
        </div>
        <UserInput />
      </div>
    </div>
  );
};

export default ChatWindow;
