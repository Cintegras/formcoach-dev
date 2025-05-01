
import React from 'react';
import { Link } from 'react-router-dom';

interface PrimaryButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
    rounded-full
    bg-[#00C4B4] 
    text-black
    font-semibold 
    px-4 py-3 
    hover:opacity-90 
    transition 
    duration-200 
    disabled:opacity-50 
    disabled:cursor-not-allowed
    font-poppins
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

export default PrimaryButton;
