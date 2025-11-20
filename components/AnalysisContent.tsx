
import React from 'react';
import { SimulationParams, SimulationResults, SimulationPoint } from '../types';
import { calculateSinglePoint } from '../services/simulationService';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalysisContentProps {
    results: { control: SimulationResults; test: SimulationResults } | null;
    isLoading: boolean;
    isComparative: boolean;
    params: { control: SimulationParams; test: SimulationParams };
    tableAVAs: [number, number, number, number];
}

// Helper Components
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
        {children}
    </h3>
);

const Highlight: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "text-blue-500 dark:text-blue-400" }) => (
    <strong className={`font-semibold ${className}`}>{children}</strong>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code>{children}</code>
);

// Helper to format numbers for display, preventing errors
const format = (value: number | undefined, decimals = 2): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return 'N/A';
    }
    return value.toFixed(decimals);
};

// Helper to calculate and describe percentage change robustly
const getChange = (control: number, test: number, language: 'pt' | 'en'): { text: string; color: string } => {
    if (isNaN(control) || isNaN(test) || control === 0) {
        return { text: language === 'pt' ? 'uma alteração indeterminada' : 'an indeterminate change', color: 'text-gray-500' };
    }
    const percentChange = ((test - control) / Math.abs(control)) * 100;
    if (Math.abs(percentChange) < 0.1) {
        return { text: language === 'pt' ? 'uma mudança insignificante' : 'an insignificant change', color: 'text-gray-500' };
    }
    const direction = percentChange > 0 ? (language === 'pt' ? 'um aumento' : 'an increase') : (language === 'pt' ? 'uma redução' : 'a reduction');
    const color = percentChange > 0 ? 'text-orange-500' : 'text-green-500';
    return {
        text: `${direction} ${language === 'pt' ? 'de' : 'of'} ${format(Math.abs(percentChange), 1)}%`,
        color,
    };
};


