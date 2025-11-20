
import React, { useState } from 'react';
import { SimulationParams } from '../types';

interface ControlPanelProps {
    params: { control: SimulationParams; test: SimulationParams };
    setParams: React.Dispatch<React.SetStateAction<{ control: SimulationParams; test: SimulationParams }>>;
    tableAVAs: [number, number, number, number];
    setTableAVAs: React.Dispatch<React.SetStateAction<[number, number, number, number]>>;
    onRunSimulation: () => void;
    isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: keyof SimulationParams; value: number; unit: string; min: number; max: number; step: number; onChange: (id: keyof SimulationParams, value: number) => void }> = ({ label, id, value, unit, min, max, step, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} <span className="text-xs text-gray-500">({unit})</span>
        </label>
        <input
            type="number"
            id={id}
            name={id}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(id, parseFloat(e.target.value))}
            className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams, tableAVAs, setTableAVAs, onRunSimulation, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'control' | 'test'>('control');

    const handleTabParamChange = (id: keyof SimulationParams, value: number) => {
        setParams(prev => {
            if (activeTab === 'control') {
                const newControlParams = { ...prev.control, [id]: value };
                return {
                    control: newControlParams,
                    test: newControlParams, // Sync test with the new control
                };
            }
            // activeTab === 'test'
            return {
                ...prev,
                test: { ...prev.test, [id]: value },
            };
        });
    };
    
    const handleCommonParamChange = (id: keyof SimulationParams, value: number) => {
        setParams(prev => {
            const newControlParams = { ...prev.control, [id]: value };
            return {
                control: newControlParams,
                test: newControlParams, // Sync test with the new control
            };
        });
    };

    const handleTableAVAChange = (index: number, value: number) => {
        if (isNaN(value)) return;

        let finalValue = value;
        const { minAVA } = params.control;

        switch (index) {
            case 0: // Severa [minAVA, 1.0]
                finalValue = Math.max(minAVA, Math.min(1.0, value));
                break;
            case 1: // Moderada [1.0, 1.5]
                finalValue = Math.max(1.0, Math.min(1.5, value));
                break;
            case 2: // Leve [1.5, 2.0]
                finalValue = Math.max(1.5, Math.min(2.0, value));
                break;
            case 3: // Saudável [2.0, maxAVA]
                finalValue = Math.max(2.0, value); // Sem limite superior rígido aqui além da lógica
                break;
        }
        
        setTableAVAs(prev => {
            const newAVAs = [...prev] as [number, number, number, number];
            newAVAs[index] = finalValue;
            return newAVAs;
        });
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                PAINEL DE CONTROLE
            </h2>
            <hr className="border-gray-200 dark:border-gray-700 mb-6" />
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8">
                {/* Seção 1: Parâmetros Globais (Afetam ambos) */}
                <div>
                     <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">
                        VALORES DE AVA PARA SIMULAÇÃO
                    </h3>
                    <div className="space-y-4 p-4 rounded-md border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-900/10">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="AVA Mínima" id="minAVA" value={params.control.minAVA} unit="cm²" min={0.1} max={5} step={0.1} onChange={handleCommonParamChange} />
                            <InputField label="AVA Máxima" id="maxAVA" value={params.control.maxAVA} unit="cm²" min={0.5} max={6} step={0.1} onChange={handleCommonParamChange} />
                        </div>
                         {/* Removed Steps Input as requested */}
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Seção 2: Parâmetros Comparativos */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">
                        PARÂMETROS FISIOLÓGICOS
                    </h3>
                    
                    {/* Abas para Controle vs Teste */}
                    <div className="flex mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'control' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            onClick={() => setActiveTab('control')}
                        >
                            Controle (Padrão)
                        </button>
                        <button
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'test' ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            onClick={() => setActiveTab('test')}
                        >
                            Teste (Comparativo)
                        </button>
                    </div>

                    <div className={`space-y-4 p-3 rounded-md border ${activeTab === 'control' ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10' : 'border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10'}`}>
                         <InputField 
                            label="Frequência Cardíaca" 
                            id="hr" 
                            value={activeTab === 'control' ? params.control.hr : params.test.hr} 
                            unit="bpm" 
                            min={40} 
                            max={200} 
                            step={1} 
                            onChange={handleTabParamChange} 
                        />
                        <InputField 
                            label="Temp. Referência (T₀)" 
                            id="temperature" 
                            value={activeTab === 'control' ? params.control.temperature : params.test.temperature} 
                            unit="°C" 
                            min={30} 
                            max={42} 
                            step={0.1} 
                            onChange={handleTabParamChange} 
                        />
                         <InputField 
                            label="Coef. de Descarga (Cd)" 
                            id="c_d" 
                            value={activeTab === 'control' ? params.control.c_d : params.test.c_d} 
                            unit="adimensional" 
                            min={0.5} 
                            max={1.0} 
                            step={0.01} 
                            onChange={handleTabParamChange} 
                        />
                    </div>
                     <p className="text-xs text-gray-500 mt-2 italic">
                        * Alterações no modo "Controle" são replicadas no modo "Teste" para facilitar a comparação inicial.
                    </p>
                </div>

                 <hr className="border-gray-200 dark:border-gray-700" />

                 {/* Seção 3: Pontos de Interesse na Tabela + Botão */}
                 <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">
                        VALORES DE AVA PARA ANÁLISE
                    </h3>
                    
                    <div className="p-4 mb-6 rounded-md border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-900/10">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                             <div>
                                <label className="block text-xs text-gray-500">Severa</label>
                                <input type="number" value={tableAVAs[0]} step={0.1} onChange={(e) => handleTableAVAChange(0, parseFloat(e.target.value))} className="w-full border rounded px-2 py-1 text-xs" />
                             </div>
                             <div>
                                <label className="block text-xs text-gray-500">Moderada</label>
                                <input type="number" value={tableAVAs[1]} step={0.1} onChange={(e) => handleTableAVAChange(1, parseFloat(e.target.value))} className="w-full border rounded px-2 py-1 text-xs" />
                             </div>
                             <div>
                                <label className="block text-xs text-gray-500">Leve</label>
                                <input type="number" value={tableAVAs[2]} step={0.1} onChange={(e) => handleTableAVAChange(2, parseFloat(e.target.value))} className="w-full border rounded px-2 py-1 text-xs" />
                             </div>
                             <div>
                                <label className="block text-xs text-gray-500">Saudável</label>
                                <input type="number" value={tableAVAs[3]} step={0.1} onChange={(e) => handleTableAVAChange(3, parseFloat(e.target.value))} className="w-full border rounded px-2 py-1 text-xs" />
                             </div>
                        </div>
                    </div>

                    <button
                        onClick={onRunSimulation}
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white uppercase tracking-wide ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'} transition-colors`}
                    >
                        {isLoading ? 'SIMULANDO...' : 'EXECUTAR SIMULAÇÃO'}
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default ControlPanel;
