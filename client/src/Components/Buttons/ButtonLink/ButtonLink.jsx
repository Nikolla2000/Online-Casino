import React from 'react';
import './ButtonLink.scss';

const ButtonLink = ({ 
  variant = 'primary', 
  children, 
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...restProps 
}) => {
  const getButtonClasses = () => {
    let baseClass = 'cta-button';
    
    if (variant === 'primary') {
      baseClass += ' primary';
    } else if (variant === 'secondary') {
      baseClass += ' secondary';
    } else if (variant === 'outline') {
      baseClass += ' outline';
    }
    
    if (disabled) {
      baseClass += ' disabled';
    }
    
    if (className) {
      baseClass += ` ${className}`;
    }
    
    return baseClass;
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...restProps}
    >
      <span className="button-text">{children}</span>
    </button>
  );
};

export default ButtonLink;