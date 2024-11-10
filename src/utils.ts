// src/utils.ts

export const formatNumber = (num: number): string => {
    return num.toFixed(3).replace(/\.?0+$/, '');
  };
  