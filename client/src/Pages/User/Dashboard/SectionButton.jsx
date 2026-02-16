const SectionButton = ({ id, label, activeSection, onClick, className = '' }) => {
    const isActive = activeSection === id;
    
    return (
        <button
            className={`nav-item ${isActive ? 'active' : ''} ${className}`}
            onClick={() => onClick(id)}
        >
            {label}
        </button>
    )
}

export default SectionButton;