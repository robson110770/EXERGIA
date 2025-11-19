
import React from 'react';

// Helper Components for consistent styling
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

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code>{children}</code>
);


const IntroductionContent: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
             <h2 className="text-xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                ANÁLISE EXERGÉTICA DO CORAÇÃO COM ESTENOSE AÓRTICA
            </h2>
            
            <MainHeader>1. FUNDAMENTAÇÃO TEÓRICA</MainHeader>

            <SectionTitle>1.1 O QUE É EXERGIA</SectionTitle>
            <p>
                A exergia é uma medida da <Highlight>qualidade da energia</Highlight>. Ao contrário da energia, que é sempre conservada (Primeira Lei da Termodinâmica), a exergia pode ser destruída em qualquer processo real (Segunda Lei da Termodinâmica). Em termos simples, a exergia representa o <Highlight>potencial máximo de trabalho útil</Highlight> que pode ser extraído de um sistema. Em um contexto fisiológico, a análise de exergia permite quantificar a eficiência com que o corpo usa a energia metabólica para realizar trabalho (como bombear sangue) e onde as ineficiências (destruição de exergia) ocorrem.
            </p>

            <SectionTitle>1.2 O CORAÇÃO E SUAS VÁLVULAS</SectionTitle>
            <p>
                O coração humano possui quatro câmaras (dois átrios e dois ventrículos) e quatro válvulas que garantem o fluxo unidirecional do sangue:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li><Highlight>Válvula Tricúspide:</Highlight> Entre o átrio direito e o ventrículo direito.</li>
                <li><Highlight>Válvula Pulmonar:</Highlight> Entre o ventrículo direito e a artéria pulmonar.</li>
                <li><Highlight>Válvula Mitral:</Highlight> Entre o átrio esquerdo e o ventrículo esquerdo.</li>
                <li><Highlight>Válvula Aórtica:</Highlight> Entre o ventrículo esquerdo e a aorta. É o foco desta simulação.</li>
            </ul>
            <p className="mt-2">
                Neste modelo, a estenose da válvula aórtica é o principal fator patológico. A simulação analisa como a redução da área de abertura desta válvula (<Highlight>AVA</Highlight>) impacta a termodinâmica e a eficiência do coração.
            </p>

            <SectionTitle>1.3 O QUE É ESTENOSE AÓRTICA</SectionTitle>
            <p>
                A estenose aórtica é uma condição cardíaca caracterizada pelo <Highlight>estreitamento anormal da abertura da válvula aórtica</Highlight>. Esta válvula controla o fluxo de sangue do ventrículo esquerdo (a principal câmara de bombeamento do coração) para a aorta (a maior artéria do corpo). A gravidade da condição é classificada pela medida da Área da Válvula Aórtica, cuja sigla é <Highlight>AVA</Highlight> (do inglês, <i>Aortic Valve Area</i>).
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li><Highlight>Saudável:</Highlight> AVA acima de 2.0 cm².</li>
                <li><Highlight>Estenose Leve:</Highlight> AVA entre 1.5 e 2.0 cm².</li>
                <li><Highlight>Estenose Moderada:</Highlight> AVA entre 1.0 e 1.5 cm².</li>
                <li><Highlight>Estenose Severa:</Highlight> AVA inferior a 1.0 cm².</li>
            </ul>
            <p className="mt-2">
                Quando a válvula se torna estenótica (estreita), o coração precisa gerar uma pressão muito maior para empurrar o sangue através da abertura reduzida. Isso leva a uma sobrecarga de trabalho para o coração, que, com o tempo, pode resultar em hipertrofia (espessamento do músculo cardíaco), insuficiência cardíaca e outros problemas graves.
            </p>
            
            <MainHeader>2. O MODELO</MainHeader>
            
            <p>
                O modelo matemático implementado nesta aplicação fundamenta-se na aplicação da <Highlight>Segunda Lei da Termodinâmica</Highlight> à fisiologia cardiovascular. Ele modela o ventrículo esquerdo como uma bomba e o sangue como o fluido de trabalho, permitindo calcular não apenas as variáveis hemodinâmicas tradicionais (como pressão e fluxo), mas também as trocas energéticas e a destruição de exergia associada à patologia. Esta abordagem integrada oferece uma visão mais profunda sobre o custo energético real que a estenose impõe ao coração, indo além das análises puramente mecânicas.
            </p>

            <SectionTitle>2.1 O COEFICIENTE DE DESCARGA</SectionTitle>
            <p>
                O Coeficiente de Descarga (<Code>Cd</Code>) é um parâmetro <Highlight>adimensional</Highlight> crucial na hemodinâmica valvar. Ele quantifica a eficiência com que o sangue escoa através do orifício da válvula, comparando o fluxo real com um fluxo teórico ideal (sem perdas).
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>Um <Code>Cd</Code> de <Highlight>1.0</Highlight> representaria um bocal perfeito, sem qualquer perda de energia por atrito ou turbulência, o que não ocorre em sistemas biológicos.</li>
                <li>Na prática, a geometria complexa da válvula e a viscosidade do sangue causam perdas de energia, resultando em um <Code>Cd</Code> <Highlight>menor que 1.0</Highlight>. Valores típicos para a válvula aórtica humana situam-se em torno de 0.85.</li>
            </ul>
            <p className="mt-2">
                No contexto desta simulação, o <Code>Cd</Code> é um componente fundamental da <Highlight>Fórmula de Gorlin</Highlight>, usada para calcular a queda de pressão através da válvula. Um <Code>Cd</Code> menor implica maiores perdas de energia, o que significa que o coração precisa gerar uma pressão ainda maior para superar a estenose, impactando diretamente o trabalho cardíaco e a destruição de exergia.
            </p>


             <SectionTitle>2.2 EFICIÊNCIA EXERGÉTICA</SectionTitle>
            <p>
                Para avaliar o desempenho do coração de uma perspectiva termodinâmica, o modelo utiliza duas eficiências chave:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>
                    <Highlight>η₁ (Eficiência do Motor):</Highlight> Esta eficiência mede quão bem o músculo cardíaco converte a energia química (exergia do metabolismo) em trabalho mecânico (bombeamento). É uma medida da <Highlight>eficiência intrínseca do coração como motor</Highlight>. Um valor alto de η₁ indica que o músculo cardíaco é muito eficaz em sua função primária de contração.
                </li>
                <li>
                    <Highlight>η₂ (Eficiência do Sistema):</Highlight> Esta é uma medida mais global. Ela avalia que porcentagem da energia metabólica inicial é efetivamente transferida para o sangue, aumentando sua capacidade de realizar trabalho (sua exergia) e circular pelo corpo. A eficiência η₂ leva em conta não apenas a eficiência do músculo cardíaco, mas também <Highlight>todas as perdas no sistema</Highlight>, principalmente a energia destruída pela turbulência e atrito na válvula aórtica estenótica.
                </li>
            </ul>
            <p className="mt-2">
                A comparação entre η₁ e η₂ é crucial. Em um coração saudável, as duas são relativamente próximas. Na estenose aórtica, <Highlight>η₁ pode permanecer alta</Highlight>, mas <Highlight>η₂ cai drasticamente</Highlight>, mostrando que, embora o músculo cardíaco trabalhe eficientemente, a maior parte desse trabalho é desperdiçada na válvula doente, não contribuindo para a circulação.
            </p>

            <SectionTitle>2.3 VISUALIZAÇÃO DOS RESULTADOS</SectionTitle>
            <p>
                A aba "Visualizar Gráficos" apresenta seis gráficos interativos que detalham o comportamento hemodinâmico e termodinâmico do coração sob o efeito da estenose aórtica. Cada gráfico foca em um aspecto específico do modelo:
            </p>
            <ul className="list-disc list-inside space-y-3 mt-2 pl-4">
                <li><Highlight>Gráfico (a) - Fluxo Sistólico:</Highlight> Mostra a vazão de sangue (em mL/s) que o ventrículo esquerdo consegue ejetar a cada batimento. Com a progressão da estenose, espera-se que este fluxo diminua, indicando a dificuldade de bombeamento.</li>
                <li><Highlight>Gráfico (b) - Queda de Pressão Aórtica:</Highlight> Quantifica a diferença de pressão (em mmHg) antes e depois da válvula aórtica. Este valor representa a "barreira" que o coração precisa vencer. Quanto mais severa a estenose, maior será a queda de pressão.</li>
                <li><Highlight>Gráfico (c) - Metabolismo e Trabalho:</Highlight> Compara a energia total que o coração consome (<Code>Metabolismo</Code>) com a potência mecânica que ele efetivamente gera (<Code>Trabalho</Code>), ambas em Watts. Este gráfico ilustra o crescente custo energético imposto pela estenose.</li>
                <li><Highlight>Gráfico (d) - Análise de Exergia:</Highlight> Decompõe o destino da energia. Ele mostra a exergia útil transferida para o sangue (<Code>Ex. Sangue</Code>) em comparação com a exergia que é permanentemente perdida ou "destruída" (<Code>Ex. Destruída</Code>) devido às ineficiências na válvula estenótica.</li>
                <li><Highlight>Gráfico (e) - Eficiência Exergética η₁:</Highlight> Apresenta a eficiência do músculo cardíaco como um "motor biológico". Este valor percentual indica quão bem o coração converte energia química em trabalho mecânico.</li>
                <li><Highlight>Gráfico (f) - Eficiência Exergética η₂:</Highlight> Mede a eficiência global do sistema cardiovascular (coração + válvula + sangue). Este percentual revela que parte da energia metabólica inicial é de fato utilizada para impulsionar o sangue pelo corpo, já considerando as perdas na válvula. A queda de η₂ é um indicador chave da gravidade da doença.</li>
            </ul>

        </div>
    );
};

export default IntroductionContent;
