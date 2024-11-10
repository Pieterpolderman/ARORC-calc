// src/components/InputField.tsx

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputFieldProps } from '../types';

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, icon }) => {
  return (
    <div className="flex justify-between items-center rounded-lg bg-[#2d3748]/50 p-4 backdrop-blur-sm">
      <Label className="text-[#94a3b8] text-lg flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </Label>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        className="w-32 bg-[#374151] border-0 text-white text-right"
      />
    </div>
  );
};

export default InputField;
