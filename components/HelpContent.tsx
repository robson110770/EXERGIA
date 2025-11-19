
import React from 'react';

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
