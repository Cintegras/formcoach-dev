
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
    text-center 
    rounded-[20px]
    bg-transparent 
    text-[#00C4B4]
    font-semibold 
    px-4 py-3 
    hover:opacity-90 
    transition 
    duration-200 
    disabled:opacity-50 
    disabled:cursor-not-allowed
    font-outfit
    h-[90px]
    border
    border-[#00C4B4]
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
