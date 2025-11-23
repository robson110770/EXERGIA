
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { SimulationResults } from '../types';
import ChartCard from './ChartCard';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultChartsProps {
    results: { control: SimulationResults; test: SimulationResults } | null;
    isLoading: boolean;
    isComparative: boolean;
}

const ResultCharts: React.FC<ResultChartsProps> = ({ results, isLoading, isComparative }) => {
    const { language } = useLanguage();
    
    const t = {
        pt: {
            loading: "Carregando...",
            noData: "Nenhum dado para exibir. Execute a simulação.",
            ava: "Área Válvula Aórtica (cm²)",
            control: "Controle",
            test: "Teste",
            metabolism: "Metabolismo",
            work: "Trabalho",
            exBlood: "Ex. Sangue",
            exDestroyed: "Ex. Destruída",
            titleA: "(a) Fluxo Sistólico",
            titleB: "(b) Queda de Pressão Aórtica",
            titleC: "(c) Metabolismo e Trabalho",
            titleD: "(d) Análise de Exergia (W)",
            titleE: "(e) Eficiência Exergética η₁",
            titleF: "(f) Eficiência Exergética η₂",
            eff: "Eficiência (%)",
            power: "Potência (W)",
            exergy: "Exergia (W)",
            captions: {
                a: "Representa a vazão de sangue ejetado pelo ventrículo. A redução observada à esquerda indica o comprometimento hemodinâmico na estenose severa.",
                b: "Mostra a diferença de pressão necessária para forçar o sangue através da válvula. Note o aumento exponencial conforme a área (AVA) diminui.",
                c: "Compara o custo energético total (Metabolismo) com a potência útil (Trabalho). O distanciamento entre as curvas ilustra o esforço desperdiçado.",
                d: "Contrasta a exergia efetivamente transferida ao sangue com a exergia destruída (perda irreversível) devido à turbulência na válvula.",
                e: "Eficiência de conversão do músculo cardíaco (Motor). Tende a permanecer estável, indicando que a falha não é muscular, mas sistêmica.",
                f: "Eficiência global do sistema (Hemodinâmica). A queda abrupta em AVAs baixas demonstra o colapso da capacidade de bombeamento eficiente."
            }
        },
        en: {
            loading: "Loading...",
            noData: "No data to display. Run the simulation.",
            ava: "Aortic Valve Area (cm²)",
            control: "Control",
            test: "Test",
            metabolism: "Metabolism",
            work: "Work",
            exBlood: "Blood Ex.",
            exDestroyed: "Destr. Ex.",
            titleA: "(a) Systolic Flow",
            titleB: "(b) Aortic Pressure Drop",
            titleC: "(c) Metabolism and Work",
            titleD: "(d) Exergy Analysis (W)",
            titleE: "(e) Exergy Efficiency η₁",
            titleF: "(f) Exergy Efficiency η₂",
            eff: "Efficiency (%)",
            power: "Power (W)",
            exergy: "Exergy (W)",
            captions: {
                a: "Represents the rate of blood ejected by the ventricle. The reduction observed on the left indicates hemodynamic impairment in severe stenosis.",
                b: "Shows the pressure difference needed to force blood through the valve. Note the exponential increase as the area (AVA) decreases.",
                c: "Compares total energy cost (Metabolism) with useful power (Work). The widening gap between curves illustrates wasted effort.",
                d: "Contrasts exergy effectively transferred to the blood with exergy destroyed (irreversible loss) due to turbulence at the valve.",
                e: "Conversion efficiency of the heart muscle (Engine). Tends to remain stable, indicating the failure is systemic, not muscular.",
                f: "Global system efficiency (Hemodynamic). The sharp drop at low AVAs demonstrates the collapse of efficient pumping capacity."
            }
        }
    }[language];


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
                <p>{t.noData}</p>
            </div>
        );
    }

    const xAxisProps = {
        dataKey: "AVA",
        height: 40,
        label: { value: t.ava, position: 'insideBottom' },
        tick: { fontSize: 12 },
        type: "number" as const,
        domain: xAxisDomain,
        ticks: xAxisTicks,
    };

    const StenosisReferences = () => (
        <>
            {/* Shaded Areas - Matching the Table Colors */}
            {/* Severe (< 1.0): Red */}
            <ReferenceArea x1={xAxisDomain[0]} x2={1.0} fill="#ef4444" fillOpacity={0.05} ifOverflow="visible" />
            {/* Moderate (1.0 - 1.5): Amber/Yellow */}
            <ReferenceArea x1={1.0} x2={1.5} fill="#eab308" fillOpacity={0.05} ifOverflow="visible" />
            {/* Mild (1.5 - 2.0): Emerald/Green */}
            <ReferenceArea x1={1.5} x2={2.0} fill="#10b981" fillOpacity={0.05} ifOverflow="visible" />
            {/* Healthy (> 2.0): Blue */}
            <ReferenceArea x1={2.0} x2={xAxisDomain[1]} fill="#3b82f6" fillOpacity={0.05} ifOverflow="visible" />

            {/* Dotted Lines */}
            <ReferenceLine x={1.0} stroke="gray" strokeDasharray="3 3" strokeOpacity={0.8} />
            <ReferenceLine x={1.5} stroke="gray" strokeDasharray="3 3" strokeOpacity={0.8} />
            <ReferenceLine x={2.0} stroke="gray" strokeDasharray="3 3" strokeOpacity={0.8} />
        </>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title={t.titleA} caption={t.captions.a}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis label={{ value: 'mL/s', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="V_syst_control" name={t.control} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="V_syst_test" name={t.test} stroke="#f97316" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t.titleB} caption={t.captions.b}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="Delta_P_aortic_mmHg_control" name={t.control} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="Delta_P_aortic_mmHg_test" name={t.test} stroke="#f97316" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t.titleC} caption={t.captions.c}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps}/>
                        <YAxis label={{ value: t.power, angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <StenosisReferences />
                        <Line type="monotone" dataKey="M_Heart_control" name={isComparative ? `${t.metabolism} (${t.control})` : t.metabolism} stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="W_Heart_control" name={isComparative ? `${t.work} (${t.control})` : t.work} stroke="#a855f7" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="M_Heart_test" name={`${t.metabolism} (${t.test})`} stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                        {isComparative && <Line type="monotone" dataKey="W_Heart_test" name={`${t.work} (${t.test})`} stroke="#ec4899" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title={t.titleD} caption={t.captions.d}>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis label={{ value: t.exergy, angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}}/>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <StenosisReferences />
                        <Line type="monotone" dataKey="Delta_B_blood_control" name={isComparative ? `${t.exBlood} (${t.control})` : t.exBlood} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="B_d_valves_control" name={isComparative ? `${t.exDestroyed} (${t.control})` : t.exDestroyed} stroke="#ef4444" strokeWidth={2} dot={false} />

                        {isComparative && <Line type="monotone" dataKey="Delta_B_blood_test" name={`${t.exBlood} (${t.test})`} stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                        {isComparative && <Line type="monotone" dataKey="B_d_valves_test" name={`${t.exDestroyed} (${t.test})`} stroke="#eab308" strokeDasharray="5 5" strokeWidth={2} dot={false} />}

                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t.titleE} caption={t.captions.e}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis domain={[0, 'dataMax + 2']} label={{ value: t.eff, angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} tickFormatter={(value) => `${Math.round(value)}`} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="eta1_control" name={isComparative ? `η₁ (${t.control})` : "η₁"} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="eta1_test" name={`η₁ (${t.test})`} stroke="#f97316" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t.titleF} caption={t.captions.f}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis {...xAxisProps} />
                        <YAxis domain={[0, 'dataMax + 2']} label={{ value: t.eff, angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} tickFormatter={(value) => `${Math.round(value)}`} />
                        <Tooltip />
                        {isComparative && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                        <StenosisReferences />
                        <Line type="monotone" dataKey="eta2_control" name={isComparative ? `η₂ (${t.control})` : "η₂"} stroke="#10b981" strokeWidth={2} dot={false} />
                        {isComparative && <Line type="monotone" dataKey="eta2_test" name={`η₂ (${t.test})`} stroke="#d946ef" strokeDasharray="5 5" strokeWidth={2} dot={false} /> /* Updated to Magenta/Fuchsia */}
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

export default ResultCharts;
