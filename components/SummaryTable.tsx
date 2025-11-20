
import React, { useMemo } from 'react';
import { SimulationParams, SimulationResults, SimulationPoint } from '../types';
import { calculateSinglePoint } from '../services/simulationService';
import { useLanguage } from '../contexts/LanguageContext';

interface SummaryTableProps {
    results: { control: SimulationResults; test: SimulationResults } | null;
    isLoading: boolean;
    isComparative: boolean;
    tableAVAs: [number, number, number, number];
    params: { control: SimulationParams; test: SimulationParams };
}

const SummaryTable: React.FC<SummaryTableProps> = ({ results, isLoading, isComparative, tableAVAs, params }) => {
    const { language } = useLanguage();

    const t = {
        pt: {
            title: "Tabela de Resultados",
            compTitle: "Tabela Comparativa de Resultados",
            param: "Parâmetro Principal",
            control: "Controle",
            test: "Teste",
            severe: "Estenose Severa",
            moderate: "Estenose Moderada",
            mild: "Estenose Leve",
            healthy: "Saudável",
            hr: "Frequência Cardíaca",
            tempRef: "Temperatura Ref.",
            cd: "Coeficiente de Descarga",
            labels: {
                A_eff: "Área Efetiva de Fluxo (Aeff)",
                V_syst: "Fluxo Sistólico",
                cardiac_output: "Débito Cardíaco",
                Delta_P_aortic_mmHg: "Queda de Pressão Aórtica",
                W_Heart: "Trabalho do Coração",
                M_Heart: "Metabolismo",
                B_M: "Exergia do Metabolismo",
                Delta_B_blood: "Exergia do Sangue",
                B_d_valves: "Exergia Destruída (Válvulas)",
                B_d_heart: "Exergia Destruída (Total)",
                eta1: "Eficiência η₁",
                eta2: "Eficiência η₂"
            },
            noData: "Nenhum dado para exibir. Execute a simulação."
        },
        en: {
            title: "Results Table",
            compTitle: "Comparative Results Table",
            param: "Main Parameter",
            control: "Control",
            test: "Test",
            severe: "Severe Stenosis",
            moderate: "Moderate Stenosis",
            mild: "Mild Stenosis",
            healthy: "Healthy",
            hr: "Heart Rate",
            tempRef: "Ref. Temperature",
            cd: "Discharge Coefficient",
            labels: {
                A_eff: "Effective Flow Area (Aeff)",
                V_syst: "Systolic Flow",
                cardiac_output: "Cardiac Output",
                Delta_P_aortic_mmHg: "Aortic Pressure Drop",
                W_Heart: "Heart Work",
                M_Heart: "Metabolism",
                B_M: "Metabolic Exergy",
                Delta_B_blood: "Blood Exergy",
                B_d_valves: "Destroyed Exergy (Valves)",
                B_d_heart: "Destroyed Exergy (Total)",
                eta1: "Efficiency η₁",
                eta2: "Efficiency η₂"
            },
            noData: "No data to display. Run the simulation."
        }
    }[language];

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
            { key: 'A_eff', label: t.labels.A_eff, unit: 'cm²' },
            { key: 'V_syst', label: t.labels.V_syst, unit: 'mL/s' },
            { key: 'cardiac_output', label: t.labels.cardiac_output, unit: 'L/min' },
            { key: 'Delta_P_aortic_mmHg', label: t.labels.Delta_P_aortic_mmHg, unit: 'mmHg' },
            { key: 'W_Heart', label: t.labels.W_Heart, unit: 'W' },
            { key: 'M_Heart', label: t.labels.M_Heart, unit: 'W' },
            { key: 'B_M', label: t.labels.B_M, unit: 'W' },
            { key: 'Delta_B_blood', label: t.labels.Delta_B_blood, unit: 'W' },
            { key: 'B_d_valves', label: t.labels.B_d_valves, unit: 'W' },
            { key: 'B_d_heart', label: t.labels.B_d_heart, unit: 'W' },
            { key: 'eta1', label: t.labels.eta1, unit: '%' },
            { key: 'eta2', label: t.labels.eta2, unit: '%' },
        ];
        
        const conditionLabels = [t.severe, t.moderate, t.mild, t.healthy];
        const conditionTitles = tableAVAs.map((ava, index) => `${conditionLabels[index]} (AVA = ${ava.toFixed(2)} cm²)`);


        return { points, metrics, conditionTitles };

    }, [tableAVAs, params, t]);

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
                <p>{t.noData}</p>
            </div>
        );
    }

    const { points, metrics, conditionTitles } = summaryData;
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">{isComparative ? t.compTitle : t.title}</h2>
            <table className="w-full min-w-max text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th scope="col" rowSpan={isComparative ? 2 : 1} className="px-6 py-3 align-middle border-b border-gray-200 dark:border-gray-600">{t.param}</th>
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
                                    <th scope="col" className="px-3 py-2 text-center font-semibold bg-blue-50 dark:bg-blue-900/20 border-l border-gray-200 dark:border-gray-600">{t.control}</th>
                                    <th scope="col" className="px-3 py-2 text-center font-semibold bg-orange-50 dark:bg-orange-900/20">{t.test}</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    <tr className="bg-gray-100 dark:bg-gray-900/50 border-b dark:border-gray-700 font-semibold">
                         <th scope="row" className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {t.hr}
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
                            {t.tempRef}
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
                            {t.cd}
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
