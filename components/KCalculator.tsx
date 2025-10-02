import React, { useState, useCallback } from 'react';
import { KFactorDetail } from '../types';
import { explainKValue } from '../services/geminiService';
import Spinner from './Spinner';

interface KCalculatorProps {
  kDetail: KFactorDetail;
}

const KCalculator: React.FC<KCalculatorProps> = ({ kDetail }) => {
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleCalculate = useCallback(async () => {
    setError(null);
    setResult(null);
    setExplanation('');

    let calculatedK = kDetail.constant;
    
    for (const variable of kDetail.variables) {
      const keyBase = `${variable.key}o`;
      const keyCurrent = `${variable.key}t`;
      
      const valBase = parseFloat(inputs[keyBase]);
      const valCurrent = parseFloat(inputs[keyCurrent]);

      if (isNaN(valBase) || isNaN(valCurrent) || valBase <= 0) {
        setError(`กรุณากรอกข้อมูลดัชนี '${variable.name}' ให้ถูกต้อง (ต้องเป็นตัวเลขและเดือนฐานต้องไม่เป็นศูนย์)`);
        return;
      }
      
      const ratio = valCurrent / valBase;
      calculatedK += kDetail.coefficients[variable.key] * ratio;
    }
    
    setResult(calculatedK);
    setIsLoading(true);
    
    const aiExplanation = await explainKValue(calculatedK);
    setExplanation(aiExplanation);
    
    setIsLoading(false);
  }, [inputs, kDetail]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full transition-all duration-300 ease-in-out">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{kDetail.id}: {kDetail.name}</h2>
      <p className="text-slate-600 mb-6">{kDetail.description}</p>
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-slate-700 mb-2">สูตรการคำนวณ:</h3>
        <p className="font-mono text-indigo-600 bg-indigo-50 p-3 rounded-md text-center text-sm md:text-base">{kDetail.formulaString}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
        {kDetail.variables.map(variable => (
          <div key={variable.key} className="border border-slate-200 rounded-lg p-4">
            <p className="font-semibold text-slate-700 mb-3">{variable.name} <span className="text-slate-400 font-normal">({variable.key})</span></p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${variable.key}o`} className="block text-sm font-medium text-slate-500">เดือนฐาน ({variable.key}o)</label>
                <input
                  type="number"
                  id={`${variable.key}o`}
                  step="any"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-slate-800 text-white"
                  placeholder="เช่น 125.4"
                  value={inputs[`${variable.key}o`] || ''}
                  onChange={(e) => handleInputChange(`${variable.key}o`, e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`${variable.key}t`} className="block text-sm font-medium text-slate-500">เดือนที่ส่งงาน ({variable.key}t)</label>
                <input
                  type="number"
                  id={`${variable.key}t`}
                  step="any"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-slate-800 text-white"
                  placeholder="เช่น 128.9"
                  value={inputs[`${variable.key}t`] || ''}
                  onChange={(e) => handleInputChange(`${variable.key}t`, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      
      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 text-lg"
      >
        คำนวณค่า {kDetail.id}
      </button>

      {(result !== null || isLoading) && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">ผลการคำนวณ</h3>
          {result !== null && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
              <p className="text-lg text-green-800">ค่า {kDetail.id} คือ</p>
              <p className="text-4xl font-extrabold text-green-600 tracking-tight my-2">{result.toFixed(4)}</p>
            </div>
          )}
          
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
             <h4 className="font-semibold text-sky-800 mb-2">คำอธิบายผลโดย AI</h4>
            {isLoading ? <Spinner /> : <p className="text-sky-700 whitespace-pre-wrap">{explanation}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default KCalculator;
