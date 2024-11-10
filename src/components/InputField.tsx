import React, { useState } from 'react';
import { InputFieldProps } from '../types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, icon }) => {
  const [open, setOpen] = useState(false);

  const parseValue = (val: string | number): number => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(numVal) ? 0 : numVal;
  };

  const getStepSize = (val: number, fieldLabel: string): number => {
    if (fieldLabel.includes('Commission')) {
      return 0.001;
    }
    if (fieldLabel.includes('Premium')) {
      return 0.01;
    }
    if (fieldLabel.includes('DTE')) {
      return 1;
    }
    if (fieldLabel.includes('Spread')) {
      return 5;
    }
    if (val < 0.1) return 0.01;
    if (val < 1) return 0.1;
    if (val < 10) return 0.5;
    return 1;
  };

  const formatValue = (num: number, stepSize: number): string => {
    if (stepSize <= 0.001) return num.toFixed(3);
    if (stepSize <= 0.01) return num.toFixed(2);
    if (stepSize < 1) return num.toFixed(1);
    return num.toFixed(0);
  };

  const getPickerValues = (currentValue: string | number, fieldLabel: string): string[] => {
    const numValue = parseValue(currentValue);
    
    // Special handling for different field types
    if (fieldLabel.includes('Commission')) {
      const values: string[] = [];
      for (let val = 0.014; val <= 0.026; val += 0.001) {
        values.push(val.toFixed(3));
      }
      return values;
    }
    
    if (fieldLabel.includes('Spread')) {
      const values: string[] = [];
      for (let val = 0; val <= 65; val += 5) {
        values.push(val.toString());
      }
      return values;
    }

    if (fieldLabel.includes('DTE')) {
      const values: string[] = [];
      for (let val = 1; val <= 65; val++) {
        values.push(val.toString());
      }
      return values;
    }

    if (fieldLabel.includes('Premium')) {
      const values: string[] = [];
      // Start from 0.00 if current value is less than 0.21
      for (let val = 0.00; val <= 10.00; val += 0.01) {
        values.push(val.toFixed(2));
      }
      return values;
    }

    if (fieldLabel.includes('ARORC')) {
        const values: string[] = [];
        // Start from 0.00 if current value is less than 0.21
        for (let val = 42; val <= 48; val++) {
          values.push(val.toFixed(2));
        }
        return values;
      }
    
    // Default handling for other fields
    const stepSize = getStepSize(numValue, label);
    const range = 3;
    const values: string[] = [];
    
    for (let i = range; i > 0; i--) {
      const num = Math.max(0, numValue - (stepSize * i));
      values.push(formatValue(num, stepSize));
    }
    
    values.push(formatValue(numValue, stepSize));
    
    for (let i = 1; i <= range; i++) {
      const num = numValue + (stepSize * i);
      values.push(formatValue(num, stepSize));
    }
    
    return values;
  };

  const handleValueSelect = (newValue: string) => {
    const syntheticEvent = {
      target: { value: newValue }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    setOpen(false);
  };

  const handleInputStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = parseValue(value);
    const stepSize = getStepSize(currentValue, label);
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const change = e.key === 'ArrowUp' ? stepSize : -stepSize;
      let newValue = Math.max(0, currentValue + change);
      
      if (label.includes('Commission')) {
        if (newValue < 0.014 || newValue > 0.028) return;
      }
      
      // Enforce step size for Spread field
      if (label.includes('Spread')) {
        newValue = Math.round(newValue / 5) * 5;
        if (newValue > 65) return;
      }

      // Enforce range for DTE
      if (label.includes('DTE')) {
        if (newValue < 1 || newValue > 65) return;
      }
      
      const syntheticEvent = {
        target: {
          value: formatValue(newValue, stepSize)
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  const currentStepSize = getStepSize(parseValue(value), label);
  const pickerValues = getPickerValues(value, label);

  return (
    <div className="flex flex-col rounded-lg bg-[#2d3748]/50 p-4 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <Label className="text-[#94a3b8] text-lg flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </Label>
        
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={onChange}
            onKeyDown={handleInputStep}
            step={currentStepSize}
            className="w-24 bg-[#374151] border-0 text-white text-right"
          />
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 w-10 p-0 bg-[#374151] border-0 hover:bg-[#4b5563]"
              >
                <ChevronsUpDown className="h-4 w-4 text-[#a5b4fc]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-24 p-0 bg-[#374151] border-0"
              align="end"
            >
              <div className="max-h-[160px] overflow-auto">
                {pickerValues.map((val) => (
                  <Button
                    key={val}
                    variant="ghost"
                    className={`w-full justify-center px-2 py-1.5 text-sm ${
                      val === value.toString()
                        ? 'bg-[#4b5563] text-white'
                        : 'text-[#94a3b8] hover:bg-[#4b5563] hover:text-white'
                    }`}
                    onClick={() => handleValueSelect(val)}
                  >
                    {val}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default InputField;