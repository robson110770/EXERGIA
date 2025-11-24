import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ResearcherCard: React.FC<{ name: string; title: string; bio?: React.ReactNode; imageUrl?: string }> = ({ name, title, bio, imageUrl }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {imageUrl && (
            <div className="flex-shrink-0">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white dark:border-gray-600 shadow-sm"
                />
            </div>
        )}
        <div className="flex-grow text-center md:text-left">
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
    </div>
);

const TeamContent: React.FC = () => {
    const { language } = useLanguage();

    const t = {
        pt: {
            title: "EQUIPE DE PESQUISA",
            desc: "Conheça os pesquisadores e especialistas responsáveis pelo desenvolvimento científico e técnico desta ferramenta de análise exergética.",
            titles: {
                me: "Engenheira Mecânica e Mestranda em Engenharia Biomédica",
                biotech: "Doutor em Biotecnologia",
                biomed: "Doutor em Engenharia Biomédica"
            },
            maria: {
                p1: "Graduada em Engenharia Mecânica pela Universidade de Mogi das Cruzes (2024) e Ensino Médio pelo Colégio São Marcos (2019). Tem experiência na área de Engenharia Mecânica e participou de projetos de Iniciação Científica."
            },
            fabiano: {
                p1: "Coordenador do Programa de Pós-Graduação Integrado em Engenharia Biomédica e do Núcleo de Pesquisa Tecnológica (NPT) da Universidade de Mogi das Cruzes (UMC).",
                p2: "Coordenador do Laboratório de Bioinformática e Ciências Ômicas (LaBiOmicS) vinculado ao Núcleo Integrado de Biotecnologia (NIB) e ao Núcleo de Pesquisas Tecnológicas (NPT), ambos da UMC. Docente dos programas de pós-graduação strictu sensu em Engenharia Biomédica e Biotecnologia da Universidade de Mogi das Cruzes (UMC).",
                p3: "Atua coordenando projetos de pesquisa de Bioinformática focados em Transcriptômica, Genômica, Metabolômica, Microbioma e Metagenômica, em áreas do conhecimento da Biotecnologia e Engenharia Biomédica.",
                p4: "É também Cofundador e Chief Technology Officer (CTO) das startups de base biotecnológicas EasyOmics e Brycon Soluções Biotecnológicas."
            },
            robson: {
                p1: "Possui Licenciatura e Bacharelado em Matemática pela Universidade de Mogi das Cruzes (UMC - 1992), Mestrado em Ciências (Matemática) pela Universidade de São Paulo (IME/USP - 2004) e Doutorado em Engenharia Biomédica pela Universidade de Mogi das Cruzes (NPT/UMC - 2012).",
                p2: "É professor do Colégio Unisuz e da Universidade de Mogi das Cruzes (UMC). Atualmente é pesquisador do Núcleo de Pesquisas Tecnológicas (NPT/UMC), membro titular do Comitê de Ética em Pesquisa (CEP/UMC), pesquisador colaborador do Laboratório Nacional para Estudo do Cálcio Celular (LabNECC) vinculado ao Centro de Engenharia Biomédica da UNICAMP e Vice Coordenador do Programa de Mestrado e Doutorado em Engenharia Biomédica da UMC.",
                p3: "É assessor científico da Fundação de Amparo à Pesquisa do Estado de São Paulo (FAPESP) e coordenador de projeto FAPESP (processo: 2016/18422-7) intitulado: \"Implementação, avaliação e comparação dos modelos de força de contração e/ou encurtamento celular para miócito ventricular de rato\".",
                p4: "Como pesquisador possui experiência em Matemática e Engenharia Biomédica (Bioengenharia), com ênfase nas áreas de Cálculo Diferencial e Integral, Álgebra e Modelagem de Sistemas e Fenômenos Biológicos, atuando principalmente nos seguintes temas: Modelagem Matemática e Simulação Computacional da Eletrofisiologia Cardíaca e Aplicações do Cálculo Diferencial e Integral."
            }
        },
        en: {
            title: "RESEARCH TEAM",
            desc: "Meet the researchers and specialists responsible for the scientific and technical development of this exergy analysis tool.",
            titles: {
                me: "Mechanical Engineer and Master's Student in Biomedical Engineering",
                biotech: "PhD in Biotechnology",
                biomed: "PhD in Biomedical Engineering"
            },
            maria: {
                p1: "Graduated in Mechanical Engineering from the University of Mogi das Cruzes (2024) and High School from Colégio São Marcos (2019). Has experience in Mechanical Engineering and participated in Scientific Initiation projects."
            },
            fabiano: {
                p1: "Coordinator of the Integrated Graduate Program in Biomedical Engineering and the Technological Research Center (NPT) at the University of Mogi das Cruzes (UMC).",
                p2: "Coordinator of the Bioinformatics and Omics Sciences Laboratory (LaBiOmicS) linked to the Integrated Biotechnology Center (NIB) and the Technological Research Center (NPT), both at UMC. Professor in the strictu sensu graduate programs in Biomedical Engineering and Biotechnology at the University of Mogi das Cruzes (UMC).",
                p3: "Coordinates Bioinformatics research projects focused on Transcriptomics, Genomics, Metabolomics, Microbiome, and Metagenomics, in Biotechnology and Biomedical Engineering knowledge areas.",
                p4: "Also Co-founder and Chief Technology Officer (CTO) of biotechnology startups EasyOmics and Brycon Biotechnological Solutions."
            },
            robson: {
                p1: "Holds a Licentiate and Bachelor's degree in Mathematics from the University of Mogi das Cruzes (UMC - 1992), Master of Science (Mathematics) from the University of São Paulo (IME/USP - 2004), and PhD in Biomedical Engineering from the University of Mogi das Cruzes (NPT/UMC - 2012).",
                p2: "Professor at Colégio Unisuz and the University of Mogi das Cruzes (UMC). Currently a researcher at the Technological Research Center (NPT/UMC), full member of the Research Ethics Committee (CEP/UMC), collaborating researcher at the National Laboratory for Cellular Calcium Study (LabNECC) linked to the Center for Biomedical Engineering at UNICAMP, and Vice Coordinator of the Master's and PhD Program in Biomedical Engineering at UMC.",
                p3: "Scientific advisor to the São Paulo Research Foundation (FAPESP) and coordinator of FAPESP project (process: 2016/18422-7) titled: \"Implementation, evaluation, and comparison of contraction force and/or cellular shortening models for rat ventricular myocytes\".",
                p4: "As a researcher, has experience in Mathematics and Biomedical Engineering (Bioengineering), emphasizing Differential and Integral Calculus, Algebra, and Modeling of Biological Systems and Phenomena, mainly working on: Mathematical Modeling and Computational Simulation of Cardiac Electrophysiology and Applications of Differential and Integral Calculus."
            }
        }
    }[language];

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-base leading-relaxed animate-fade-in">
            
            {/* Header com Logos e Título */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <img 
                    src="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.33.24.jpeg" 
                    alt="Logo UMC" 
                    className="h-20 md:h-24 object-contain"
                />
                
                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white flex-grow px-4">
                    {t.title}
                </h2>

                <img 
                    src="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.34.57.jpeg" 
                    alt="Logo 2" 
                    className="h-20 md:h-24 object-contain"
                />
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
                {t.desc}
            </p>

            <div className="space-y-8">
                
                {/* Maria Luiza */}
                <ResearcherCard 
                    name="1. Maria Luiza Zitei Brandão" 
                    title={t.titles.me}
                    imageUrl="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.30.57.jpeg"
                    bio={
                        <p>{t.maria.p1}</p>
                    }
                />

                {/* Fabiano Menegidio */}
                <ResearcherCard 
                    name="2. Prof. Dr. Fabiano Bezerra Menegidio" 
                    title={t.titles.biotech}
                    imageUrl="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.29.25.jpeg"
                    bio={
                        <>
                            <p><strong className="text-gray-800 dark:text-gray-200">EasyOmics / Brycon CTO.</strong></p>
                            <p>{t.fabiano.p1}</p>
                            <p>{t.fabiano.p2}</p>
                            <p>{t.fabiano.p3}</p>
                            <p>{t.fabiano.p4}</p>
                        </>
                    }
                />

                {/* Robson Rodrigues */}
                <ResearcherCard 
                    name="3. Prof. Dr. Robson Rodrigues da Silva" 
                    title={t.titles.biomed}
                    imageUrl="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.25.37.jpeg"
                    bio={
                        <>
                            <p>{t.robson.p1}</p>
                            <p>{t.robson.p2}</p>
                            <p>{t.robson.p3}</p>
                            <p>{t.robson.p4}</p>
                        </>
                    }
                />

            </div>
        </div>
    );
};

export default TeamContent;