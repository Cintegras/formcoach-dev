
import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-10">
      <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
        {title}
      </h1>
      <p className="font-normal text-[16px] text-[#A4B1B7] text-center mt-2">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;
