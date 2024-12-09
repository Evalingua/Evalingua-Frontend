// Button.tsx
import React, { ReactNode } from 'react';

interface ButtonProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: ReactNode; // Nueva prop para el ícono
  iconPosition?: 'left' | 'right'; // Nueva prop para la posición del ícono
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  backgroundColor = '#3C50E0',
  textColor = '#ffffff',
  icon,
  iconPosition = 'left',
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor,
        color: textColor,
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      className="text-xs md:text-sm h-fit"
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{text}</span>
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};

export default Button;
