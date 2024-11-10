// src/types.ts

// State types
export interface CalculatorValues {
    spread: number;
    premium: number;
    commission: number;
    dte: number;
    expectedARORC: number;
  }
  
  export interface CalculatedValues {
    netCredit: number;
    riskCapital: number;
    rorc: number;
    multiple: number;
    arorc: number;
    targetCredit: number;
  }
  
  // Component prop types
  export interface InputFieldProps {
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: JSX.Element;
  }
  
  export interface OutputFieldProps {
    label: string;
    value: string;
    color?: string;
  }
  