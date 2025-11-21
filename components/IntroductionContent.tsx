
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
    const { language } = useLanguage();

    if (language === 'en') {
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
                 <h2 className="text-xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                    EXERGY ANALYSIS OF THE HEART WITH AORTIC STENOSIS
                </h2>

                <div className="mb-10 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <p className="mb-4 text-justify">
                        <strong>CardioExergy</strong> is an interactive scientific tool designed to assist students, researchers, and healthcare professionals in understanding cardiac bioenergetics under pathological conditions.
                    </p>
                    
                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">Objective</h4>
                    <p className="text-justify">
                        The main objective is to simulate the impact of <Highlight>Aortic Stenosis</Highlight> on the heart's energy efficiency. Unlike traditional approaches focusing only on pressure and flow (hemodynamics), this app uses <Highlight>Exergy Analysis</Highlight> (thermodynamics) to quantify the waste of useful energy (irreversibility) caused by the diseased valve.
                    </p>
                </div>
                
                <MainHeader>1. THEORETICAL FOUNDATION</MainHeader>
    
                <SectionTitle>1.1 WHAT IS EXERGY</SectionTitle>
                <p>
                    Exergy is a measure of <Highlight>energy quality</Highlight>. Unlike energy, which is always conserved (First Law of Thermodynamics), exergy can be destroyed in any real process (Second Law of Thermodynamics). Simply put, exergy represents the <Highlight>maximum potential of useful work</Highlight> that can be extracted from a system. In a physiological context, exergy analysis allows quantifying the efficiency with which the body uses metabolic energy to perform work (such as pumping blood) and where inefficiencies (exergy destruction) occur.
                </p>
    
                <SectionTitle>1.2 THE HEART AND ITS VALVES</SectionTitle>
                <p>
                    The human heart has four chambers (two atria and two ventricles) and four valves that ensure unidirectional blood flow:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li><Highlight>Tricuspid Valve:</Highlight> Between the right atrium and right ventricle.</li>
                    <li><Highlight>Pulmonary Valve:</Highlight> Between the right ventricle and pulmonary artery.</li>
                    <li><Highlight>Mitral Valve:</Highlight> Between the left atrium and left ventricle.</li>
                    <li><Highlight>Aortic Valve:</Highlight> Between the left ventricle and aorta. This is the focus of this simulation.</li>
                </ul>
                <p className="mt-2">
                    In this model, aortic valve stenosis is the main pathological factor. The simulation analyzes how the reduction of this valve's opening area (<Highlight>AVA</Highlight>) impacts the thermodynamics and efficiency of the heart.
                </p>
    
                <SectionTitle>1.3 WHAT IS AORTIC STENOSIS</SectionTitle>
                
                <div className="flex flex-col items-center my-6">
                    <img 
                        src="http://rodrigues.mat.br/wp-content/uploads/2025/11/Captura-de-Tela-2025-11-14-as-22.26.35.png" 
                        alt="Illustration of Aortic Stenosis and blood flow" 
                        className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-full h-auto"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Source: <a href="https://www.drdiegogaia.com.br/estenose-aortica-grave" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">https://www.drdiegogaia.com.br/estenose-aortica-grave</a>
                    </p>
                </div>
    
                <p>
                    Aortic stenosis is a heart condition characterized by the <Highlight>abnormal narrowing of the aortic valve opening</Highlight>. This valve controls blood flow from the left ventricle (the heart's main pumping chamber) to the aorta (the body's largest artery). The severity of the condition is classified by the measurement of the Aortic Valve Area, abbreviated as <Highlight>AVA</Highlight>.
                </p>
                
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li><Highlight>Healthy:</Highlight> AVA above 2.0 cm².</li>
                    <li><Highlight>Mild Stenosis:</Highlight> AVA between 1.5 and 2.0 cm².</li>
                    <li><Highlight>Moderate Stenosis:</Highlight> AVA between 1.0 and 1.5 cm².</li>
                    <li><Highlight>Severe Stenosis:</Highlight> AVA below 1.0 cm².</li>
                </ul>
                <p className="mt-2">
                    When the valve becomes stenotic (narrow), the heart needs to generate much higher pressure to push blood through the reduced opening. This leads to a work overload for the heart, which over time can result in hypertrophy (thickening of the heart muscle), heart failure, and other serious problems.
                </p>
                
                <MainHeader>2. THE MODEL</MainHeader>
                
                <p>
                    The mathematical model implemented in this application is based on the application of the <Highlight>Second Law of Thermodynamics</Highlight> to cardiovascular physiology. It models the left ventricle as a pump and blood as the working fluid, allowing the calculation not only of traditional hemodynamic variables (such as pressure and flow) but also energy exchanges and exergy destruction associated with the pathology. This integrated approach offers deeper insight into the real energy cost that stenosis imposes on the heart, going beyond purely mechanical analyses.
                </p>
    
                <SectionTitle>2.1 THE DISCHARGE COEFFICIENT</SectionTitle>
                <p>
                    The Discharge Coefficient (<Code>Cd</Code>) is a crucial <Highlight>dimensionless</Highlight> parameter in valvular hemodynamics. It quantifies the efficiency with which blood flows through the valve orifice, comparing actual flow with an ideal theoretical flow (without losses).
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>A <Code>Cd</Code> of <Highlight>1.0</Highlight> would represent a perfect nozzle, without any energy loss due to friction or turbulence, which does not occur in biological systems.</li>
                    <li>In practice, complex valve geometry and blood viscosity cause energy losses, resulting in a <Code>Cd</Code> <Highlight>less than 1.0</Highlight>. Typical values for the human aortic valve are around 0.85.</li>
                </ul>
                <p className="mt-2">
                    In the context of this simulation, <Code>Cd</Code> is a fundamental component of the <Highlight>Gorlin Formula</Highlight>, used to calculate pressure drop across the valve. A lower <Code>Cd</Code> implies greater energy losses, meaning the heart needs to generate even higher pressure to overcome stenosis, directly impacting heart work and exergy destruction.
                </p>
    
    
                 <SectionTitle>2.2 EXERGY EFFICIENCY</SectionTitle>
                <p>
                    To evaluate heart performance from a thermodynamic perspective, the model uses two key efficiencies:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>
                        <Highlight>η₁ (Motor Efficiency):</Highlight> This efficiency measures how well the heart muscle converts chemical energy (metabolic exergy) into mechanical work (pumping). It is a measure of the <Highlight>intrinsic efficiency of the heart as an engine</Highlight>. A high η₁ value indicates that the heart muscle is very effective in its primary contraction function.
                    </li>
                    <li>
                        <Highlight>η₂ (System Efficiency):</Highlight> This is a more global measure. It assesses what percentage of the initial metabolic energy is effectively transferred to the blood, increasing its capacity to perform work (its exergy) and circulate through the body. Efficiency η₂ takes into account not only heart muscle efficiency but also <Highlight>all losses in the system</Highlight>, mainly energy destroyed by turbulence and friction in the stenotic aortic valve.
                    </li>
                </ul>
                <p className="mt-2">
                    Comparing η₁ and η₂ is crucial. In a healthy heart, the two are relatively close. In aortic stenosis, <Highlight>η₁ may remain high</Highlight>, but <Highlight>η₂ drops drastically</Highlight>, showing that although the heart muscle works efficiently, most of that work is wasted in the diseased valve, not contributing to circulation.
                </p>
    
                <SectionTitle>2.3 VISUALIZATION OF RESULTS</SectionTitle>
                <p>
                    The "View Charts" tab presents six interactive graphs detailing the hemodynamic and thermodynamic behavior of the heart under the effect of aortic stenosis. Each graph focuses on a specific aspect of the model:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-2 pl-4">
                    <li><Highlight>Chart (a) - Stroke Volume:</Highlight> Shows the volume of blood (in mL) that the left ventricle manages to eject with each beat. With the progression of stenosis, this volume is expected to decrease, indicating pumping difficulty.</li>
                    <li><Highlight>Chart (b) - Aortic Pressure Drop:</Highlight> Quantifies the pressure difference (in mmHg) before and after the aortic valve. This value represents the "barrier" the heart needs to overcome. The more severe the stenosis, the greater the pressure drop.</li>
                    <li><Highlight>Chart (c) - Metabolism and Work:</Highlight> Compares the total energy the heart consumes (<Code>Metabolism</Code>) with the mechanical power it effectively generates (<Code>Work</Code>), both in Watts. This graph illustrates the growing energy cost imposed by stenosis.</li>
                    <li><Highlight>Chart (d) - Exergy Analysis:</Highlight> Decomposes energy destination. It shows useful exergy transferred to blood (<Code>Blood Ex.</Code>) compared to exergy that is permanently lost or "destroyed" (<Code>Destroyed Ex.</Code>) due to inefficiencies in the stenotic valve.</li>
                    <li><Highlight>Chart (e) - Exergy Efficiency η₁:</Highlight> Presents the efficiency of the heart muscle as a "biological engine". This percentage value indicates how well the heart converts chemical energy into mechanical work.</li>
                    <li><Highlight>Chart (f) - Exergy Efficiency η₂:</Highlight> Measures the global efficiency of the cardiovascular system (heart + valve + blood). This percentage reveals what part of the initial metabolic energy is actually used to propel blood through the body, already considering losses in the valve. The drop in η₂ is a key indicator of disease severity.</li>
                </ul>
    
                <SectionTitle>2.4 THERMAL CONSIDERATIONS</SectionTitle>
                <p>
                    In thermodynamics, the <Highlight>Reference Temperature (T₀)</Highlight> is the temperature of the "environment" to which heat is rejected. In the context of this physiological model:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li>
                        <strong>Reference Temperature (T₀):</strong> Represents the average body temperature (the heart's immediate environment), generally set at <Highlight>37.0°C</Highlight>.
                    </li>
                    <li>
                        <strong>Heart Temperature (T<sub>Heart</sub>):</strong> Is the operating temperature of the heart muscle and intraventricular blood. Due to intense metabolic activity, the heart operates at a slightly higher temperature than the body (e.g., <Highlight>38.8°C</Highlight>).
                    </li>
                </ul>
                <p className="mt-2">
                    The difference between T<sub>Heart</sub> and T₀, although small, contributes to the calculation of the blood's thermal physical exergy.
                </p>
    
            </div>
        );
    }

    // Default Portuguese Return
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
             <h2 className="text-xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                ANÁLISE EXERGÉTICA DO CORAÇÃO COM ESTENOSE AÓRTICA
            </h2>
            
            <div className="mb-10 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <p className="mb-4 text-justify">
                    O <strong>CardioExergy</strong> é uma ferramenta científica interativa desenvolvida para auxiliar estudantes, pesquisadores e profissionais da saúde na compreensão da bioenergética cardíaca sob condições patológicas.
                </p>
                
                <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">Objetivo</h4>
                <p className="text-justify">
                    O objetivo principal é simular o impacto da <Highlight>Estenose Aórtica</Highlight> na eficiência energética do coração. Ao contrário das abordagens tradicionais que focam apenas em pressão e fluxo (hemodinâmica), este aplicativo utiliza a <Highlight>Análise de Exergia</Highlight> (termodinâmica) para quantificar o desperdício de energia útil (irreversibilidade) causado pela válvula doente.
                </p>
            </div>

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
            
            <div className="flex flex-col items-center my-6">
                <img 
                    src="http://rodrigues.mat.br/wp-content/uploads/2025/11/Captura-de-Tela-2025-11-14-as-22.26.35.png" 
                    alt="Ilustração da Estenose Aórtica e o fluxo sanguíneo" 
                    className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-full h-auto"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Fonte: <a href="https://www.drdiegogaia.com.br/estenose-aortica-grave" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">https://www.drdiegogaia.com.br/estenose-aortica-grave</a>
                </p>
            </div>

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
                <li><Highlight>Gráfico (a) - Volume Sistólico:</Highlight> Mostra o volume de sangue (em mL) que o ventrículo esquerdo consegue ejetar a cada batimento. Com a progressão da estenose, espera-se que este volume diminua, indicando a dificuldade de bombeamento.</li>
                <li><Highlight>Gráfico (b) - Queda de Pressão Aórtica:</Highlight> Quantifica a diferença de pressão (em mmHg) antes e depois da válvula aórtica. Este valor representa a "barreira" que o coração precisa vencer. Quanto mais severa a estenose, maior será a queda de pressão.</li>
                <li><Highlight>Gráfico (c) - Metabolismo e Trabalho:</Highlight> Compara a energia total que o coração consome (<Code>Metabolismo</Code>) com a potência mecânica que ele efetivamente gera (<Code>Trabalho</Code>), ambas em Watts. Este gráfico ilustra o crescente custo energético imposto pela estenose.</li>
                <li><Highlight>Gráfico (d) - Análise de Exergia:</Highlight> Decompõe o destino da energia. Ele mostra a exergia útil transferida para o sangue (<Code>Ex. Sangue</Code>) em comparação com a exergia que é permanentemente perdida ou "destruída" (<Code>Ex. Destruída</Code>) devido às ineficiências na válvula estenótica.</li>
                <li><Highlight>Gráfico (e) - Eficiência Exergética η₁:</Highlight> Apresenta a eficiência do músculo cardíaco como um "motor biológico". Este valor percentual indica quão bem o coração converte energia química em trabalho mecânico.</li>
                <li><Highlight>Gráfico (f) - Eficiência Exergética η₂:</Highlight> Mede a eficiência global do sistema cardiovascular (coração + válvula + sangue). Este percentual revela que parte da energia metabólica inicial é de fato utilizada para impulsionar o sangue pelo corpo, já considerando as perdas na válvula. A queda de η₂ é um indicador chave da gravidade da doença.</li>
            </ul>

            <SectionTitle>2.4 CONSIDERAÇÕES TÉRMICAS</SectionTitle>
            <p>
                Na termodinâmica, a <Highlight>Temperatura de Referência (T₀)</Highlight> é a temperatura do "ambiente" para o qual o calor é rejeitado. No contexto deste modelo fisiológico:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                <li>
                    <strong>Temperatura de Referência (T₀):</strong> Representa a temperatura média do corpo humano (o ambiente imediato do coração), geralmente definida em <Highlight>37.0°C</Highlight>.
                </li>
                <li>
                    <strong>Temperatura do Coração (T<sub>Heart</sub>):</strong> É a temperatura operacional do músculo cardíaco e do sangue intraventricular. Devido à intensa atividade metabólica, o coração opera a uma temperatura ligeiramente superior à do corpo (ex: <Highlight>38.8°C</Highlight>).
                </li>
            </ul>
            <p className="mt-2">
                A diferença entre T<sub>Heart</sub> e T₀, embora pequena, contribui para o cálculo da exergia física térmica do sangue.
            </p>

        </div>
    );
};

export default IntroductionContent;
