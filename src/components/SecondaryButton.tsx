
import React from 'react';
import { Link } from 'react-router-dom';

interface SecondaryButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  to,
  onClick,
  className = "",
  disabled = false,
  type = "button"
}) => {
  const baseClass = `
    w-full 
    h-[50px]
    text-center 
    rounded-2xl
    bg-transparent
    border
    border-[#8E9196]
    text-[#8E9196]
    font-medium 
    text-[17px]
    flex
    items-center
    justify-center
    hover:opacity-90 
    transition 
    duration-200 
    disabled:opacity-50 
    disabled:cursor-not-allowed
  `;

  const finalClass = `${baseClass} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={finalClass}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClass}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
