// Button.tsx
import React, { ReactNode } from 'react';

interface ButtonProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  backgroundColor = '#3C50E0',
  textColor = '#ffffff',
  icon,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor,
        color: textColor,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      className={`text-xs md:text-sm h-fit py-5 px-5
        fixed bottom-4 right-4 rounded-full shadow-lg z-50
        md:static md:rounded md:shadow-none md:z-auto md:py-3 md:px-3
        ${className}`}
    >
      {icon && <span className='inline-flex md:hidden'>{icon}</span>}
      <span className='hidden md:inline-block'>{text}</span>
    </button>
  );
};

export default Button;
