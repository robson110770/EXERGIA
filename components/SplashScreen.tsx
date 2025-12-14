
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SplashScreenProps {
    onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    const { language, setLanguage } = useLanguage();

    const t = {
        pt: {
            title: "CardioExergy",
            subtitle: "Análise Exergética do Coração com Estenose Aórtica",
            description: "Uma ferramenta destinada a pesquisa e ensino para simulação termodinâmica da bioenergética cardíaca. Explore como a estenose aórtica impacta a eficiência do coração através de modelos matemáticos baseados na Segunda Lei da Termodinâmica.",
            start: "INICIAR SIMULADOR",
            footer: "Baseado no modelo de Roll, J.B. et al., Entropy 2019.",
            institution: "Universidade de Mogi das Cruzes"
        },
        en: {
            title: "CardioExergy",
            subtitle: "Exergy Analysis of the Heart with Aortic Stenosis",
            description: "A tool designed for research and teaching for thermodynamic simulation of cardiac bioenergetics. Explore how aortic stenosis impacts heart efficiency through mathematical models based on the Second Law of Thermodynamics.",
            start: "LAUNCH SIMULATOR",
            footer: "Based on the model by Roll, J.B. et al., Entropy 2019.",
            institution: "University of Mogi das Cruzes"
        }
    }[language];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            {/* Background Decor Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -top-20 -left-20 w-96 h-96 text-blue-500 fill-current animate-pulse">
                    <path fill="#3B82F6" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.1,22.9,70.9,34.5C59.7,46.1,48.7,55.7,36.4,62.6C24.1,69.5,10.5,73.7,-2.1,77.3C-14.7,80.9,-26.3,83.9,-37.2,79.5C-48.1,75.1,-58.3,63.3,-66.8,50.3C-75.3,37.3,-82.1,23.1,-83.9,8.3C-85.7,-6.5,-82.5,-21.9,-73.8,-34.6C-65.1,-47.3,-50.9,-57.3,-36.4,-64.3C-21.9,-71.3,-7.1,-75.3,6.2,-86C19.5,-96.7,30.5,-114.1,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="z-10 max-w-4xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center text-center border border-white/20">
                
                {/* Logos Header */}
                <div className="flex justify-center items-center gap-8 mb-8 opacity-90">
                    <img 
                        src="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.33.24.jpeg" 
                        alt="Logo UMC" 
                        className="h-16 md:h-20 object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <img 
                        src="http://rodrigues.mat.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-21-at-12.34.57.jpeg" 
                        alt="Logo NPT" 
                        className="h-16 md:h-20 object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500 mb-2 tracking-tight">
                    {t.title}
                </h1>
                
                <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 mb-6">
                    {t.subtitle}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
                    {t.description}
                </p>

                <button 
                    onClick={onStart}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                >
                    {t.start}
                    <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>

                {/* Language Switcher Small */}
                <div className="mt-8 flex space-x-4">
                     <button 
                        onClick={() => setLanguage('pt')}
                        className={`text-sm font-medium transition-colors ${language === 'pt' ? 'text-blue-600 dark:text-blue-400 underline' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        Português
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-blue-600 dark:text-blue-400 underline' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        English
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 w-full">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                        {t.institution}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {t.footer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
