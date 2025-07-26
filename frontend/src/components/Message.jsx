const Message = ({ role, text }) => {
  const isUser = role === 'user';
  return (
    <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div
        className={`p-3 rounded ${isUser ? 'bg-primary text-white' : 'bg-white text-dark border'}`}
        style={{ maxWidth: '60%' }}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