// Component for Single Simulation Analysis
const SingleAnalysis: React.FC<{ params: SimulationParams, tableAVAs: [number, number, number, number] }> = ({ params, tableAVAs }) => {
    const { language } = useLanguage();
    
    // Calculate exact points for analysis
    const points = tableAVAs.map(ava => calculateSinglePoint(ava, params));
    
    const getDataPoint = (point: SimulationPoint) => ({
        ava: point.AVA,
        w_heart: point.W_Heart,
        m_heart: point.M_Heart,
        delta_p: point.Delta_P_aortic_mmHg,
        v_syst: point.V_syst,
        eta1: point.eta1,
        eta2: point.eta2,
        b_d_valves: point.B_d_valves
    });

    const [severeData, moderateData, mildData, healthyData] = points.map(getDataPoint);

    if (language === 'en') {
        return (
            <>
                <p>
                    This analysis evaluates the hemodynamic and thermodynamic impact of progressive aortic stenosis. The simulation employs a <Highlight>dynamic metabolism model</Highlight>, where myocardial energy expenditure is a direct function of the workload imposed on the left ventricle. The pathology stages are stratified based on user-defined Aortic Valve Area (AVA) values for the following scenarios: <Highlight>{format(healthyData.ava, 2)} cm²</Highlight> (Healthy), <Highlight>{format(mildData.ava, 2)} cm²</Highlight> (Mild Stenosis), <Highlight>{format(moderateData.ava, 2)} cm²</Highlight> (Moderate Stenosis), and <Highlight>{format(severeData.ava, 2)} cm²</Highlight> (Severe Stenosis).
                </p>

                <SectionTitle>Impact of Stenosis on Metabolism and Heart Work</SectionTitle>
                <p>
                    Stenosis progression imposes a chronic pressure overload on the left ventricle. To maintain cardiac output, the myocardium must generate a higher systolic intraventricular pressure, which entails a direct increase in oxygen consumption and, consequently, metabolic rate. The model simulates this compensatory mechanism, evidencing a positive correlation between AVA reduction and the consequent increase in both <Highlight>heart work</Highlight> (<Code>W_Heart</Code>) and <Highlight>metabolic rate</Highlight> (<Code>M_Heart</Code>).
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li><strong>Healthy Scenario:</strong> Under normal conditions, the myocardium operates with a metabolic rate of <Highlight>{format(healthyData.m_heart)} W</Highlight> to generate mechanical power of <Highlight>{format(healthyData.w_heart)} W</Highlight>.</li>
                    <li><strong>Moderate Stenosis:</strong> Elevated workload requires an increase in metabolic rate to <Highlight>{format(moderateData.m_heart)} W</Highlight>, corresponding to a power of <Highlight>{format(moderateData.w_heart)} W</Highlight>.</li>
                    <li><strong>Severe Stenosis:</strong> In the most advanced stage, metabolic demand reaches <Highlight>{format(severeData.m_heart)} W</Highlight> for a power of <Highlight>{format(severeData.w_heart)} W</Highlight>, demonstrating exacerbated energy consumption in the face of compromised hemodynamic performance.</li>
                </ul>
                 <p className="mt-2">
                     Paradoxically, the increase in cardiac work does not translate into improved pumping function. Effective stroke volume (<Code>V_syst</Code>) decreases from <Highlight>{format(healthyData.v_syst)} mL</Highlight> in physiological conditions to <Highlight>{format(severeData.v_syst)} mL</Highlight> in the severe stenosis scenario. This finding illustrates the decoupling between energy cost and hemodynamic efficacy, where higher metabolic expenditure results in lower circulatory yield.
                </p>

                <SectionTitle>Analysis of Exergy Efficiency and Irreversibilities</SectionTitle>
                <p>
                    Exergy analysis, through efficiencies <Code>η₁</Code> and <Code>η₂</Code>, allows rigorous quantification of inefficiency sources in the cardiovascular system under aortic stenosis.
                </p>
                 <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>
                        <strong>Exergy Efficiency η₁ (Conversion Efficiency):</strong> This parameter quantifies the efficacy of the myocardium in transducing metabolic exergy into mechanical power. Results indicate that <Code>η₁</Code> exhibits <Highlight>relative stability or marginal decline</Highlight>, varying from <Highlight>{format(healthyData.eta1)}%</Highlight> (Healthy) to <Highlight>{format(severeData.eta1)}%</Highlight> (Severe). Such behavior suggests that the cardiomyocyte contractile machinery maintains its intrinsic efficiency, adapting to increased demand through greater energy flux, rather than a fundamental alteration in its conversion efficiency.
                    </li>
                    <li>
                        <strong>Exergy Efficiency η₂ (Hemodynamic Efficiency):</strong> This indicator evaluates global system efficiency, representing the fraction of metabolic exergy effectively converted into blood flow exergy change. A <Highlight className="text-red-500">sharp decline</Highlight> is observed in this metric with pathology progression, decreasing from <Highlight>{format(healthyData.eta2)}%</Highlight> (Healthy) to a residual value of <Highlight>{format(severeData.eta2)}%</Highlight> (Severe).
                    </li>
                </ul>
                <p className="mt-2">
                    The abrupt drop in <Code>η₂</Code> is primarily attributable to the exponential increase in the <Highlight>exergy destruction rate</Highlight> in the valves (<Code>B_d_valves</Code>). This portion of exergy, which rises from <Highlight>{format(healthyData.b_d_valves)} W</Highlight> to <Highlight>{format(severeData.b_d_valves)} W</Highlight>, represents thermodynamic irreversibilities (entropy generation) associated with turbulent flow and viscous dissipation through the stenotic orifice.
                </p>

                <SectionTitle>Thermodynamic Analysis Conclusion</SectionTitle>
                <p>
                    Thermodynamic analysis, grounded in the dynamic metabolism model, supports the hypothesis that aortic stenosis manifests predominantly as a pathology of <Highlight>systemic inefficiency</Highlight>, rather than energy converter (heart muscle) failure. Although the myocardium preserves its intrinsic conversion efficiency (<Code>η₁</Code>), global system efficiency (<Code>η₂</Code>) is severely compromised. Additional mechanical power generated by the ventricle is mostly dissipated as irreversibilities in the stenotic valve, rather than transferred to the circulating fluid. The growing gap between <Code>η₁</Code> and <Code>η₂</Code> thus emerges as a robust and physiologically coherent quantifier of aortic stenosis severity.
                </p>
            </>
        );
    }

    return (
        <>
            <p>
                A presente análise avalia o impacto hemodinâmico e termodinâmico da estenose aórtica progressiva. A simulação emprega um <Highlight>modelo de metabolismo dinâmico</Highlight>, no qual o dispêndio energético miocárdico é função direta da carga de trabalho imposta ao ventrículo esquerdo. Os estágios da patologia são estratificados com base nos valores de Área Valvar Aórtica (AVA) definidos pelo usuário para os seguintes cenários: <Highlight>{format(healthyData.ava, 2)} cm²</Highlight> (Fisiológico), <Highlight>{format(mildData.ava, 2)} cm²</Highlight> (Estenose Leve), <Highlight>{format(moderateData.ava, 2)} cm²</Highlight> (Estenose Moderada) e <Highlight>{format(severeData.ava, 2)} cm²</Highlight> (Estenose Severa).
            </p>

            <SectionTitle>Impacto da Estenose no Metabolismo e Trabalho Cardíaco</SectionTitle>
            <p>
                A progressão da estenose aórtica impõe uma sobrecarga de pressão crônica ao ventrículo esquerdo. Para manter o débito cardíaco, o miocárdio deve gerar uma pressão intraventricular sistólica superior, o que acarreta um aumento direto no consumo de oxigênio e, consequentemente, na taxa metabólica. O modelo simula este mecanismo compensatório, evidenciando uma correlação positiva entre a redução da AVA e o consequente aumento tanto do <Highlight>trabalho cardíaco</Highlight> (<Code>W_Heart</Code>) quanto da <Highlight>taxa metabólica</Highlight> (<Code>M_Heart</Code>).
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li><strong>Cenário Fisiológico:</strong> Em condições normais, o miocárdio opera com uma taxa metabólica de <Highlight>{format(healthyData.m_heart)} W</Highlight> para gerar uma potência mecânica de <Highlight>{format(healthyData.w_heart)} W</Highlight>.</li>
                <li><strong>Estenose Moderada:</strong> A carga de trabalho elevada requer um aumento na taxa metabólica para <Highlight>{format(moderateData.m_heart)} W</Highlight>, correspondendo a uma potência de <Highlight>{format(moderateData.w_heart)} W</Highlight>.</li>
                <li><strong>Estenose Severa:</strong> No estágio mais avançado, a demanda metabólica atinge <Highlight>{format(severeData.m_heart)} W</Highlight> para uma potência de <Highlight>{format(severeData.w_heart)} W</Highlight>, o que demonstra um consumo energético exacerbado em face de uma performance hemodinâmica comprometida.</li>
            </ul>
             <p className="mt-2">
                 Paradoxalmente, o incremento no trabalho cardíaco não se traduz em uma melhoria da função de bombeamento. O fluxo sistólico efetivo (<Code>V_syst</Code>) decresce de <Highlight>{format(healthyData.v_syst)} mL</Highlight> em condições fisiológicas para <Highlight>{format(severeData.v_syst)} mL</Highlight> no cenário de estenose severa. Este achado ilustra o desacoplamento entre o custo energético e a eficácia hemodinâmica, onde um maior dispêndio metabólico resulta em um menor rendimento circulatório.
            </p>

            <SectionTitle>Análise da Eficiência Exergética e Irreversibilidades</SectionTitle>
            <p>
                A análise de exergia, através das eficiências <Code>η₁</Code> e <Code>η₂</Code>, permite uma quantificação rigorosa das fontes de ineficiência no sistema cardiovascular sob estenose aórtica.
            </p>
             <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>
                    <strong>Eficiência Exergética η₁ (Eficiência de Conversão):</strong> Este parâmetro quantifica a eficácia do miocárdio na transdução da exergia metabólica em potência mecânica. Os resultados indicam que <Code>η₁</Code> exibe uma <Highlight>relativa estabilidade ou um declínio marginal</Highlight>, variando de <Highlight>{format(healthyData.eta1)}%</Highlight> (Fisiológico) para <Highlight>{format(severeData.eta1)}%</Highlight> (Severa). Tal comportamento sugere que a maquinaria contrátil do cardiomiócito mantém sua eficiência intrínseca, adaptando-se ao aumento da demanda através de um maior fluxo energético, e não por uma alteração fundamental em sua eficiência de conversão.
                </li>
                <li>
                    <strong>Eficiência Exergética η₂ (Eficiência Hemodinâmica):</strong> Este indicador avalia a eficiência global do sistema, representando a fração da exergia metabólica que é efetivamente convertida em variação de exergia do fluxo sanguíneo. Observa-se um <Highlight className="text-red-500">declínio acentuado</Highlight> nesta métrica com a progressão da patologia, decrescendo de <Highlight>{format(healthyData.eta2)}%</Highlight> (Fisiológico) para um valor residual de <Highlight>{format(severeData.eta2)}%</Highlight> (Severa).
                </li>
            </ul>
            <p className="mt-2">
                A queda abrupta de <Code>η₂</Code> é primariamente atribuível ao aumento exponencial da <Highlight>taxa de destruição de exergia</Highlight> nas válvulas (<Code>B_d_valves</Code>). Esta parcela de exergia, que aumenta de <Highlight>{format(healthyData.b_d_valves)} W</Highlight> para <Highlight>{format(severeData.b_d_valves)} W</Highlight>, representa as irreversibilidades termodinâmicas (geração de entropia) associadas ao escoamento turbulento e à dissipação viscosa através do orifício estenótico.
            </p>

            <SectionTitle>Conclusão da Análise Termodinâmica</SectionTitle>
            <p>
                A análise termodinâmica, fundamentada no modelo de metabolismo dinâmico, corrobora a hipótese de que a estenose aórtica se manifesta, predominantemente, como uma patologia de <Highlight>ineficiência sistêmica</Highlight>, e não de falha do conversor energético (músculo cardíaco). Embora o miocárdio preserve sua eficiência intrínseca de conversão (<Code>η₁</Code>), a eficiência global do sistema (<Code>η₂</Code>) é severamente comprometida. A potência mecânica adicional gerada pelo ventrículo é majoritariamente dissipada como irreversibilidades na válvula estenótica, em vez de ser transferida ao fluido circulante. O crescente hiato entre <Code>η₁</Code> e <Code>η₂</Code> emerge, portanto, como um quantificador robusto e fisiologicamente coerente da severidade da estenose aórtica.
            </p>
        </>
    );
};

