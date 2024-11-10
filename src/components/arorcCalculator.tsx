// src/Calculator1.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Calendar, Calculator, Target } from 'lucide-react';
import InputField from '@/components/InputField';
import OutputField from '@/components/OutputField';
import { useCalculator } from '@/hooks/useCalculator';
import { formatNumber } from '@/utils';

export default function Calculator1() {
  const { values, calculated, handleInputChange } = useCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4 text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-[#1e293b]/50 border-0 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-white font-light flex items-center justify-center">
              <Calculator className="mr-2 h-8 w-8 text-[#a5b4fc]" />
              ARORC Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <InputField
                label="Spread, Strike Price (ROP), Cost Basis (ROC): S ="
                value={values.spread}
                onChange={(e) => handleInputChange('spread', e.target.value)}
                icon={<DollarSign className="h-5 w-5 text-[#a5b4fc]" />}
              />
              <InputField
                label="Premium Collected: Prem. ="
                value={values.premium}
                onChange={(e) => handleInputChange('premium', e.target.value)}
                icon={<DollarSign className="h-5 w-5 text-[#a5b4fc]" />}
              />
              <InputField
                label="Commission: C ="
                value={values.commission}
                onChange={(e) => handleInputChange('commission', e.target.value)}
                icon={<DollarSign className="h-5 w-5 text-[#a5b4fc]" />}
              />
              <InputField
                label="Days until Expiration: DTE ="
                value={values.dte}
                onChange={(e) => handleInputChange('dte', e.target.value)}
                icon={<Calendar className="h-5 w-5 text-[#a5b4fc]" />}
              />
              <OutputField label="ARORC =" value={`${formatNumber(calculated.arorc)}%`} color="text-[#f97316]"/>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b]/50 border-0 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-white font-light flex items-center justify-center">
              <Target className="mr-2 h-8 w-8 text-[#f97316]" />
              Premium Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
                label="Expected ARORC ="
                value={values.expectedARORC}
                onChange={(e) => handleInputChange('expectedARORC', e.target.value)}
                icon={<Percent className="h-5 w-5 text-[#a5b4fc]" />}
              />
            <OutputField
              label="Target Credit (Premium) ="
              value={formatNumber(calculated.targetCredit)}
              color="text-[#f97316]"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b]/50 border-0 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-white font-light flex items-center justify-center">
              Sum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <OutputField label="Net Credit: NC =" value={formatNumber(calculated.netCredit)} />
            <OutputField label="Risk Capital: RC =" value={formatNumber(calculated.riskCapital)} />
            <OutputField label="Return on Risk Capital: RORC =" value={`${formatNumber(calculated.rorc)}%`} />
            <OutputField label="Multiple: M =" value={formatNumber(calculated.multiple)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
