import { ChatProvider } from './context/ChatContext';
import ChatWindow from '../components/ChatWindow';

const App = () => (
  <ChatProvider>
    <ChatWindow />
  </ChatProvider>
);

export default App;
