
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatContent: React.FC = () => {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const t = {
        pt: {
            title: "Assistente IA CardioExergy",
            subtitle: "Tire suas dúvidas sobre estenose aórtica e bioenergética cardíaca com nossa IA especializada.",
            placeholder: "Digite sua pergunta aqui... (ex: Por que a eficiência cai?)",
            send: "Enviar",
            welcome: "Olá! Sou o assistente virtual do CardioExergy. Posso explicar como o modelo matemático funciona, o que é exergia ou interpretar os resultados da estenose aórtica. Como posso ajudar?",
            thinking: "Analisando..."
        },
        en: {
            title: "CardioExergy AI Assistant",
            subtitle: "Ask questions about aortic stenosis and cardiac bioenergetics with our specialized AI.",
            placeholder: "Type your question here... (e.g., Why does efficiency drop?)",
            send: "Send",
            welcome: "Hello! I am the CardioExergy virtual assistant. I can explain how the mathematical model works, what exergy is, or interpret aortic stenosis results. How can I help?",
            thinking: "Analyzing..."
        }
    }[language];

    // Initialize chat with a welcome message locally
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: 'model', text: t.welcome }]);
        }
    }, [language]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage = inputText;
        
        // 1. Update UI immediately so the user sees their message and input clears
        setInputText('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // 2. Safely retrieve API Key preventing ReferenceError on 'process'
            let apiKey = '';
            
            // Check process.env in a safe way (standard Node/Vite substitution)
            try {
                if (typeof process !== 'undefined' && process.env) {
                    apiKey = process.env.API_KEY || '';
                }
            } catch (e) {
                // Ignore
            }

            // Fallback to window.process (our polyfill)
            if (!apiKey && typeof window !== 'undefined') {
                // @ts-ignore
                apiKey = (window as any).process?.env?.API_KEY;
            }

            // Fallback to import.meta.env (Vite native) check if available
            if (!apiKey) {
                try {
                    // @ts-ignore
                    if (import.meta && import.meta.env) {
                        // @ts-ignore
                        apiKey = import.meta.env.VITE_API_KEY;
                    }
                } catch(e) {}
            }

            if (!apiKey) {
                console.error("API Key not found in process.env, window.process, or import.meta.env");
                throw new Error("API Key not configured.");
            }

            // Initialize Gemini Client inside try-catch to handle config errors
            const ai = new GoogleGenAI({ apiKey });

            // System instruction defining the persona and technical context of the app
            const systemInstruction = `
            You are the expert AI assistant for the "CardioExergy" application.
            
            CONTEXT OF THE APP:
            This app simulates the hemodynamics and thermodynamics (exergy) of the human heart under Aortic Stenosis conditions.
            It is based on the mathematical model by Roll et al. (2019).
            
            KEY CONCEPTS TO KNOW:
            1. **Aortic Stenosis**: Narrowing of the aortic valve. Defined by AVA (Aortic Valve Area). Healthy > 2.0 cm², Severe < 1.0 cm².
            2. **Hemodynamics**: The app calculates Flow (V_syst) and Pressure Drop (Delta_P) using the Gorlin Formula. Smaller area -> Exponentially higher pressure drop.
            3. **Thermodynamics (Exergy)**: The app analyzes energy quality.
               - **Metabolism (M_Heart)**: Energy consumed by the heart. Increases with stenosis because the heart works harder (Pressure Load).
               - **Work (W_Heart)**: Mechanical work generated.
               - **Exergy Destruction (B_d_valves)**: Energy lost due to friction/turbulence at the valve. Increases drastically in stenosis.
            4. **Efficiencies**:
               - **Eta1 (η₁)**: Motor efficiency (Metabolism -> Work). Stays relatively stable (~20-25%). The muscle is not the problem.
               - **Eta2 (η₂)**: System efficiency (Metabolism -> Blood Energy). Drops to near zero in severe stenosis. This is the collapse point.
            
            INSTRUCTIONS:
            - Answer questions specifically about these topics.
            - If asked about code, explain that the app uses TypeScript and calculates physics locally in the browser.
            - Keep answers concise, scientific, yet accessible.
            - **CRITICAL**: Reply in the language the user is speaking (Portuguese or English). Ideally match the current app language setting: ${language === 'pt' ? 'Portuguese' : 'English'}.
            `;

            const chatSession: Chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                },
                history: messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                }))
            });

            const result = await chatSession.sendMessage({ message: userMessage });
            const responseText = result.text;

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);

        } catch (error) {
            console.error("Chat error details:", error);
            const errorMsg = language === 'pt' 
                ? "Desculpe, ocorreu um erro ao conectar com a IA. Verifique se a chave API (VITE_API_KEY) está configurada corretamente." 
                : "Sorry, an error occurred connecting to AI. Check if API key (VITE_API_KEY) is configured correctly.";
            setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-[600px] animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-700/50 rounded-t-lg">
                <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {t.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.subtitle}
                </p>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                                msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                            }`}
                        >
                            {msg.role === 'model' && (
                                <div className="text-xs font-bold mb-1 text-blue-500 dark:text-blue-300">
                                    CardioBot
                                </div>
                            )}
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-600 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            <span className="text-xs text-gray-400 ml-2">{t.thinking}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={t.placeholder}
                        disabled={isLoading}
                        className="flex-grow p-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !inputText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <span>{t.send}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <div className="text-center mt-2">
                     <p className="text-[10px] text-gray-400">
                        {language === 'pt' ? 'IA pode cometer erros. Verifique informações importantes.' : 'AI can make mistakes. Check important info.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatContent;
