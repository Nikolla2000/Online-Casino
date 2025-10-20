import './AIChatStyles.scss';

const FloatingChatButton = () => {
    return (
        <div className="floating-ai-assistant">
        <button 
        //   className={`ai-button ${isOpen ? 'active' : ''}`}
          className={`ai-button`}
        //   onClick={}
          aria-label="AI Assistant"
        >
          <div className="ai-robot">
            <div className="robot-head">
              <div className="robot-eye left-eye"></div>
              <div className="robot-eye right-eye"></div>
              <div className="robot-mouth"></div>
            </div>
          </div>
          <div className="pulse-ring"></div>
        </button>
        </div>
    )
}

export default FloatingChatButton;