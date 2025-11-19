
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
            case 1: // Moderada (1.0, 1.5]
                finalValue = Math.max(1.01, Math.min(1.5, value));
                break;
            case 2: // Leve (1.5, 2.0]
                finalValue = Math.max(1.51, Math.min(2.0, value));
                break;
            case 3: // Saudável (2.0, 5.0]
                finalValue = Math.max(2.01, Math.min(5.0, value));
                break;
        }

        setTableAVAs(prev => {
            const newAVAs = [...prev];
            newAVAs[index] = finalValue;
            return newAVAs as [number, number, number, number];
        });
    };

    const activeParams = params[activeTab];
    const commonParams = params.control; // Os parâmetros comuns são os mesmos para ambos
    const avaLabels = ['Estenose Severa', 'Estenose Moderada', 'Estenose Leve', 'Saudável'];

    const baseTabClass = "flex-1 py-2 px-4 text-sm font-medium text-center rounded-t-md cursor-pointer focus:outline-none transition-colors";
    const activeTabClass = "bg-white dark:bg-gray-800 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400";
    const inactiveTabClass = "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600";

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg sticky top-4">
            <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 px-6 pt-6">
                PARÂMETROS DA SIMULAÇÃO
            </h2>
            
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <InputField label="Área Mínima da Válvula" id="minAVA" value={commonParams.minAVA} unit="cm²" min={0.1} max={5} step={0.1} onChange={handleCommonParamChange} />
                    <InputField label="Área Máxima da Válvula" id="maxAVA" value={commonParams.maxAVA} unit="cm²" min={0.1} max={5} step={0.1} onChange={handleCommonParamChange} />
                </div>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px px-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('control')} className={`${baseTabClass} ${activeTab === 'control' ? activeTabClass : inactiveTabClass}`}>
                        Controle
                    </button>
                    <button onClick={() => setActiveTab('test')} className={`${baseTabClass} ${activeTab === 'test' ? activeTabClass : inactiveTabClass}`}>
                        Teste
                    </button>
                </nav>
            </div>

            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <InputField label="Frequência Cardíaca" id="hr" value={activeParams.hr} unit="bpm" min={40} max={120} step={1} onChange={handleTabParamChange} />
                    <InputField label="Temperatura de Referência" id="temperature" value={activeParams.temperature} unit="°C" min={20} max={45} step={0.1} onChange={handleTabParamChange} />
                    <InputField label="Coeficiente de Descarga (Cd)" id="c_d" value={activeParams.c_d} unit="adimensional" min={0.6} max={1.0} step={0.01} onChange={handleTabParamChange} />
                </div>
            </div>

            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={onRunSimulation}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Simulando...
                        </>
                    ) : (
                        'EXECUTAR SIMULAÇÃO'
                    )}
                </button>
            </div>

            <div className="p-6">
                <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    VALORES DE AVA PARA ANÁLISE
                </h3>
                <div className="space-y-4">
                    {tableAVAs.map((ava, index) => (
                        <div key={index}>
                            <label htmlFor={`table-ava-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {avaLabels[index]} <span className="text-xs text-gray-500">(cm²)</span>
                            </label>
                            <input
                                type="number"
                                id={`table-ava-${index}`}
                                value={ava}
                                step={0.1}
                                onChange={(e) => handleTableAVAChange(index, parseFloat(e.target.value))}
                                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
