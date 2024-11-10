// src/hooks/useCalculator.ts

import { useState, useEffect } from 'react';
import { CalculatorValues, CalculatedValues } from '../types';

export const useCalculator = () => {
  const [values, setValues] = useState<CalculatorValues>({
    spread: 5.00,
    premium: 0.40,
    commission: 0.025,
    dte: 29,
    expectedARORC: 48,
  });

  const [calculated, setCalculated] = useState<CalculatedValues>({
    netCredit: 0,
    riskCapital: 0,
    rorc: 0,
    multiple: 0,
    arorc: 0,
    targetCredit: 0,
  });

  useEffect(() => {
    const netCredit = values.premium - values.commission;
    const riskCapital = values.spread - netCredit;
    const rorc = (netCredit / riskCapital) * 100;
    const multiple = parseFloat((365 / values.dte).toFixed(1));
    const arorc = parseFloat((rorc * multiple).toFixed(2));

    const targetRorc = values.expectedARORC / multiple;
    const targetCredit = parseFloat(((targetRorc * values.spread) / (100 + targetRorc)).toFixed(2));

    setCalculated({
      netCredit,
      riskCapital,
      rorc,
      multiple,
      arorc,
      targetCredit,
    });
  }, [values]);

  const handleInputChange = (field: keyof CalculatorValues, value: string) => {
    const sanitizedValue = value.replace(',', '.');
    setValues((prev) => ({
      ...prev,
      [field]: parseFloat(sanitizedValue) || 0,
    }));
  };

  return { values, calculated, handleInputChange };
};
