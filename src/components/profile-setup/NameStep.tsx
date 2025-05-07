
import React from 'react';
import { Input } from '@/components/ui/input';
import { UserCircle } from 'lucide-react';

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const NameStep: React.FC<NameStepProps> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <UserCircle size={28} className="text-[#00C4B4] mr-3"/>
        <h1 className="text-2xl font-bold text-center text-[#D7E4E3]">
          What's your name?
        </h1>
      </div>
      
      <div className="relative mt-8">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="John"
          type="text"
          className="rounded-md w-full h-auto pl-[42px] pr-[13.5px] py-[13px] border-0 text-[17px] font-normal"
          style={{
            backgroundColor: "rgba(176, 232, 227, 0.12)",
            color: "rgba(209, 235, 233, 0.62)"
          }}
        />
        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A4B1B7]" size={20} />
      </div>
      
      {error && (
        <p className="text-[#FF4D4F] text-sm">{error}</p>
      )}
    </div>
  );
};

export default NameStep;
