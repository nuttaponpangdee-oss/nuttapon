
import React, { useState, useMemo } from 'react';
import { K_FACTOR_GROUPS } from './constants';
import KCalculator from './components/KCalculator';

const App: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(K_FACTOR_GROUPS[0].id);
  const [selectedKId, setSelectedKId] = useState<string>(K_FACTOR_GROUPS[0].factors[0].id);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    const firstFactorInGroup = K_FACTOR_GROUPS.find(g => g.id === groupId)?.factors[0];
    if (firstFactorInGroup) {
      setSelectedKId(firstFactorInGroup.id);
    }
  };

  const selectedGroup = useMemo(() => {
    return K_FACTOR_GROUPS.find(g => g.id === selectedGroupId) || K_FACTOR_GROUPS[0];
  }, [selectedGroupId]);

  const selectedKDetail = useMemo(() => {
    // Search in the selected group first for performance
    const factorInGroup = selectedGroup.factors.find(f => f.id === selectedKId);
    if (factorInGroup) return factorInGroup;

    // Fallback to searching all groups if not found (e.g., initial state mismatch)
    for (const group of K_FACTOR_GROUPS) {
        const factor = group.factors.find(f => f.id === selectedKId);
        if (factor) {
            return factor;
        }
    }
    
    // Absolute fallback to the very first factor
    return K_FACTOR_GROUPS[0].factors[0];
  }, [selectedKId, selectedGroup]);


  return (
    <div className="min-h-screen font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            โปรแกรมคำนวณค่า K
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            เครื่องมือช่วยคำนวณค่า K (Escalation Factor) สำหรับงานก่อสร้างภาครัฐ
          </p>
        </header>

        <main>
          <div className="mb-6 bg-slate-200/60 rounded-2xl p-4 shadow-inner">
             <div className="mb-4">
                <label className="block text-center text-sm font-semibold text-slate-700 mb-3">1. เลือกหมวดหมู่งานหลัก</label>
                <div className="flex flex-wrap justify-center gap-2">
                {K_FACTOR_GROUPS.map(group => (
                    <button
                    key={group.id}
                    onClick={() => handleGroupSelect(group.id)}
                    className={`px-3 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 focus:ring-indigo-500 ${
                        selectedGroupId === group.id
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-white text-slate-700 hover:bg-white/80 shadow-sm'
                    }`}
                    >
                    {group.id}: {group.name}
                    </button>
                ))}
                </div>
            </div>
             {selectedGroup.factors.length > 1 && (
                <div className="border-t border-slate-300 pt-4">
                    <label className="block text-center text-sm font-semibold text-slate-700 mb-3">2. เลือกประเภทงานย่อย</label>
                    <div className="flex flex-wrap justify-center gap-2">
                    {selectedGroup.factors.map(factor => (
                        <button
                        key={factor.id}
                        onClick={() => setSelectedKId(factor.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 focus:ring-indigo-500 ${
                            selectedKId === factor.id
                            ? 'bg-white text-indigo-700 shadow'
                            : 'bg-transparent text-slate-600 hover:bg-white/60'
                        }`}
                        >
                        {factor.id}
                        </button>
                    ))}
                    </div>
                </div>
             )}
          </div>
          
          <KCalculator kDetail={selectedKDetail} />
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>
            สูตรการคำนวณอ้างอิงตามมติคณะรัฐมนตรี
          </p>
           <p>
            ขับเคลื่อนด้วย AI จาก Google Gemini
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