// Helper for Comparative Analysis Stages
const StageComparison: React.FC<{
    stageLabel: string;
    controlData: any;
    testData: any;
}> = ({ stageLabel, controlData, testData }) => {
    const { language } = useLanguage();
    const mHeartChange = getChange(controlData.m_heart, testData.m_heart, language);
    const wHeartChange = getChange(controlData.w_heart, testData.w_heart, language);
    const eta1Change = getChange(controlData.eta1, testData.eta1, language);
    const eta2Change = getChange(controlData.eta2, testData.eta2, language);

    const t = {
        pt: {
            scenario: "Cenário",
            meta: "Metabolismo Cardíaco",
            work: "Trabalho Cardíaco",
            eta1: "Eficiência η₁ (Motor)",
            eta2: "Eficiência η₂ (Sistema)",
            from: "de",
            to: "para"
        },
        en: {
            scenario: "Scenario",
            meta: "Heart Metabolism",
            work: "Heart Work",
            eta1: "Efficiency η₁ (Motor)",
            eta2: "Efficiency η₂ (System)",
            from: "from",
            to: "to"
        }
    }[language];

    return (
        <div className="mt-4 p-3 border-l-4 border-gray-400 dark:border-gray-500 bg-gray-500/10 rounded-r-md">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{t.scenario}: {stageLabel} (AVA = {format(controlData.ava, 2)} cm²)</h4>
            <ul className="text-sm list-disc list-inside space-y-1 mt-2">
                <li>
                    <strong>{t.meta}:</strong> <Highlight className={mHeartChange.color}>{mHeartChange.text}</Highlight> ({t.from} {format(controlData.m_heart)} {t.to} {format(testData.m_heart)} W).
                </li>
                <li>
                    <strong>{t.work}:</strong> <Highlight className={wHeartChange.color}>{wHeartChange.text}</Highlight> ({t.from} {format(controlData.w_heart)} {t.to} {format(testData.w_heart)} W).
                </li>
                 <li>
                    <strong>{t.eta1}:</strong> <Highlight className={eta1Change.color}>{eta1Change.text}</Highlight> ({t.from} {format(controlData.eta1)}% {t.to} {format(testData.eta1)}%).
                </li>
                 <li>
                    <strong>{t.eta2}:</strong> <Highlight className={eta2Change.color}>{eta2Change.text}</Highlight> ({t.from} {format(controlData.eta2)}% {t.to} {format(testData.eta2)}%).
                </li>
            </ul>
        </div>
    );
};


