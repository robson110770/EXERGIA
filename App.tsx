
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SimulationParams, SimulationResults } from './types';
import { simulateHeartWithStenosis } from './services/simulationService';
import ControlPanel from './components/ControlPanel';
import ResultCharts from './components/ResultCharts';
import SummaryTable from './components/SummaryTable';
import AnalysisContent from './components/AnalysisContent';
import IntroductionContent from './components/IntroductionContent';
import HelpContent from './components/HelpContent';

const App: React.FC = () => {
    const [params, setParams] = useState<{
        control: SimulationParams;
        test: SimulationParams;
    }>({
        control: {
            minAVA: 0.5,
            maxAVA: 3.5,
            steps: 100,
            hr: 72,
            temperature: 37.0,
            c_d: 0.85,
        },
        test: {
            minAVA: 0.5,
            maxAVA: 3.5,
            steps: 100,
            hr: 72, 
            temperature: 37.0,
            c_d: 0.85,
        },
    });
    const [results, setResults] = useState<{
        control: SimulationResults;
        test: SimulationResults;
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [view, setView] = useState<'introduction' | 'charts' | 'data' | 'analysis' | 'help'>('introduction');
    const [tableAVAs, setTableAVAs] = useState<[number, number, number, number]>([1.0, 1.5, 2.0, 3.5]);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    const isComparative = useMemo(() => {
        const { control, test } = params;
        return !(
            control.hr === test.hr &&
            control.temperature === test.temperature &&
            control.c_d === test.c_d
        );
    }, [params]);

    const runSimulation = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            const controlResults = simulateHeartWithStenosis(params.control);
            const testResults = isComparative ? simulateHeartWithStenosis(params.test) : controlResults;
            setResults({ control: controlResults, test: testResults });
            setIsLoading(false);
        }, 500);
    }, [params, isComparative]);

    useEffect(() => {
        runSimulation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setIsExportMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleExportModel = () => {
        const { control } = params;
        const modelDescription = `
# Modelo Matemático Detalhado: Análise de Exergia Cardíaca (Versão Dinâmica)

Este documento detalha o modelo matemático utilizado na simulação, baseado no trabalho de **Roll, J.B. et al., "Exergy Analysis of the Heart with a Stenosis in the Arterial Valve", Entropy 2019, 21, 563**.

## Filosofia do Modelo

Para uma análise mais fiel à fisiologia, esta implementação utiliza um **modelo de metabolismo dinâmico**:

1.  **Metabolismo Dinâmico**: A taxa metabólica do coração (\`M_Heart\`) e sua exergia correspondente (\`B_M\`) não são constantes. Elas são calculadas em cada passo da simulação como uma função linear do trabalho mecânico real do coração. Isso é baseado no modelo de consumo de oxigênio miocárdico de Suga (\`M = a*W + b\`), que estabelece que o custo energético do coração aumenta à medida que sua carga de trabalho aumenta.
2.  **Trabalho-Esforço vs. Trabalho Real**: Para fins de visualização e cálculo de η₁, o "Trabalho Cardíaco" (\`W_Heart\`) exibido nos gráficos continua sendo calculado com um *volume sistólico de referência (saudável)*. Isso o transforma em um *proxy para o "esforço"* do coração. No entanto, para os cálculos de balanço de exergia e para o cálculo do metabolismo (item 1), o *volume sistólico real* (que diminui com a estenose) é utilizado para manter a consistência física.

---

## PARTE 1: Parâmetros e Constantes

### 1.1. Constantes Físicas e Fisiológicas
- **ρ_bl (Densidade do sangue):** \`1060.0\` kg/m³
- **T_Heart (Temperatura interna do coração):** \`38.8\` °C (\`311.95 K\`)
- **T_int (Temperatura na região valvar):** \`311.95 K\` (assumida igual a \`T_Heart\`)
- **t_E (Tempo de ejeção sistólica):** \`0.3\` s
- **HR_ref (Frequência cardíaca de referência):** \`72.0\` bpm
- **P_avg_mmHg (Pressão arterial média de referência):** \`100\` mmHg (\`≈ 13332.2 Pa\`)

### 1.2. Parâmetros do Modelo Metabólico (Suga)
- **a (Coeficiente angular):** \`1.45\` (adimensional)
- **b (Metabolismo basal):** \`6.0\` W

### 1.3. Parâmetros Atuais da Simulação (Controle)
- **Faixa de AVA:** \`${control.minAVA}\` a \`${control.maxAVA}\` cm²
- **Frequência Cardíaca (hr):** \`${control.hr}\` bpm
- **Temperatura de Referência (T₀):** \`${control.temperature}\` °C (\`T_ref_K = ${(control.temperature + 273.15).toFixed(2)} K\`)
- **Coeficiente de Descarga (c_d):** \`${control.c_d}\`

---

## PARTE 2: Funções e Equações Principais

### 2.1. Queda de Pressão (Fórmula de Gorlin)
Calcula a queda de pressão (ΔP) através da válvula aórtica.
\`ΔP [Pa] = (ρ_bl / 2) * ( Q_syst_m3_s / (c_d * A_m2) )²\`
Onde:
- \`Q_syst_m3_s\`: Fluxo sistólico em m³/s
- \`A_m2\`: Área da válvula em m²

### 2.2. Trabalho Cardíaco
Calcula a potência mecânica (\`W_Heart\`) gerada pelo coração.
\`W_beat [J] = (P_avg_Pa + ΔP_Pa) * V_stroke_m3\`
\`W_Heart [W] = W_beat * (hr / 60.0)\`
Onde:
- \`V_stroke_m3\`: Volume sistólico em m³

---

## PARTE 3: Sequência de Cálculo no Loop da Simulação

Para cada valor de \`currentAVA\` na faixa definida:

### 1. Volume Sistólico Real (\`V_stroke_m3\`)
O volume sistólico real diminui com a estenose, calculado a partir de uma correlação empírica e ajustado pela frequência cardíaca.
\`base_flow_ml_s = 91.28 * ln(currentAVA) + 241.02\`
\`base_V_stroke_ml = base_flow_ml_s * t_E\`
\`hr_adjustment_factor = 1.0 - 0.0025 * (hr - HR_ref)\`
\`V_stroke_ml = base_V_stroke_ml * hr_adjustment_factor\`

### 2. Fluxo Sistólico (\`Q_syst_m3_s\`) e Débito Cardíaco (\`cardiac_output\`)
\`Q_syst_m3_s = V_stroke_m3 / t_E\`
\`cardiac_output_L_min = (V_stroke_ml * hr) / 1000.0\`

### 3. Queda de Pressão Aórtica (\`deltaP_Pa\`)
Calculado usando a **Fórmula de Gorlin** (Seção 2.1).

### 4. Trabalho Cardíaco
- **\`W_Heart_actual_for_physics\` [W]:** Trabalho real, calculado usando o \`V_stroke_m3\` real. Usado para o balanço de exergia e cálculo do metabolismo.
- **\`W_Heart_for_graph_and_eta1\` [W]:** Trabalho-esforço, calculado com um volume sistólico de referência saudável (\`V_stroke_ref_m3\`). Usado para visualização nos gráficos e para o cálculo de η₁.

### 5. Metabolismo (\`M_Heart\`) e Exergia Metabólica (\`B_M\`)
\`M_Heart [W] = SUGA_A * W_Heart_actual_for_physics + SUGA_B\`
\`M_Heart [W] = 1.45 * W_Heart_actual_for_physics + 6.0\`
\`B_M [W] = M_Heart\`

### 6. Variação da Exergia do Sangue (\`ΔB_blood\`)
\`m_dot_bl_kg_s = Q_syst_m3_s * ρ_bl\`
\`v_aortic = Q_syst_m3_s / (currentAVA * 1e-4)\`
\`B_phys [W] = m_dot_bl_kg_s * 3500.0 * (1 - (T_ref_K / T_int))\`
\`B_kin [W] = 0.5 * m_dot_bl_kg_s * v_aortic²\`
\`ΔB_blood [W] = B_phys + B_kin\`

### 7. Exergia Destruída (\`B_d\`)
- **Válvula Aórtica (\`B_d_aortic\`):**
  \`W_stenosis_power [W] = (deltaP_Pa * V_stroke_m3) * (hr / 60.0)\`
  \`B_d_aortic [W] = W_stenosis_power * (T_ref_K / T_int)\`
- **Válvula Mitral (\`B_d_mitral\`):** Assumida como uma fração da aórtica.
  \`B_d_mitral = B_d_aortic * 0.15\`
- **Total nas Válvulas (\`B_d_valves\`):**
  \`B_d_valves = B_d_aortic + B_d_mitral\`
- **Total no Coração (\`B_d_heart\`):** Pelo balanço de exergia.
  \`B_d_heart = B_M - W_Heart_actual_for_physics - ΔB_blood\`

### 8. Eficiências Exergéticas
- **η₁ (Eficiência do Motor):**
  \`η₁ [%] = (W_Heart_for_graph_and_eta1 / B_M) * 100.0\`
- **η₂ (Eficiência do Sistema):**
  \`η₂ [%] = (ΔB_blood / B_M) * 100.0\`
`.trim();

        const blob = new Blob([modelDescription], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modelo_matematico_exergia_coracao_dinamico.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportDocument = () => {
        const { control, test } = params;
        const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Relatório de Simulação - CardioExergy</title>
<style>
    body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; }
    h1 { color: #2E74B5; }
    h2 { color: #2E74B5; border-bottom: 1px solid #BFBFBF; padding-bottom: 3px; margin-top: 1.5em; }
    h3 { color: #365F91; margin-top: 1.2em; }
    h4 { color: #44546A; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
    th, td { border: 1px solid #BFBFBF; padding: 6px; text-align: left; vertical-align: top; }
    th { background-color: #F2F2F2; }
    code { font-family: Consolas, 'Courier New', monospace; background-color: #E7E6E6; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
    .param-list { list-style-type: none; padding-left: 0; }
    .param-list li { margin-bottom: 5px; }
    .equation { margin: 10px 0; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-family: Consolas, 'Courier New', monospace; }
</style>
</head>
<body>
    <h1>CardioExergy: Relatório de Simulação</h1>
    <p>Este documento foi gerado pela aplicação e contém os parâmetros utilizados na simulação e uma descrição completa do modelo matemático, incluindo equações e constantes.</p>
    
    <h2>1. Parâmetros da Simulação Utilizados</h2>
    <table>
        <tr>
            <th>Parâmetro</th>
            <th>Cenário Controle</th>
            <th>Cenário Teste</th>
        </tr>
        <tr><td>Área Mínima da Válvula (cm²)</td><td>${control.minAVA}</td><td>${test.minAVA}</td></tr>
        <tr><td>Área Máxima da Válvula (cm²)</td><td>${control.maxAVA}</td><td>${test.maxAVA}</td></tr>
        <tr><td>Número de Passos</td><td>${control.steps}</td><td>${test.steps}</td></tr>
        <tr><td>Frequência Cardíaca (bpm)</td><td>${control.hr}</td><td>${test.hr}</td></tr>
        <tr><td>Temperatura de Referência (°C)</td><td>${control.temperature}</td><td>${test.temperature}</td></tr>
        <tr><td>Coeficiente de Descarga (Cd)</td><td>${control.c_d}</td><td>${test.c_d}</td></tr>
    </table>

    <h2>2. Modelo Matemático (Versão Dinâmica)</h2>
    <p>Baseado no modelo de Roll, J.B. et al., Entropy 2019, 21, 563, implementando um modelo de <strong>metabolismo dinâmico</strong>.</p>

    <h3>2.1. Filosofia do Modelo</h3>
    <p>A taxa metabólica do coração (<code>M_Heart</code>) é calculada como uma função linear do trabalho mecânico real, seguindo o modelo de Suga. Isso significa que o custo energético do coração aumenta realisticamente com a gravidade da estenose. O "Trabalho Cardíaco" (<code>W_Heart</code>) exibido nos gráficos continua sendo um "Trabalho-Esforço" (calculado com volume sistólico de referência) para fins de visualização.</p>

    <h2>3. Parâmetros e Constantes do Modelo</h2>
    
    <h3>3.1. Parâmetros Físicos e Fisiológicos Fixos</h3>
    <ul class="param-list">
        <li><strong>ρ_bl (Densidade do sangue):</strong> <code>1060.0</code> kg/m³</li>
        <li><strong>T_Heart (Temperatura interna):</strong> <code>38.8</code> °C (<code>311.95 K</code>)</li>
        <li><strong>T_int (Temperatura na região valvar):</strong> <code>311.95 K</code></li>
        <li><strong>t_E (Tempo de ejeção sistólica):</strong> <code>0.3</code> s</li>
        <li><strong>HR_ref (Frequência cardíaca de referência):</strong> <code>72.0</code> bpm</li>
        <li><strong>P_avg_mmHg (Pressão arterial média de referência):</strong> <code>100</code> mmHg (<code>13332.2 Pa</code>)</li>
    </ul>

    <h3>3.2. Parâmetros do Modelo Metabólico (Suga)</h3>
    <ul class="param-list">
        <li><strong>a (Coeficiente angular):</strong> <code>1.45</code></li>
        <li><strong>b (Metabolismo basal):</strong> <code>6.0</code> W</li>
    </ul>

    <h2>4. Funções e Sequência de Cálculo</h2>

    <h3>4.1. Funções Principais</h3>
    <h4>Queda de Pressão (Fórmula de Gorlin)</h4>
    <p>Calcula a queda de pressão (ΔP) através da válvula aórtica.</p>
    <div class="equation">ΔP [Pa] = (ρ_bl / 2) * ( Q_syst_m3_s / (c_d * A_m2) )²</div>
    
    <h4>Trabalho Cardíaco</h4>
    <p>Calcula a potência mecânica (<code>W_Heart</code>) gerada pelo coração.</p>
    <div class="equation">W_beat [J] = (P_avg_Pa + ΔP_Pa) * V_stroke_m3</div>
    <div class="equation">W_Heart [W] = W_beat * (hr / 60.0)</div>

    <h3>4.2. Sequência de Cálculo no Loop da Simulação</h3>
    <p>Para cada valor de <code>currentAVA</code> na faixa definida:</p>
    <ol>
        <li><strong>Volume Sistólico Real (<code>V_stroke_m3</code>):</strong><br/>
        Calculado a partir de uma correlação empírica e ajustado pela frequência cardíaca.<br/>
        <div class="equation">base_flow_ml_s = 91.28 * ln(currentAVA) + 241.02</div>
        <div class="equation">hr_adjustment_factor = 1.0 - 0.0025 * (hr - HR_ref)</div>
        <div class="equation">V_stroke_ml = (base_flow_ml_s * t_E) * hr_adjustment_factor</div>
        </li>
        
        <li><strong>Metabolismo (<code>M_Heart</code>) e Exergia Metabólica (<code>B_M</code>):</strong><br/>
        Calculado com base no trabalho cardíaco <strong>real</strong> (<code>W_Heart_actual</code>).<br/>
        <div class="equation">M_Heart [W] = 1.45 * W_Heart_actual + 6.0</div>
        <div class="equation">B_M [W] = M_Heart</div>
        </li>
        
        <li><strong>Variação da Exergia do Sangue (<code>ΔB_blood</code>):</strong><br/>
        Soma das componentes física (<code>B_phys</code>) e cinética (<code>B_kin</code>).<br/>
        <div class="equation">B_phys [W] = (Q_syst_m3_s * ρ_bl) * 3500.0 * (1 - (T_ref_K / T_int))</div>
        <div class="equation">B_kin [W] = 0.5 * (Q_syst_m3_s * ρ_bl) * v_aortic²</div>
        <div class="equation">ΔB_blood [W] = B_phys + B_kin</div>
        </li>

        <li><strong>Exergia Destruída (<code>B_d</code>):</strong><br/>
        <div class="equation">B_d_aortic [W] = ((ΔP_Pa * V_stroke_m3) * (hr/60)) * (T_ref_K / T_int)</div>
        <div class="equation">B_d_mitral = B_d_aortic * 0.15</div>
        <div class="equation">B_d_heart = B_M - W_Heart_actual - ΔB_blood</div>
        </li>

        <li><strong>Eficiências Exergéticas (η₁ e η₂):</strong><br/>
        <div class="equation">η₁ [%] = (W_Heart_de_esforço / B_M) * 100.0</div>
        <div class="equation">η₂ [%] = (ΔB_blood / B_M) * 100.0</div>
        </li>
    </ol>
</body>
</html>`;
    
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'relatorio_simulacao_completo.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const baseButtonClass = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors";
    const activeButtonClass = "bg-blue-600 text-white";
    const inactiveButtonClass = "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            CardioExergy
                        </h1>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                            ANÁLISE EXERGÉTICA DO CORAÇÃO COM ESTENOSE AÓRTICA
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            Baseado no modelo de Roll, J.B. et al., Entropy 2019, 21, 563.
                        </p>
                    </div>
                    <div className="relative" ref={exportMenuRef}>
                        <button
                            onClick={() => setIsExportMenuOpen(prev => !prev)}
                            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Exportar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {isExportMenuOpen && (
                            <div 
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                            >
                                <div className="py-1">
                                    <button
                                        onClick={() => { handleExportModel(); setIsExportMenuOpen(false); }}
                                        className="text-gray-700 dark:text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Modelo (.md)
                                    </button>
                                    <button
                                        onClick={() => { handleExportDocument(); setIsExportMenuOpen(false); }}
                                        className="text-gray-700 dark:text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Documento (.doc)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                    <div className="lg:col-span-3">
                        <ControlPanel
                            params={params}
                            setParams={setParams}
                            tableAVAs={tableAVAs}
                            setTableAVAs={setTableAVAs}
                            onRunSimulation={runSimulation}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="lg:col-span-9">
                        <div className="mb-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md flex items-center justify-center space-x-2 flex-wrap gap-y-2">
                            <button
                                onClick={() => setView('introduction')}
                                className={`${baseButtonClass} ${view === 'introduction' ? activeButtonClass : inactiveButtonClass}`}
                            >
                                INTRODUÇÃO
                            </button>
                            <button
                                onClick={() => setView('charts')}
                                className={`${baseButtonClass} ${view === 'charts' ? activeButtonClass : inactiveButtonClass}`}
                            >
                                VISUALIZAR GRÁFICOS
                            </button>
                            <button
                                onClick={() => setView('data')}
                                className={`${baseButtonClass} ${view === 'data' ? activeButtonClass : inactiveButtonClass}`}
                            >
                                VISUALIZAR DADOS
                            </button>
                            <button
                                onClick={() => setView('analysis')}
                                className={`${baseButtonClass} ${view === 'analysis' ? activeButtonClass : inactiveButtonClass}`}
                            >
                                ANÁLISE DOS RESULTADOS
                            </button>
                             <button
                                onClick={() => setView('help')}
                                className={`${baseButtonClass} ${view === 'help' ? activeButtonClass : inactiveButtonClass}`}
                            >
                                AJUDA
                            </button>
                        </div>
                        <div className="animate-fade-in">
                            {view === 'introduction' && <IntroductionContent />}
                            {view === 'charts' && <ResultCharts results={results} isLoading={isLoading} isComparative={isComparative} />}
                            {view === 'data' && <SummaryTable results={results} isLoading={isLoading} isComparative={isComparative} tableAVAs={tableAVAs} params={params} />}
                            {view === 'analysis' && <AnalysisContent results={results} isLoading={isLoading} isComparative={isComparative} params={params} tableAVAs={tableAVAs} />}
                            {view === 'help' && <HelpContent />}
                        </div>
                    </div>
                </div>
            </main>
            
            <footer className="text-center p-4 mt-8 text-gray-500 dark:text-gray-400 text-xs">
                <p>Desenvolvido como uma ferramenta de visualização interativa.</p>
            </footer>
        </div>
    );
};

export default App;
