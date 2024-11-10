import React, { useMemo, useCallback } from 'react';
import { InputFieldProps } from '../types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, icon }) => {
  const parseValue = useCallback((val: string | number): number => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(numVal) ? 0 : numVal;
  }, []);

  const getStepSize = useCallback((val: number, fieldLabel: string): number => {
    if (fieldLabel.includes('Commission')) {
      return 0.001;
    }
    if (fieldLabel.includes('Premium')) {
      return 0.01;
    }
    if (val < 0.1) return 0.01;
    if (val < 1) return 0.1;
    if (val < 10) return 0.5;
    return 1;
  }, []);

  const formatValue = useCallback((num: number, stepSize: number): string => {
    if (stepSize <= 0.001) return num.toFixed(3);
    if (stepSize <= 0.01) return num.toFixed(2);
    if (stepSize < 1) return num.toFixed(1);
    return num.toFixed(0);
  }, []);

  const getPickerValues = useCallback((currentValue: string | number, fieldLabel: string): Array<{ value: string, index: number }> => {
    const numValue = parseValue(currentValue);
    const stepSize = getStepSize(numValue, fieldLabel);
    const range = 5; // Keep range at 5 to ensure smooth scrolling
    
    const values: Array<{ value: string, index: number }> = [];
    let index = 0;
    
    if (fieldLabel.includes('Commission')) {
      for (let val = 0.014; val <= 0.026; val += 0.001) {
        values.push({
          value: val.toFixed(3),
          index: index++
        });
      }
    } else {
      for (let i = range; i > 0; i--) {
        const num = Math.max(0, numValue - (stepSize * i));
        values.push({
          value: formatValue(num, stepSize),
          index: index++
        });
      }
      
      values.push({
        value: formatValue(numValue, stepSize),
        index: index++
      });
      
      for (let i = 1; i <= range; i++) {
        const num = numValue + (stepSize * i);
        values.push({
          value: formatValue(num, stepSize),
          index: index++
        });
      }
    }
    
    return values;
  }, [parseValue, getStepSize, formatValue]);

  const pickerValues = useMemo(() => 
    getPickerValues(value, label), 
    [value, label, getPickerValues]
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
    const stepSize = getStepSize(currentValue, label);
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const change = e.key === 'ArrowUp' ? stepSize : -stepSize;
      const newValue = Math.max(0, currentValue + change);
      
      if (label.includes('Commission')) {
        if (newValue < 0.014 || newValue > 0.026) return;
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

  return (
    <div className="flex flex-col rounded-lg bg-[#2d3748]/50 p-4 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-[#94a3b8] text-lg flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </Label>
        
        <Input
          type="number"
          value={value}
          onChange={onChange}
          onKeyDown={handleInputStep}
          step={currentStepSize}
          className="w-32 bg-[#374151] border-0 text-white text-right"
        />
      </div>
      
      <select
        value={value.toString()}
        onChange={handleSelectChange}
        className="md:hidden w-full bg-[#374151] border-0 text-white text-right appearance-none px-3 py-2 rounded-md mt-2"
        size={4}
        style={{
          height: '120px', // Fixed height for 4 items
          fontSize: '16px', // Prevent iOS zoom
          WebkitAppearance: 'none', // Remove default styling
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {pickerValues.map(({ value: val, index }) => (
          <option 
            key={`${val}-${index}`} 
            value={val}
            className="py-2 px-3 hover:bg-[#4a5568]"
          >
            {val}
          </option>
        ))}
      </select>

      <style jsx>{`
        select::-webkit-scrollbar {
          display: none;
        }
        
        select option {
          padding: 8px 12px;
          min-height: 30px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default InputField;