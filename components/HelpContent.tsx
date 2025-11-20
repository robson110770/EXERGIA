
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Helper Components for consistent styling within HelpContent
const MainHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-bold mt-8 mb-4 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
        {children}
    </h3>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="text-lg font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">
        {children}
    </h4>
);

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <strong className="font-semibold text-blue-500 dark:text-blue-400">{children}</strong>
);

const HelpContent: React.FC = () => {
    const { language } = useLanguage();

    if (language === 'en') {
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
                <h2 className="text-xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                    HELP AND TECHNICAL DOCUMENTATION
                </h2>
    
                <MainHeader>1. APP FUNCTIONALITY</MainHeader>
                <p>
                    <strong>CardioExergy</strong> is an interactive scientific tool designed to assist students, researchers, and healthcare professionals in understanding cardiac bioenergetics under pathological conditions.
                </p>
                
                <SectionTitle>Objective</SectionTitle>
                <p>
                    The main objective is to simulate the impact of <strong>Aortic Stenosis</strong> on the heart's energy efficiency. Unlike traditional approaches focusing only on pressure and flow (hemodynamics), this app uses <Highlight>Exergy Analysis</Highlight> (thermodynamics) to quantify the waste of useful energy (irreversibility) caused by the diseased valve.
                </p>
    
                <SectionTitle>Key Features</SectionTitle>
                <ul className="list-disc list-inside space-y-3 mt-2 pl-4">
                    <li>
                        <Highlight>Control Panel:</Highlight> Located on the left, allows real-time manipulation of critical physiological variables such as Heart Rate, Body Temperature, and Valve Discharge Coefficient.
                    </li>
                    <li>
                        <Highlight>Comparative Mode:</Highlight> Users can configure two simultaneous scenarios (Control vs. Test) to view side-by-side how parameter changes affect results. Ideal for understanding system sensitivity.
                    </li>
                    <li>
                        <Highlight>Graphic Visualization:</Highlight> The "View Charts" tab plots the behavior of key variables (Flow, Pressure Drop, Work/Metabolism, Exergy Destruction, and Efficiencies η₁ and η₂) against disease progression (Valve Area reduction - AVA).
                    </li>
                    <li>
                        <Highlight>Data Table:</Highlight> The "View Data" tab offers a precise tabular view of numerical values for four clinical reference points: Severe, Moderate, Mild Stenosis, and Healthy Condition.
                    </li>
                    <li>
                        <Highlight>Automated Reports:</Highlight> The "Results Analysis" tab generates dynamic textual interpretation based on simulated data, explaining observed physical phenomena.
                    </li>
                    <li>
                        <Highlight>Suggested Activities:</Highlight> The "Activities" tab offers guided simulation scripts. These educational exercises propose specific scenarios (like the impact of tachycardia or valve geometry) to explore theoretical concepts in practice, including setup instructions, analysis points, and hidden conclusions to encourage active reasoning.
                    </li>
                </ul>
    
                <MainHeader>2. TECHNICAL DOCUMENTATION</MainHeader>
                <p>
                    This app was built following modern software development standards, prioritizing scientific accuracy, performance, and accessibility.
                </p>
    
                <SectionTitle>Tech Stack</SectionTitle>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>
                        <Highlight>Language:</Highlight> <strong>TypeScript</strong>. An evolution of JavaScript adding static typing. This ensures complex simulation math is executed safely and robustly, preventing common type errors.
                    </li>
                    <li>
                        <Highlight>Framework:</Highlight> <strong>React.js</strong>. Used to build the user interface. React's component-based architecture makes the application highly reactive: every numeric adjustment in the control panel instantly triggers a recalculation and chart update without page reloads.
                    </li>
                    <li>
                        <Highlight>Styling:</Highlight> <strong>Tailwind CSS</strong>. A utility framework providing a clean, responsive design (adaptable to mobile and tablets) with native dark mode support.
                    </li>
                    <li>
                        <Highlight>Data Visualization:</Highlight> <strong>Recharts</strong>. A robust D3.js-based library used to render high-fidelity interactive SVG charts.
                    </li>
                </ul>
    
                <SectionTitle>Architecture and Mathematical Model</SectionTitle>
                <p>
                    The application operates under a <strong>Client-Side Single Page Application (SPA)</strong> architecture.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>
                        <strong>Local Execution:</strong> All simulation calculations occur directly in the user's browser. No data is sent to external servers, ensuring total data privacy and allowing the app to function perfectly <strong>offline</strong>.
                    </li>
                    <li>
                        <strong>Simulation Engine:</strong> Scientific logic resides in the <code>simulationService.ts</code> module. This module translates the differential and algebraic equations from Roll et al. (2019) — including Gorlin's Formula and entropy balances — into optimized computational algorithms.
                    </li>
                </ul>
            </div>
        );
    }

    // Portuguese Default
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
            <h2 className="text-xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                AJUDA E DOCUMENTAÇÃO TÉCNICA
            </h2>

            <MainHeader>1. FUNCIONALIDADE DO APLICATIVO</MainHeader>
            <p>
                O <strong>CardioExergy</strong> é uma ferramenta científica interativa desenvolvida para auxiliar estudantes, pesquisadores e profissionais da saúde na compreensão da bioenergética cardíaca sob condições patológicas.
            </p>
            
            <SectionTitle>Objetivo</SectionTitle>
            <p>
                O objetivo principal é simular o impacto da <strong>Estenose Aórtica</strong> na eficiência energética do coração. Ao contrário das abordagens tradicionais que focam apenas em pressão e fluxo (hemodinâmica), este aplicativo utiliza a <Highlight>Análise de Exergia</Highlight> (termodinâmica) para quantificar o desperdício de energia útil (irreversibilidade) causado pela válvula doente.
            </p>

            <SectionTitle>Principais Recursos</SectionTitle>
            <ul className="list-disc list-inside space-y-3 mt-2 pl-4">
                <li>
                    <Highlight>Painel de Controle:</Highlight> Localizado à esquerda, permite a manipulação em tempo real de variáveis fisiológicas críticas como Frequência Cardíaca, Temperatura Corporal e o Coeficiente de Descarga da válvula.
                </li>
                <li>
                    <Highlight>Modo Comparativo:</Highlight> O usuário pode configurar dois cenários simultâneos (Controle vs. Teste) para visualizar, lado a lado, como alterações nos parâmetros afetam os resultados. Isso é ideal para entender a sensibilidade do sistema.
                </li>
                <li>
                    <Highlight>Visualização Gráfica:</Highlight> A aba "Visualizar Gráficos" plota o comportamento de variáveis-chave (Fluxo, Queda de Pressão, Trabalho/Metabolismo, Destruição de Exergia e Eficiências η₁ e η₂) em função da progressão da doença (redução da Área da Válvula - AVA).
                </li>
                <li>
                    <Highlight>Tabela de Dados:</Highlight> A aba "Visualizar Dados" oferece uma visão tabular precisa dos valores numéricos para quatro pontos de referência clínica: Estenose Severa, Moderada, Leve e Condição Saudável.
                </li>
                <li>
                    <Highlight>Relatórios Automáticos:</Highlight> A aba "Análise dos Resultados" gera uma interpretação textual dinâmica baseada nos dados simulados, explicando os fenômenos físicos observados.
                </li>
                <li>
                    <Highlight>Atividades Sugeridas:</Highlight> A aba "Atividades" oferece um conjunto de roteiros de simulação guiados. Estes exercícios didáticos propõem cenários específicos (como o impacto da taquicardia ou da geometria valvar) para explorar conceitos teóricos na prática, incluindo instruções de configuração, pontos de análise e conclusões ocultas para estimular o raciocínio ativo.
                </li>
            </ul>

            <MainHeader>2. DOCUMENTAÇÃO TÉCNICA</MainHeader>
            <p>
                Este aplicativo foi construído seguindo padrões modernos de desenvolvimento de software, priorizando precisão científica, performance e acessibilidade.
            </p>

            <SectionTitle>Stack Tecnológico</SectionTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>
                    <Highlight>Linguagem:</Highlight> <strong>TypeScript</strong>. Uma evolução do JavaScript que adiciona tipagem estática. Isso garante que os cálculos matemáticos complexos da simulação sejam executados com segurança e robustez, prevenindo erros de tipo comuns em linguagens dinâmicas.
                </li>
                <li>
                    <Highlight>Framework:</Highlight> <strong>React.js</strong>. Utilizado para construir a interface de usuário. A arquitetura baseada em componentes do React permite que a aplicação seja altamente reativa: cada ajuste numérico no painel de controle dispara instantaneamente um recálculo e atualização dos gráficos, sem necessidade de recarregar a página.
                </li>
                <li>
                    <Highlight>Estilização:</Highlight> <strong>Tailwind CSS</strong>. Um framework utilitário que proporciona um design limpo, responsivo (adaptável a celulares e tablets) e com suporte nativo a temas claro e escuro.
                </li>
                <li>
                    <Highlight>Visualização de Dados:</Highlight> <strong>Recharts</strong>. Uma biblioteca robusta baseada em D3.js, utilizada para renderizar os gráficos vetoriais (SVG) com alta fidelidade e interatividade.
                </li>
            </ul>

            <SectionTitle>Arquitetura e Modelo Matemático</SectionTitle>
            <p>
                O aplicativo opera sob uma arquitetura <strong>Client-Side Single Page Application (SPA)</strong>.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>
                    <strong>Execução Local:</strong> Todos os cálculos da simulação ocorrem diretamente no navegador do usuário. Não há envio de dados para servidores externos, o que garante privacidade total dos dados inseridos e permite que o aplicativo funcione perfeitamente em modo <strong>offline</strong>.
                </li>
                <li>
                    <strong>Motor de Simulação:</strong> A lógica científica reside no módulo <code>simulationService.ts</code>. Este módulo traduz as equações diferenciais e algébricas do modelo de Roll et al. (2019) — incluindo a Fórmula de Gorlin e os balanços de entropia — em algoritmos computacionais otimizados.
                </li>
            </ul>
        </div>
    );
};

export default HelpContent;
