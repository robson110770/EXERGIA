
import React from 'react';

const ResearcherCard: React.FC<{ name: string; title: string; bio?: React.ReactNode }> = ({ name, title, bio }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">
            {name}
        </h3>
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 italic">
            {title}
        </h4>
        {bio && (
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed text-justify">
                {bio}
            </div>
        )}
    </div>
);

const TeamContent: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
            <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
                EQUIPE DE PESQUISA
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
                Conheça os pesquisadores e especialistas responsáveis pelo desenvolvimento científico e técnico desta ferramenta de análise exergética.
            </p>

            <div className="space-y-8">
                
                {/* Maria Luiza */}
                <ResearcherCard 
                    name="1. Maria Luiza Zitei Brandão" 
                    title="Engenheira Mecânica e Mestranda em Engenharia Biomédica"
                    bio={null}
                />

                {/* Fabiano Menegidio */}
                <ResearcherCard 
                    name="2. Prof. Dr. Fabiano Bezerra Menegidio" 
                    title="Doutor em Engenharia Biomédica" 
                    bio={
                        <>
                            <p>
                                Coordenador do Programa de Pós-Graduação Integrado em Engenharia Biomédica e do Núcleo de Pesquisa Tecnológica (NPT) da Universidade de Mogi das Cruzes (UMC).
                            </p>
                            <p>
                                Coordenador do Laboratório de Bioinformática e Ciências Ômicas (LaBiOmicS) vinculado ao Núcleo Integrado de Biotecnologia (NIB) e ao Núcleo de Pesquisas Tecnológicas (NPT), ambos da UMC. Docente dos programas de pós-graduação <i>strictu sensu</i> em Engenharia Biomédica e Biotecnologia da Universidade de Mogi das Cruzes (UMC).
                            </p>
                            <p>
                                Atua coordenando projetos de pesquisa de Bioinformática focados em Transcriptômica, Genômica, Metabolômica, Microbioma e Metagenômica, em áreas do conhecimento da Biotecnologia e Engenharia Biomédica.
                            </p>
                            <p>
                                É também Cofundador e Chief Technology Officer (CTO) das startups de base biotecnológicas <strong>EasyOmics</strong> e <strong>Brycon Soluções Biotecnológicas</strong>.
                            </p>
                        </>
                    }
                />

                {/* Robson Rodrigues */}
                <ResearcherCard 
                    name="3. Prof. Dr. Robson Rodrigues da Silva" 
                    title="Doutor em Engenharia Biomédica" 
                    bio={
                        <>
                            <p>
                                Possui Licenciatura e Bacharelado em Matemática pela Universidade de Mogi das Cruzes (UMC - 1992), Mestrado em Ciências (Matemática) pela Universidade de São Paulo (IME/USP - 2004) e Doutorado em Engenharia Biomédica pela Universidade de Mogi das Cruzes (NPT/UMC - 2012).
                            </p>
                            <p>
                                É professor do Colégio Unisuz e da Universidade de Mogi das Cruzes (UMC). Atualmente é pesquisador do Núcleo de Pesquisas Tecnológicas (NPT/UMC), membro titular do Comitê de Ética em Pesquisa (CEP/UMC), pesquisador colaborador do Laboratório Nacional para Estudo do Cálcio Celular (LabNECC) vinculado ao Centro de Engenharia Biomédica da UNICAMP e Vice Coordenador do Programa de Mestrado e Doutorado em Engenharia Biomédica da UMC.
                            </p>
                            <p>
                                É assessor científico da Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP) e coordenador de projeto FAPESP (processo: 2016/18422-7) intitulado: <i>"Implementação, avaliação e comparação dos modelos de força de contração e/ou encurtamento celular para miócito ventricular de rato"</i>.
                            </p>
                            <p>
                                Como pesquisador possui experiência em Matemática e Engenharia Biomédica (Bioengenharia), com ênfase nas áreas de Cálculo Diferencial e Integral, Álgebra e Modelagem de Sistemas e Fenômenos Biológicos, atuando principalmente nos seguintes temas: Modelagem Matemática e Simulação Computacional da Eletrofisiologia Cardíaca e Aplicações do Cálculo Diferencial e Integral.
                            </p>
                        </>
                    }
                />

            </div>
        </div>
    );
};

export default TeamContent;
