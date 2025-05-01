
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  to,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  fullWidth = true
}) => {
  const baseClass = cn(
    "bg-gradient-to-r from-teal-500 to-teal-400 text-white py-3 px-6 rounded-lg font-medium shadow-lg",
    "hover:from-teal-400 hover:to-teal-300 transition-all duration-300",
    "disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50",
    fullWidth ? "w-full" : "",
    className
  );

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        <span className="flex items-center justify-center">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
    >
      <span className="flex items-center justify-center">{children}</span>
    </button>
  );
};

export default PrimaryButton;
