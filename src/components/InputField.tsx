// src/components/InputField.tsx

import React, { useState } from 'react';
import { InputFieldProps } from '../types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, icon }) => {
  // State to toggle between scroll picker and manual input modes
  const [isPickerMode, setIsPickerMode] = useState(true);
  
  // Toggle between scroll picker and manual input mode on click
  const handleToggleMode = () => {
    setIsPickerMode(!isPickerMode);
  };

  // Define a range of values for the scroll picker (e.g., 0 to 100 in 0.5 increments)
  const pickerValues = Array.from({ length: 201 }, (_, i) => (i * 0.5).toFixed(1));

  return (
    <div className="flex justify-between items-center rounded-lg bg-[#2d3748]/50 p-4 backdrop-blur-sm">
      <Label className="text-[#94a3b8] text-lg flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </Label>
      
      {/* Mobile-Only Scroll Picker */}
      {isPickerMode ? (
        <select
          value={value}
          onChange={(e) => onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}  // Casting to handle onChange type
          onClick={handleToggleMode}
          className="mobile-only w-32 bg-[#374151] border-0 text-white text-right"
        >
          {pickerValues.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      ) : (
        <Input
          type="number"
          value={value}
          onChange={onChange}
          onClick={handleToggleMode}
          className="desktop-only w-32 bg-[#374151] border-0 text-white text-right"
        />
      )}

      {/* Desktop-Only Manual Input */}
      <Input
        type="number"
        value={value}
        onChange={onChange}
        onClick={handleToggleMode}
        className="desktop-only w-32 bg-[#374151] border-0 text-white text-right"
      />
    </div>
  );
};

export default InputField;
