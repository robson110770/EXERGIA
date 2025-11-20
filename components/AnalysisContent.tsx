
import React from 'react';
import { SimulationParams, SimulationResults, SimulationPoint } from '../types';
import { calculateSinglePoint } from '../services/simulationService';

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
const getChange = (control: number, test: number): { text: string; color: string } => {
    if (isNaN(control) || isNaN(test) || control === 0) {
        return { text: 'uma alteração indeterminada', color: 'text-gray-500' };
    }
    const percentChange = ((test - control) / Math.abs(control)) * 100;
    if (Math.abs(percentChange) < 0.1) {
        return { text: 'uma mudança insignificante', color: 'text-gray-500' };
    }
    const direction = percentChange > 0 ? 'um aumento' : 'uma redução';
    const color = percentChange > 0 ? 'text-orange-500' : 'text-green-500';
    return {
        text: `${direction} de ${format(Math.abs(percentChange), 1)}%`,
        color,
    };
};


// Component for Single Simulation Analysis
const SingleAnalysis: React.FC<{ params: SimulationParams, tableAVAs: [number, number, number, number] }> = ({ params, tableAVAs }) => {
    
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
                 Paradoxalmente, o incremento no trabalho cardíaco não se traduz em uma melhoria da função de bombeamento. O fluxo sistólico efetivo (<Code>V_syst</Code>) decresce de <Highlight>{format(healthyData.v_syst)} mL/s</Highlight> em condições fisiológicas para <Highlight>{format(severeData.v_syst)} mL/s</Highlight> no cenário de estenose severa. Este achado ilustra o desacoplamento entre o custo energético e a eficácia hemodinâmica, onde um maior dispêndio metabólico resulta em um menor rendimento circulatório.
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
    const mHeartChange = getChange(controlData.m_heart, testData.m_heart);
    const wHeartChange = getChange(controlData.w_heart, testData.w_heart);
    const eta1Change = getChange(controlData.eta1, testData.eta1);
    const eta2Change = getChange(controlData.eta2, testData.eta2);

    return (
        <div className="mt-4 p-3 border-l-4 border-gray-400 dark:border-gray-500 bg-gray-500/10 rounded-r-md">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Cenário: {stageLabel} (AVA = {format(controlData.ava, 2)} cm²)</h4>
            <ul className="text-sm list-disc list-inside space-y-1 mt-2">
                <li>
                    <strong>Metabolismo Cardíaco:</strong> <Highlight className={mHeartChange.color}>{mHeartChange.text}</Highlight> (de {format(controlData.m_heart)} para {format(testData.m_heart)} W).
                </li>
                <li>
                    <strong>Trabalho Cardíaco:</strong> <Highlight className={wHeartChange.color}>{wHeartChange.text}</Highlight> (de {format(controlData.w_heart)} para {format(testData.w_heart)} W).
                </li>
                 <li>
                    <strong>Eficiência η₁ (Motor):</strong> <Highlight className={eta1Change.color}>{eta1Change.text}</Highlight> (de {format(controlData.eta1)}% para {format(testData.eta1)}%).
                </li>
                 <li>
                    <strong>Eficiência η₂ (Sistema):</strong> <Highlight className={eta2Change.color}>{eta2Change.text}</Highlight> (de {format(controlData.eta2)}% para {format(testData.eta2)}%).
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
    const changes = [];

    if (control.hr !== test.hr) {
        changes.push({
            name: 'Frequência Cardíaca',
            unit: 'bpm',
            controlValue: control.hr,
            testValue: test.hr,
            interpretation: <>A frequência cardíaca é um determinante primário do débito cardíaco (DC = FC x VS) e do consumo de oxigênio miocárdico (MVO₂). A variação deste parâmetro revela o balanço fisiológico entre a necessidade de manter o fluxo sanguíneo e o custo metabólico associado. Uma elevação da frequência pode aumentar o débito, mas também reduz o tempo de enchimento diastólico, o que pode comprometer o volume sistólico e a perfusão coronariana, resultando em alterações complexas nas eficiências exergéticas.</>
        });
    }
    if (control.temperature !== test.temperature) {
        changes.push({
            name: 'Temperatura de Referência',
            unit: '°C',
            controlValue: format(control.temperature, 1),
            testValue: format(test.temperature, 1),
            interpretation: <>A temperatura de referência (<Code>T₀</Code>), ou temperatura do ambiente termodinâmico, é um parâmetro fundamental na definição da exergia, pois estabelece o "estado morto" ou o nível de base a partir do qual o trabalho útil pode ser extraído. A modificação de <Code>T₀</Code> re-escala o fator de Carnot (1 - T₀/T), influenciando diretamente o cálculo de todas as componentes exergéticas. A alteração resultante nas eficiências, portanto, não reflete uma mudança fisiológica per se, mas sim uma reavaliação do potencial termodinâmico do sistema em relação a um novo ambiente de referência.</>
        });
    }
    if (control.c_d !== test.c_d) {
        changes.push({
            name: 'Coeficiente de Descarga (Cd)',
            unit: '',
            controlValue: format(control.c_d),
            testValue: format(test.c_d),
            interpretation: <>O Coeficiente de Descarga (<Code>Cd</Code>) é um parâmetro adimensional que caracteriza as perdas de energia irreversíveis no escoamento através do orifício valvar, sendo uma medida da eficiência do orifício como um bocal. Um valor de <Code>Cd</Code> inferior a 1.0 indica a ocorrência do fenômeno da <i>vena contracta</i> e a dissipação de energia por turbulência. Consequentemente, a variação de <Code>Cd</Code> modula diretamente o gradiente de pressão transvalvar (<Code>ΔP</Code>), conforme previsto pela equação de Gorlin, com repercussões diretas sobre o trabalho cardíaco e a taxa de destruição de exergia.</>
        });
    }

    if (changes.length === 0) {
        return <p>Nenhum parâmetro foi alterado entre o cenário de controle e o de teste.</p>;
    }

    const stageLabels = ['Estenose Severa', 'Estenose Moderada', 'Estenose Leve', 'Fisiológico'];
    
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
                Esta análise comparativa avalia o impacto sistêmico decorrente da variação {changes.length > 1 ? 'combinada dos seguintes parâmetros' : 'do seguinte parâmetro'}:
            </p>
            <ul className="list-none my-2 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                {changes.map(change => (
                    <li key={change.name}>
                        <Highlight>{change.name}</Highlight>, que variou de <Highlight>{change.controlValue} {change.unit}</Highlight> (Controle) para <Highlight>{change.testValue} {change.unit}</Highlight> (Teste).
                    </li>
                ))}
            </ul>

            <SectionTitle>Análise Quantitativa do Impacto em Diferentes Estágios da Patologia</SectionTitle>
            <p>A seguir, o impacto da variação de parâmetros é avaliado em cada um dos quatro estágios da estenose aórtica.</p>
            
            {stageLabels.map((label, index) => (
                <StageComparison
                    key={label}
                    stageLabel={label}
                    controlData={formatDataForComparison(allControlPoints[index])}
                    testData={formatDataForComparison(allTestPoints[index])}
                />
            ))}

            <SectionTitle>Interpretação Fisiopatológica das Variações</SectionTitle>
             {changes.length > 1 && (
                <p className="mb-4">
                    A variação simultânea de múltiplos parâmetros resulta em um efeito combinado e complexo no sistema cardiovascular. Cada parâmetro modificado introduz uma perturbação específica, e a resposta final do modelo reflete a interação entre esses fatores. A seguir, a interpretação individual de cada mudança:
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
                <p>Nenhum dado para analisar. Execute uma simulação para ver os resultados.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-base leading-relaxed">
            <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
                Análise Dinâmica dos Resultados da Simulação
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
