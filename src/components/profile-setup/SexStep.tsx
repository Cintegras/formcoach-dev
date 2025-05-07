import React from 'react';

interface SexStepProps {
  value: "male" | "female" | "other" | undefined;
  onChange: (value: "male" | "female" | "other") => void;
}

const SexStep: React.FC<SexStepProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
        What's your sex?
      </h1>

        <div className="flex flex-col gap-4 mt-8">
        <button
          type="button"
          onClick={() => onChange("male")}
          className={`p-4 rounded-lg text-lg transition-colors ${
            value === "male" 
              ? "bg-[#00C4B4] text-black font-semibold" 
              : "bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]"
          }`}
        >
          Male
        </button>

            <button
          type="button"
          onClick={() => onChange("female")}
          className={`p-4 rounded-lg text-lg transition-colors ${
            value === "female" 
              ? "bg-[#00C4B4] text-black font-semibold" 
              : "bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]"
          }`}
        >
          Female
        </button>

            <button
          type="button"
          onClick={() => onChange("other")}
          className={`p-4 rounded-lg text-lg transition-colors ${
            value === "other" 
              ? "bg-[#00C4B4] text-black font-semibold" 
              : "bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]"
          }`}
        >
          Other
        </button>
      </div>
    </div>
  );
};

export default SexStep;