// Component for Comparative Simulation Analysis
const ComparativeAnalysis: React.FC<{
    params: { control: SimulationParams; test: SimulationParams };
    tableAVAs: [number, number, number, number];
}> = ({ params, tableAVAs }) => {
    const { control, test } = params;
    const { language } = useLanguage();
    const changes = [];

    const t = {
        pt: {
            hr: "Frequência Cardíaca",
            temp: "Temperatura de Referência",
            cd: "Coeficiente de Descarga (Cd)",
            intro: "Esta análise comparativa avalia o impacto sistêmico decorrente da variação",
            introSingle: "do seguinte parâmetro",
            introMulti: "combinada dos seguintes parâmetros",
            quantitative: "Análise Quantitativa do Impacto em Diferentes Estágios da Patologia",
            quantitativeDesc: "A seguir, o impacto da variação de parâmetros é avaliado em cada um dos quatro estágios da estenose aórtica.",
            interpretation: "Interpretação Fisiopatológica das Variações",
            multiNote: "A variação simultânea de múltiplos parâmetros resulta em um efeito combinado e complexo no sistema cardiovascular. Cada parâmetro modificado introduz uma perturbação específica, e a resposta final do modelo reflete a interação entre esses fatores. A seguir, a interpretação individual de cada mudança:",
            severe: "Estenose Severa",
            moderate: "Estenose Moderada",
            mild: "Estenose Leve",
            healthy: "Fisiológico",
            control: "Controle",
            test: "Teste",
            descHR: "A frequência cardíaca é um determinante primário do débito cardíaco (DC = FC x VS) e do consumo de oxigênio miocárdico (MVO₂). A variação deste parâmetro revela o balanço fisiológico entre a necessidade de manter o fluxo sanguíneo e o custo metabólico associado. Uma elevação da frequência pode aumentar o débito, mas também reduz o tempo de enchimento diastólico, o que pode comprometer o volume sistólico e a perfusão coronariana, resultando em alterações complexas nas eficiências exergéticas.",
            descTemp: "A temperatura de referência (T₀), ou temperatura do ambiente termodinâmico, é um parâmetro fundamental na definição da exergia, pois estabelece o \"estado morto\" ou o nível de base a partir do qual o trabalho útil pode ser extraído. A modificação de T₀ re-escala o fator de Carnot (1 - T₀/T), influenciando diretamente o cálculo de todas as componentes exergéticas. A alteração resultante nas eficiências, portanto, não reflete uma mudança fisiológica per se, mas sim uma reavaliação do potencial termodinâmico do sistema em relação a um novo ambiente de referência.",
            descCd: "O Coeficiente de Descarga (Cd) é um parâmetro adimensional que caracteriza as perdas de energia irreversíveis no escoamento através do orifício valvar, sendo uma medida da eficiência do orifício como um bocal. Um valor de Cd inferior a 1.0 indica a ocorrência do fenômeno da vena contracta e a dissipação de energia por turbulência. Consequentemente, a variação de Cd modula diretamente o gradiente de pressão transvalvar (ΔP), conforme previsto pela equação de Gorlin, com repercussões diretas sobre o trabalho cardíaco e a taxa de destruição de exergia."
        },
        en: {
            hr: "Heart Rate",
            temp: "Reference Temperature",
            cd: "Discharge Coefficient (Cd)",
            intro: "This comparative analysis evaluates the systemic impact resulting from the",
            introSingle: "variation of the following parameter",
            introMulti: "combined variation of the following parameters",
            quantitative: "Quantitative Analysis of Impact across Pathology Stages",
            quantitativeDesc: "Below, the impact of parameter variation is assessed at each of the four aortic stenosis stages.",
            interpretation: "Pathophysiological Interpretation of Variations",
            multiNote: "Simultaneous variation of multiple parameters results in a combined and complex effect on the cardiovascular system. Each modified parameter introduces a specific perturbation, and the final model response reflects the interaction between these factors. Below is the individual interpretation of each change:",
            severe: "Severe Stenosis",
            moderate: "Moderate Stenosis",
            mild: "Mild Stenosis",
            healthy: "Physiological",
            control: "Control",
            test: "Test",
            descHR: "Heart rate is a primary determinant of cardiac output (CO = HR x SV) and myocardial oxygen consumption (MVO₂). Variation in this parameter reveals the physiological balance between the need to maintain blood flow and the associated metabolic cost. Elevated rate may increase output but also reduces diastolic filling time, potentially compromising stroke volume and coronary perfusion, resulting in complex changes in exergy efficiencies.",
            descTemp: "Reference temperature (T₀), or thermodynamic environment temperature, is a fundamental parameter in exergy definition as it establishes the 'dead state' or base level from which useful work can be extracted. Modifying T₀ rescales the Carnot factor (1 - T₀/T), directly influencing the calculation of all exergetic components. The resulting change in efficiencies thus does not reflect a physiological change per se, but rather a reassessment of the system's thermodynamic potential relative to a new reference environment.",
            descCd: "The Discharge Coefficient (Cd) is a dimensionless parameter characterizing irreversible energy losses in flow through the valve orifice, being a measure of the orifice efficiency as a nozzle. A Cd value less than 1.0 indicates the occurrence of the vena contracta phenomenon and energy dissipation by turbulence. Consequently, Cd variation directly modulates the transvalvular pressure gradient (ΔP), as predicted by the Gorlin equation, with direct repercussions on heart work and exergy destruction rate."
        }
    }[language];

    if (control.hr !== test.hr) {
        changes.push({
            name: t.hr,
            unit: 'bpm',
            controlValue: control.hr,
            testValue: test.hr,
            interpretation: t.descHR
        });
    }
    if (control.temperature !== test.temperature) {
        changes.push({
            name: t.temp,
            unit: '°C',
            controlValue: format(control.temperature, 1),
            testValue: format(test.temperature, 1),
            interpretation: t.descTemp
        });
    }
    if (control.c_d !== test.c_d) {
        changes.push({
            name: t.cd,
            unit: '',
            controlValue: format(control.c_d),
            testValue: format(test.c_d),
            interpretation: t.descCd
        });
    }

    if (changes.length === 0) {
        return <p>{language === 'pt' ? 'Nenhum parâmetro foi alterado entre o cenário de controle e o de teste.' : 'No parameters were changed between control and test scenarios.'}</p>;
    }

    const stageLabels = [t.severe, t.moderate, t.mild, t.healthy];
    
    // Calculate exact points
    const allControlPoints = tableAVAs.map(ava => calculateSinglePoint(ava, control));
    const allTestPoints = tableAVAs.map(ava => calculateSinglePoint(ava, test));

    const formatDataForComparison = (point: SimulationPoint) => ({
        ava: point.AVA,
        w_heart: point.W_Heart,
        m_heart: point.M_Heart,
        delta_p: point.Delta_P_aortic_mmHg,
        eta1: point.eta1,
        eta2: point.eta2,
    });

    return (
        <>
            <p>
                {t.intro} {changes.length > 1 ? t.introMulti : t.introSingle}:
            </p>
            <ul className="list-none my-2 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                {changes.map(change => (
                    <li key={change.name}>
                        <Highlight>{change.name}</Highlight>, {language === 'pt' ? 'que variou de' : 'varying from'} <Highlight>{change.controlValue} {change.unit}</Highlight> ({t.control}) {language === 'pt' ? 'para' : 'to'} <Highlight>{change.testValue} {change.unit}</Highlight> ({t.test}).
                    </li>
                ))}
            </ul>

            <SectionTitle>{t.quantitative}</SectionTitle>
            <p>{t.quantitativeDesc}</p>
            
            {stageLabels.map((label, index) => (
                <StageComparison
                    key={label}
                    stageLabel={label}
                    controlData={formatDataForComparison(allControlPoints[index])}
                    testData={formatDataForComparison(allTestPoints[index])}
                />
            ))}

            <SectionTitle>{t.interpretation}</SectionTitle>
             {changes.length > 1 && (
                <p className="mb-4">
                    {t.multiNote}
                </p>
            )}
            <div className="space-y-3">
                {changes.map((change, index) => (
                    <div key={index} className="p-3 border-l-4 border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 rounded-r-md">
                       <p><strong className="text-gray-800 dark:text-gray-200">{change.name}:</strong> {change.interpretation}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

// Main Component
const AnalysisContent: React.FC<AnalysisContentProps> = ({ results, isLoading, isComparative, params, tableAVAs }) => {
    const { language } = useLanguage();
    const t = {
        pt: {
            loading: "Carregando análise...",
            noData: "Nenhum dado para analisar. Execute uma simulação para ver os resultados.",
            title: "Análise Dinâmica dos Resultados da Simulação"
        },
        en: {
            loading: "Loading analysis...",
            noData: "No data to analyze. Run simulation to see results.",
            title: "Dynamic Simulation Results Analysis"
        }
    }[language];

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

    if (!results || !params) {
        return (
            <div className="flex justify-center items-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <p>{t.noData}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-base leading-relaxed">
            <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
                {t.title}
            </h2>
            {isComparative ? (
                <ComparativeAnalysis params={params} tableAVAs={tableAVAs} />
            ) : (
                <SingleAnalysis params={params.control} tableAVAs={tableAVAs} />
            )}
        </div>
    );
};

export default AnalysisContent;
