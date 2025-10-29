const MessageComponent = ({ message, type, timestamp }) => {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className={`message ${type}`}>
            <div className="message-bubble">
                <div className="message-content">
                    {message}
                </div>
                <div className="message-time">
                    {formatTime(timestamp)}
                </div>
            </div>
        </div>
    )
}

export default MessageComponent;