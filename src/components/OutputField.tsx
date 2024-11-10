// src/components/OutputField.tsx

import React from 'react';
import { Label } from "@/components/ui/label";
import { OutputFieldProps } from '../types';

const OutputField: React.FC<OutputFieldProps> = ({ label, value, color = "text-[#a5b4fc]" }) => {
  return (
    <div className="flex justify-between items-center rounded-lg bg-[#2d3748]/50 p-4 backdrop-blur-sm">
      <Label className={`text-lg font-bold ${color}`}>{label}</Label>
      <div className={`w-32 p-2 bg-[#374151] rounded text-right ${color}`}>
        {value}
      </div>
    </div>
  );
};

export default OutputField;
