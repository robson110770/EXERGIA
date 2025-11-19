import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { SimulationResults } from '../types';
import ChartCard from './ChartCard';

interface ResultChartsProps {
    results: { control: SimulationResults; test: SimulationResults } | null;
    isLoading: boolean;
    isComparative: boolean;
}

const ResultCharts: React.FC<ResultChartsProps> = ({ results, isLoading, isComparative }) => {
    const { chartData, xAxisTicks, xAxisDomain } = useMemo(() => {
        if (!results) {
            return { chartData: null, xAxisTicks: [], xAxisDomain: [0, 1] };
        }
        const { control, test } = results;

        const data = control.AVA.map((ava, index) => ({
            AVA: parseFloat(ava.toFixed(2)),
            V_syst_control: control.V_syst[index],
            V_syst_test: test.V_syst[index],
            Delta_P_aortic_mmHg_control: control.Delta_P_aortic_mmHg[index],
            Delta_P_aortic_mmHg_test: test.Delta_P_aortic_mmHg[index],
            M_Heart_control: control.M_Heart[index],
            M_Heart_test: test.M_Heart[index],
            W_Heart_control: control.W_Heart[index],
            W_Heart_test: test.W_Heart[index],
            Delta_B_blood_control: control.Delta_B_blood[index],
            Delta_B_blood_test: test.Delta_B_blood[index],
            B_d_valves_control: control.B_d_valves[index],
            B_d_valves_test: test.B_d_valves[index],
            B_d_heart_control: control.B_d_heart[index],
            B_d_heart_test: test.B_d_heart[index],
            eta1_control: control.eta1[index],
            eta1_test: test.eta1[index],
            eta2_control: control.eta2[index],
            eta2_test: test.eta2[index],
        }));

        const minAVA = control.AVA[0];
        const maxAVA = control.AVA[control.AVA.length - 1];
        
        const ticks = [];
        const step = 0.5;
        // Start from the first multiple of step that is >= minAVA
        const startTickValue = Math.ceil(minAVA / step) * step;
        
        for (let i = startTickValue; i <= maxAVA; i += step) {
             ticks.push(parseFloat(i.toFixed(1)));
        }
        
        return { chartData: data, xAxisTicks: ticks, xAxisDomain: [minAVA, maxAVA] };
    }, [results]);

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

    if (!chartData) {
        return (
             <div className="flex justify-center items-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <p>Nenhum dado para exibir. Execute a simulação.</p>
            </div>
        );
    }

    const xAxisProps = {
        dataKey: "AVA",
        height: 40,
        label: { value: 'Área Válvula Aórtica (cm²)', position: 'insideBottom' },
        tick: { fontSize: 12 },
        type: "number" as const,
        domain: xAxisDomain,
        ticks: xAxisTicks,
    };

    const StenosisReferences = () => (
        <>
            {/* Shaded Areas */}
            <ReferenceArea x1={xAxisDomain[0]} x2={1.0} fill="#ef4444" fillOpacity={0.05} ifOverflow="visible" />
            <ReferenceArea x1={1.0} x2={1.5} fill="#eab308" fillOpacity={0.05} ifOverflow="visible" />
            <ReferenceArea x1={1.5} x2={2.0} fill="#10b981" fillOpacity={0.05} ifOverflow="visible" />

            {/* Dotted Lines */}
            <ReferenceLine x={1.0} stroke="gray" strokeDasharray="3 3" strokeOpacity={0.8} />
            <ReferenceLine x={1.5} stroke="gray" strokeDasharray="3 3" strokeOpacity={0.8} />
            <ReferenceLine x={2.0} stroke="gray" strokeDasharray="3 3" strokeOpacity={0.8} />
        </>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="(a) Fluxo Sistólico">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis label={{ value: 'mL/s', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="V_syst_control" name="Controle" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="V_syst_test" name="Teste" stroke="#f97316" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="(b) Queda de Pressão Aórtica">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="Delta_P_aortic_mmHg_control" name="Controle" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="Delta_P_aortic_mmHg_test" name="Teste" stroke="#f97316" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="(c) Metabolismo e Trabalho">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps}/>
                        <YAxis label={{ value: 'Potência (W)', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <StenosisReferences />
                        <Line type="monotone" dataKey="M_Heart_control" name={isComparative ? "Metabolismo (Controle)" : "Metabolismo"} stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="W_Heart_control" name={isComparative ? "Trabalho (Controle)" : "Trabalho"} stroke="#a855f7" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="M_Heart_test" name="Metabolismo (Teste)" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                        {isComparative && <Line type="monotone" dataKey="W_Heart_test" name="Trabalho (Teste)" stroke="#ec4899" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title="(d) Análise de Exergia (W)">
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis label={{ value: 'Exergia (W)', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}}/>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <StenosisReferences />
                        <Line type="monotone" dataKey="Delta_B_blood_control" name={isComparative ? "Sangue (Controle)" : "Ex. Sangue"} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B_d_valves_control" name={isComparative ? "Destruída (Controle)" : "Ex. Destruída"} stroke="#ef4444" strokeWidth={2} dot={false} />

                        {isComparative && <Line type="monotone" dataKey="Delta_B_blood_test" name="Sangue (Teste)" stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                        {isComparative && <Line type="monotone" dataKey="B_d_valves_test" name="Destruída (Teste)" stroke="#eab308" strokeDasharray="5 5" strokeWidth={2} dot={false} />}

                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="(e) Eficiência Exergética η₁">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis domain={[0, 'dataMax + 2']} label={{ value: 'Eficiência (%)', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} tickFormatter={(value) => `${Math.round(value)}`} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="eta1_control" name={isComparative ? "η₁ (Controle)" : "η₁"} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="eta1_test" name="η₁ (Teste)" stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="(f) Eficiência Exergética η₂">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis domain={[0, 'dataMax + 2']} label={{ value: 'Eficiência (%)', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} tickFormatter={(value) => `${Math.round(value)}`} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="eta2_control" name={isComparative ? "η₂ (Controle)" : "η₂"} stroke="#10b981" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="eta2_test" name="η₂ (Teste)" stroke="#14b8a6" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

export default ResultCharts;