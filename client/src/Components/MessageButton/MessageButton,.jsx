import '../BlockButton/ButtonStyles.scss';

const MessageButton = () => {
  return (
    <button className="action-btn-badge message" style={{marginBottom: 0}} onClick={() => handleStartChat(userData)}>
      <span>Message</span>
    </button>
  )
}

export default MessageButton;