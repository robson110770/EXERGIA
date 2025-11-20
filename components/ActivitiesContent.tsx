
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ActivityCard: React.FC<{ 
    number: number; 
    title: string; 
    objective: string; 
    config: React.ReactNode; 
    analysis: React.ReactNode; 
    conclusion: string 
}> = ({ number, title, objective, config, analysis, conclusion }) => {
    const [isConclusionVisible, setIsConclusionVisible] = useState(false);
    const { language } = useLanguage();

    const t = {
        pt: {
            objLabel: "Objetivo:",
            configLabel: "Configuração do Painel",
            analysisLabel: "O que Analisar",
            hide: "Ocultar Conclusão",
            show: "Ver Conclusão Esperada",
            concLabel: "Conclusão Esperada"
        },
        en: {
            objLabel: "Objective:",
            configLabel: "Panel Configuration",
            analysisLabel: "What to Analyze",
            hide: "Hide Conclusion",
            show: "See Expected Conclusion",
            concLabel: "Expected Conclusion"
        }
    }[language];

    return (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-600 mb-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm mr-3">
                    {number}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300 text-sm italic">
                <strong>{t.objLabel}</strong> {objective}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded border border-blue-100 dark:border-blue-900/30">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">{t.configLabel}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {config}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded border border-orange-100 dark:border-orange-900/30">
                    <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-2">{t.analysisLabel}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {analysis}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <button 
                    onClick={() => setIsConclusionVisible(!isConclusionVisible)}
                    className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none transition-colors"
                >
                    {isConclusionVisible ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                            {t.hide}
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.274 4.057 5.064 3 10 3s8.726 1.057 9.542 7c-.816 5.943-4.606 7-9.542 7S1.274 15.943.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {t.show}
                        </>
                    )}
                </button>

                {isConclusionVisible && (
                    <div className="mt-3 bg-blue-50 dark:bg-blue-900/10 p-4 rounded border-l-4 border-blue-500 animate-fade-in">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{t.concLabel}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 text-justify">
                            {conclusion}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ActivitiesContent: React.FC = () => {
    const { language } = useLanguage();

    if (language === 'en') {
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
                <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
                    SUGGESTED ACTIVITIES
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
                    Simulation proposals to explore hemodynamic and cardiac thermodynamic concepts using CardioExergy.
                </p>
    
                <ActivityCard 
                    number={1}
                    title="The Compensation Paradox (Tachycardia)"
                    objective="Demonstrate why increased heart rate (a common compensation mechanism) can be energetically disastrous in patients with stenosis."
                    config={
                        <ul className="list-disc list-inside">
                            <li><strong>Control Tab:</strong> HR = 70 bpm (Rest).</li>
                            <li><strong>Test Tab:</strong> HR = 100 bpm (Effort).</li>
                            <li>Keep other parameters equal.</li>
                        </ul>
                    }
                    analysis={
                        <ul className="list-disc list-inside">
                            <li>Focus on <strong>Severe Stenosis (AVA &lt; 1.0)</strong> region.</li>
                            <li>See chart <strong>(b) Pressure Drop</strong>.</li>
                            <li>See chart <strong>(d) Exergy Analysis</strong> (Destr. Ex.).</li>
                        </ul>
                    }
                    conclusion="The test scenario (100 bpm) will show a disproportionate increase in pressure drop and exergy destruction in the valves. This illustrates the high energy cost of trying to pump blood quickly through a stenotic orifice, drastically increasing cardiac metabolism without proportional gain in effective flow."
                />
    
                <ActivityCard 
                    number={2}
                    title="Importance of Valve Geometry (Cd)"
                    objective="Show that geometric area (AVA) is not the only factor; valve 'shape' and aerodynamics matter."
                    config={
                        <ul className="list-disc list-inside">
                            <li><strong>Control Tab:</strong> Cd = 0.85 (Typical Valve).</li>
                            <li><strong>Test Tab:</strong> Cd = 0.60 (Calcified/Irregular Valve).</li>
                            <li>Compare for the same AVA (e.g., 1.0 cm²).</li>
                        </ul>
                    }
                    analysis={
                        <ul className="list-disc list-inside">
                            <li>Go to <strong>View Data</strong> tab.</li>
                            <li>Compare <strong>Pressure Drop</strong> column.</li>
                            <li>Compare <strong>Efficiency η₂</strong> column.</li>
                        </ul>
                    }
                    conclusion="Even with the same opening area (AVA), the valve with lower Cd 'deceives' the flow, behaving as if it were much smaller (Reduced Effective Area). This generates much more pressure loss and drop in system efficiency (η₂), proving that orifice quality is as vital as its size."
                />
    
                <ActivityCard 
                    number={3}
                    title="The 'Cost' of Cold: Pure Thermodynamics"
                    objective="Analyze model sensitivity to Reference Temperature (T₀), isolating the thermal component of Exergy."
                    config={
                        <ul className="list-disc list-inside">
                            <li><strong>Control Tab:</strong> T₀ = 37.0°C (Body Environment).</li>
                            <li><strong>Test Tab:</strong> T₀ = 20.0°C (Hypothermia/Operating Room).</li>
                            <li>Note: Heart temperature is fixed at 38.8°C.</li>
                        </ul>
                    }
                    analysis={
                        <ul className="list-disc list-inside">
                            <li>Focus on <strong>Efficiency η₁ and η₂</strong> charts.</li>
                            <li>Observe subtle changes in absolute values.</li>
                        </ul>
                    }
                    conclusion="By drastically lowering T₀, the theoretical work potential (Carnot Factor: 1 - T₀/T) increases. The model will show a change in efficiencies, serving as a theoretical lesson on how defining the 'dead state' alters the perception of thermodynamic efficiency, even if mechanics (pressure/flow) remain unchanged."
                />
    
                <ActivityCard 
                    number={4}
                    title="Therapeutic Bradycardia?"
                    objective="Investigate if reducing heart rate improves thermodynamic efficiency in severe cases."
                    config={
                        <ul className="list-disc list-inside">
                            <li><strong>Control Tab:</strong> HR = 75 bpm.</li>
                            <li><strong>Test Tab:</strong> HR = 55 bpm (Bradycardia/Athlete).</li>
                            <li>Observe the Metabolism curve.</li>
                        </ul>
                    }
                    analysis={
                        <ul className="list-disc list-inside">
                            <li>Chart <strong>(c) Metabolism and Work</strong>.</li>
                            <li>Compare Metabolism (M_Heart) in severe stenosis.</li>
                        </ul>
                    }
                    conclusion="By reducing frequency, the number of cycles per minute drops, reducing total accumulated turbulence over time. This leads to Metabolism (M_Heart) savings, helping explain from an energetic standpoint why HR-reducing drugs (like beta-blockers) can be used to 'spare' the heart."
                />
    
                <ActivityCard 
                    number={5}
                    title="The Efficiency Collapse Point"
                    objective="Visually identify the tipping point where the disease becomes uncompensable."
                    config={
                        <ul className="list-disc list-inside">
                            <li>Use <strong>Control</strong> mode only.</li>
                            <li>Set Min AVA: 0.5 and Max: 3.5.</li>
                        </ul>
                    }
                    analysis={
                        <ul className="list-disc list-inside">
                            <li>Observe exclusively <strong>Chart (f) Efficiency η₂</strong>.</li>
                            <li>Try to find the AVA value where the curve starts falling 'vertically'.</li>
                        </ul>
                    }
                    conclusion="Generally, at AVA > 2.0, the curve is almost flat (high efficiency). Between 1.5 and 1.0, it starts to slope. Below 1.0 (Severe), it plummets. This graph thermodynamically justifies surgical intervention: below a certain point, system efficiency is nearly zero and all engine energy is being destroyed."
                />
            </div>
        );
    }

    // Default Portuguese
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
            <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
                ATIVIDADES SUGERIDAS
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
                Propostas de simulação para explorar os conceitos de hemodinâmica e termodinâmica cardíaca utilizando o CardioExergy.
            </p>

            <ActivityCard 
                number={1}
                title="O Paradoxo da Compensação (Taquicardia)"
                objective="Demonstrar por que o aumento da frequência cardíaca (mecanismo comum de compensação) pode ser energeticamente desastroso em pacientes com estenose."
                config={
                    <ul className="list-disc list-inside">
                        <li><strong>Aba Controle:</strong> FC = 70 bpm (Repouso).</li>
                        <li><strong>Aba Teste:</strong> FC = 100 bpm (Esforço).</li>
                        <li>Mantenha os demais parâmetros iguais.</li>
                    </ul>
                }
                analysis={
                    <ul className="list-disc list-inside">
                        <li>Foque na região de <strong>Estenose Severa (AVA &lt; 1.0)</strong>.</li>
                        <li>Veja o gráfico <strong>(b) Queda de Pressão</strong>.</li>
                        <li>Veja o gráfico <strong>(d) Análise de Exergia</strong> (Ex. Destruída).</li>
                    </ul>
                }
                conclusion="O cenário de teste (100 bpm) mostrará um aumento desproporcional na queda de pressão e na destruição de exergia nas válvulas. Isso ilustra o alto custo energético de tentar bombear sangue rapidamente através de um orifício estenótico, aumentando drasticamente o metabolismo cardíaco sem ganho proporcional de fluxo efetivo."
            />

            <ActivityCard 
                number={2}
                title="A Importância da Geometria Valvar (Cd)"
                objective="Mostrar que a área geométrica (AVA) não é o único fator; a 'forma' e a aerodinâmica da válvula importam."
                config={
                    <ul className="list-disc list-inside">
                        <li><strong>Aba Controle:</strong> Cd = 0.85 (Válvula típica).</li>
                        <li><strong>Aba Teste:</strong> Cd = 0.60 (Válvula calcificada/irregular).</li>
                        <li>Compare para uma mesma AVA (ex: 1.0 cm²).</li>
                    </ul>
                }
                analysis={
                    <ul className="list-disc list-inside">
                        <li>Vá para a aba <strong>Visualizar Dados</strong>.</li>
                        <li>Compare a coluna <strong>Queda de Pressão</strong>.</li>
                        <li>Compare a coluna <strong>Eficiência η₂</strong>.</li>
                    </ul>
                }
                conclusion="Mesmo com a mesma área de abertura (AVA), a válvula com Cd menor 'engana' o fluxo, comportando-se como se fosse muito menor (Área Efetiva reduzida). Isso gera muito mais perda de pressão e queda na eficiência do sistema (η₂), provando que a qualidade do orifício é tão vital quanto seu tamanho."
            />

            <ActivityCard 
                number={3}
                title="O 'Custo' do Frio: Termodinâmica Pura"
                objective="Analisar a sensibilidade do modelo à Temperatura de Referência (T₀), isolando o componente térmico da Exergia."
                config={
                    <ul className="list-disc list-inside">
                        <li><strong>Aba Controle:</strong> T₀ = 37.0°C (Ambiente corpóreo).</li>
                        <li><strong>Aba Teste:</strong> T₀ = 20.0°C (Hipotermia/Centro Cirúrgico).</li>
                        <li>Nota: A temperatura do coração é fixa em 38.8°C.</li>
                    </ul>
                }
                analysis={
                    <ul className="list-disc list-inside">
                        <li>Foque nos gráficos de <strong>Eficiência η₁ e η₂</strong>.</li>
                        <li>Observe mudanças sutis nos valores absolutos.</li>
                    </ul>
                }
                conclusion="Ao baixar T₀ drasticamente, aumenta-se o potencial de trabalho teórico (Fator de Carnot: 1 - T₀/T). O modelo mostrará uma mudança nas eficiências, servindo como uma aula teórica sobre como a definição do 'estado morto' altera a percepção da eficiência termodinâmica, mesmo que a mecânica (pressão/fluxo) permaneça inalterada."
            />

            <ActivityCard 
                number={4}
                title="Bradicardia Terapêutica?"
                objective="Investigar se reduzir a frequência cardíaca melhora a eficiência termodinâmica em casos severos."
                config={
                    <ul className="list-disc list-inside">
                        <li><strong>Aba Controle:</strong> FC = 75 bpm.</li>
                        <li><strong>Aba Teste:</strong> FC = 55 bpm (Bradicardia/Atleta).</li>
                        <li>Observe a curva de Metabolismo.</li>
                    </ul>
                }
                analysis={
                    <ul className="list-disc list-inside">
                        <li>Gráfico <strong>(c) Metabolismo e Trabalho</strong>.</li>
                        <li>Compare o Metabolismo (M_Heart) na estenose severa.</li>
                    </ul>
                }
                conclusion="Ao reduzir a frequência, o número de ciclos por minuto cai, reduzindo a turbulência total acumulada no tempo. Isso leva a uma economia de Metabolismo (M_Heart), ajudando a explicar, do ponto de vista energético, por que medicamentos que reduzem a FC (como beta-bloqueadores) podem ser usados para 'poupar' o coração."
            />

            <ActivityCard 
                number={5}
                title="O Ponto de Colapso da Eficiência"
                objective="Identificar visualmente o ponto de inflexão onde a doença deixa de ser compensável."
                config={
                    <ul className="list-disc list-inside">
                        <li>Use apenas o modo <strong>Controle</strong>.</li>
                        <li>Configure AVA Mínima: 0.5 e Máxima: 3.5.</li>
                    </ul>
                }
                analysis={
                    <ul className="list-disc list-inside">
                        <li>Observe exclusivamente o <strong>Gráfico (f) Eficiência η₂</strong>.</li>
                        <li>Tente encontrar o valor de AVA onde a curva começa a cair 'verticalmente'.</li>
                    </ul>
                }
                conclusion="Geralmente, em AVA > 2.0, a curva é quase plana (alta eficiência). Entre 1.5 e 1.0, ela começa a inclinar. Abaixo de 1.0 (Severa), ela despenca. Este gráfico justifica termodinamicamente a intervenção cirúrgica: abaixo de certo ponto, a eficiência do sistema é quase nula e toda a energia do motor está sendo destruída."
            />

        </div>
    );
};

export default ActivitiesContent;
