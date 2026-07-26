import React, { useRef } from 'react';
import { animateSpringPulse } from '../../utils/animationEngine';

export default function Button({
  children,
  onClick,
  variant = 'secondary', // primary | secondary | danger
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  ariaLabel,
  ...props
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;
    if (btnRef.current) {
      animateSpringPulse(btnRef.current);
    }
    if (onClick) onClick(e);
  };

  const variantClass = variant === 'primary' 
    ? 'btn-enterprise-primary' 
    : variant === 'danger' 
      ? 'btn-enterprise-danger' 
      : 'btn-enterprise-secondary';

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`btn-enterprise ${variantClass} ${className}`}
      style={{
        minHeight: '44px',
        minWidth: '44px',
        padding: size === 'small' ? '6px 14px' : '10px 20px',
        fontSize: size === 'small' ? '0.8rem' : '0.86rem',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      {...props}
    >
      {Icon && <Icon size={size === 'small' ? 14 : 16} />}
      <span>{children}</span>
    </button>
  );
}
