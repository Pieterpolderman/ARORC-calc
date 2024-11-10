// src/components/InputField.tsx

import React, { useMemo, useCallback } from 'react';
import { InputFieldProps } from '../types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, icon }) => {

  const parseValue = useCallback((val: string | number): number => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(numVal) ? 0 : numVal;
  }, []);

  const getStepSize = useCallback((val: number): number => {
    if (val < 0.1) return 0.01;
    if (val < 1) return 0.1;
    if (val < 10) return 0.5;
    return 1;
  }, []);

  const formatValue = useCallback((num: number, stepSize: number): string => {
    if (stepSize < 0.1) return num.toFixed(2);
    if (stepSize < 1) return num.toFixed(1);
    return num.toFixed(0);
  }, []);

  const getPickerValues = useCallback((currentValue: string | number): Array<{ value: string, index: number }> => {
    const numValue = parseValue(currentValue);
    const stepSize = getStepSize(numValue);
    const range = 20;
    
    const values: Array<{ value: string, index: number }> = [];
    let index = 0;
    
    // Generate values below current value
    for (let i = range; i > 0; i--) {
      const num = Math.max(0, numValue - (stepSize * i));
      values.push({
        value: formatValue(num, stepSize),
        index: index++
      });
    }
    
    // Add current value
    values.push({
      value: formatValue(numValue, stepSize),
      index: index++
    });
    
    // Generate values above current value
    for (let i = 1; i <= range; i++) {
      const num = numValue + (stepSize * i);
      values.push({
        value: formatValue(num, stepSize),
        index: index++
      });
    }
    
    return values;
  }, [parseValue, getStepSize, formatValue]);

  // Update useMemo with proper dependencies
  const pickerValues = useMemo(() => 
    getPickerValues(value), 
    [value, getPickerValues]
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const syntheticEvent = {
      target: {
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const handleInputStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = parseValue(value);
    const stepSize = getStepSize(currentValue);
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const change = e.key === 'ArrowUp' ? stepSize : -stepSize;
      const newValue = Math.max(0, currentValue + change);
      
      const syntheticEvent = {
        target: {
          value: formatValue(newValue, stepSize)
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  const currentStepSize = getStepSize(parseValue(value));

  return (
    <div className="flex justify-between items-center rounded-lg bg-[#2d3748]/50 p-4 backdrop-blur-sm">
      <Label className="text-[#94a3b8] text-lg flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </Label>
      
      <div className="relative">
        {/* Desktop Input - Hidden on mobile */}
        <Input
          type="number"
          value={value}
          onChange={onChange}
          onKeyDown={handleInputStep}
          step={currentStepSize}
          className="hidden md:block w-32 bg-[#374151] border-0 text-white text-right"
        />

        {/* Mobile Select - Hidden on desktop */}
        <select
          value={value.toString()}
          onChange={handleSelectChange}
          className="block md:hidden w-32 bg-[#374151] border-0 text-white text-right appearance-none px-3 py-2 rounded-md"
        >
          {pickerValues.map(({ value: val, index }) => (
            <option key={`${val}-${index}`} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InputField;