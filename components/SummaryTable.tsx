
import React, { useMemo } from 'react';
import { SimulationParams, SimulationResults, SimulationPoint } from '../types';
import { calculateSinglePoint } from '../services/simulationService';

interface SummaryTableProps {
    results: { control: SimulationResults; test: SimulationResults } | null;
    isLoading: boolean;
    isComparative: boolean;
    tableAVAs: [number, number, number, number];
    params: { control: SimulationParams; test: SimulationParams };
}

const SummaryTable: React.FC<SummaryTableProps> = ({ results, isLoading, isComparative, tableAVAs, params }) => {
    const summaryData = useMemo(() => {
        if (!params) return null;

        // Calculate exact points instead of searching for closest indices
        const calculatePointsFor = (p: SimulationParams, targets: number[]) => {
           return targets.map(target => calculateSinglePoint(target, p));
        };

        const points = {
            control: calculatePointsFor(params.control, tableAVAs),
            test: calculatePointsFor(params.test, tableAVAs),
        };

        const metrics = [
            { key: 'A_eff', label: 'Área Efetiva de Fluxo (Aeff)', unit: 'cm²' },
            { key: 'V_syst', label: 'Fluxo Sistólico', unit: 'mL/s' },
            { key: 'cardiac_output', label: 'Débito Cardíaco', unit: 'L/min' },
            { key: 'Delta_P_aortic_mmHg', label: 'Queda de Pressão Aórtica', unit: 'mmHg' },
            { key: 'W_Heart', label: 'Trabalho do Coração', unit: 'W' },
            { key: 'M_Heart', label: 'Metabolismo', unit: 'W' },
            { key: 'B_M', label: 'Exergia do Metabolismo', unit: 'W' },
            { key: 'Delta_B_blood', label: 'Exergia do Sangue', unit: 'W' },
            { key: 'B_d_valves', label: 'Exergia Destruída (Válvulas)', unit: 'W' },
            { key: 'B_d_heart', label: 'Exergia Destruída (Total)', unit: 'W' },
            { key: 'eta1', label: 'Eficiência η₁', unit: '%' },
            { key: 'eta2', label: 'Eficiência η₂', unit: '%' },
        ];
        
        const conditionLabels = ['Estenose Severa', 'Estenose Moderada', 'Estenose Leve', 'Saudável'];
        const conditionTitles = tableAVAs.map((ava, index) => `${conditionLabels[index]} (AVA = ${ava.toFixed(2)} cm²)`);


        return { points, metrics, conditionTitles };

    }, [tableAVAs, params]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                 <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }
    
    if (!summaryData || !params) {
        return (
             <div className="flex justify-center items-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <p>Nenhum dado para exibir. Execute a simulação.</p>
            </div>
        );
    }

    const { points, metrics, conditionTitles } = summaryData;
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Tabela {isComparative ? "Comparativa " : ""}de Resultados</h2>
            <table className="w-full min-w-max text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th scope="col" rowSpan={isComparative ? 2 : 1} className="px-6 py-3 align-middle border-b border-gray-200 dark:border-gray-600">Parâmetro Principal</th>
                        {conditionTitles.map(title => (
                            <th key={title} scope="col" colSpan={isComparative ? 2 : 1} className="px-6 py-3 text-center border-b border-l border-gray-200 dark:border-gray-600">
                                {title}
                            </th>
                        ))}
                    </tr>
                    {isComparative && (
                         <tr>
                            {conditionTitles.map(title => (
                                <React.Fragment key={`${title}-sub`}>
                                    <th scope="col" className="px-3 py-2 text-center font-semibold bg-blue-50 dark:bg-blue-900/20 border-l border-gray-200 dark:border-gray-600">Controle</th>
                                    <th scope="col" className="px-3 py-2 text-center font-semibold bg-orange-50 dark:bg-orange-900/20">Teste</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    <tr className="bg-gray-100 dark:bg-gray-900/50 border-b dark:border-gray-700 font-semibold">
                         <th scope="row" className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Frequência Cardíaca
                            <span className="text-xs text-gray-500 ml-1">(bpm)</span>
                        </th>
                        {conditionTitles.map((title) => (
                            <React.Fragment key={`${title}-hr`}>
                                <td className="px-6 py-4 text-center border-l border-gray-200 dark:border-gray-700">
                                    {params.control.hr}
                                </td>
                                {isComparative && (
                                    <td className="px-6 py-4 text-center">
                                        {params.test.hr}
                                    </td>
                                )}
                            </React.Fragment>
                        ))}
                    </tr>
                     <tr className="bg-gray-100 dark:bg-gray-900/50 border-b dark:border-gray-700 font-semibold">
                         <th scope="row" className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Temperatura Ref.
                            <span className="text-xs text-gray-500 ml-1">(°C)</span>
                        </th>
                        {conditionTitles.map((title) => (
                            <React.Fragment key={`${title}-temp`}>
                                <td className="px-6 py-4 text-center border-l border-gray-200 dark:border-gray-700">
                                    {params.control.temperature.toFixed(1)}
                                </td>
                                {isComparative && (
                                    <td className="px-6 py-4 text-center">
                                        {params.test.temperature.toFixed(1)}
                                    </td>
                                )}
                            </React.Fragment>
                        ))}
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-900/50 border-b dark:border-gray-700 font-semibold">
                         <th scope="row" className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Coeficiente de Descarga
                            <span className="text-xs text-gray-500 ml-1">(Cd)</span>
                        </th>
                        {conditionTitles.map((title) => (
                            <React.Fragment key={`${title}-cd`}>
                                <td className="px-6 py-4 text-center border-l border-gray-200 dark:border-gray-700">
                                    {params.control.c_d.toFixed(2)}
                                </td>
                                {isComparative && (
                                    <td className="px-6 py-4 text-center">
                                        {params.test.c_d.toFixed(2)}
                                    </td>
                                )}
                            </React.Fragment>
                        ))}
                    </tr>
                    {metrics.map(metric => (
                        <tr key={metric.key} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                {metric.label}
                                <span className="text-xs text-gray-500 ml-1">({metric.unit})</span>
                            </th>
                            {conditionTitles.map((title, index) => {
                                // Use exact calculated point
                                const controlValue = (points.control[index][metric.key as keyof SimulationPoint] as number).toFixed(2);
                                const testValue = (points.test[index][metric.key as keyof SimulationPoint] as number).toFixed(2);
                                
                                return (
                                    <React.Fragment key={title}>
                                        <td className="px-6 py-4 text-center border-l border-gray-200 dark:border-gray-700">
                                            {controlValue}
                                        </td>
                                        {isComparative && (
                                            <td className="px-6 py-4 text-center">
                                                {testValue}
                                            </td>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SummaryTable;
