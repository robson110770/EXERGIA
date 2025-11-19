import { SimulationParams, SimulationResults } from '../types';

// ============================================================================
// PARTE 1: PARÂMETROS FÍSICOS E FISIOLÓGICOS
// ============================================================================
const rho_bl = 1060.0;      // Densidade do sangue (kg/m³)
const T_Heart_C = 38.8;
const T_Heart  = T_Heart_C + 273.15; // Temperatura corporal interna (K)
const T_int    = T_Heart;   // temperatura na região valvar

// ============================================================================
// PARTE 2: FUNÇÕES PRINCIPAIS DO MODELO
// ============================================================================

function calculate_pressure_drop_gorlin(AVA_cm2: number, Q_m3_s: number, C_d: number): [number, number] {
    // Queda de pressão através da válvula aórtica via fórmula de Gorlin (forma de orifício):
    // ΔP = (ρ/2) * ( Q / (C_d * A) )^2
    const A_m2 = AVA_cm2 * 1e-4;
    const A_eff = Math.max(C_d * A_m2, 1e-8);  // evita divisão por zero
    const DeltaP_Pa = 0.5 * rho_bl * (Q_m3_s / A_eff)**2;
    const DeltaP_mmHg = DeltaP_Pa / 133.322;
    return [DeltaP_mmHg, DeltaP_Pa];
}

// Calcula o trabalho cardíaco. Pode ser chamado com o volume sistólico real ou de referência.
function calculate_heart_work(V_stroke_for_calc_m3: number, HR_bpm: number, P_avg_Pa: number, DeltaP_stenosis_Pa: number): [number, number] {
    // O trabalho por batimento considera o trabalho contra a pressão arterial média MAIS o trabalho para vencer a estenose.
    const W_beat = (P_avg_Pa + DeltaP_stenosis_Pa) * V_stroke_for_calc_m3;
    const W_Heart = W_beat * (HR_bpm / 60.0); // Trabalho em Watts (J/s)
    return [W_Heart, W_beat];
}

export function simulateHeartWithStenosis(params: SimulationParams): SimulationResults {
    const { minAVA, maxAVA, steps, hr, temperature, c_d } = params;

    const results: SimulationResults = {
        AVA: [], V_syst: [], cardiac_output: [], Delta_P_aortic_mmHg: [],
        W_Heart: [], M_Heart: [], B_M: [], B_QM: [], Delta_B_blood: [],
        B_d_mitral: [], B_d_aortic: [], B_d_valves: [], B_d_heart: [],
        eta1: [], eta2: [],
    };

    // Parâmetros fixos e de referência do modelo
    const t_E = 0.3; // Tempo de ejeção sistólica (s)
    const HR_ref = 72.0; // Frequência cardíaca de referência (bpm)
    const P_avg_mmHg = 100; // Pressão arterial média de referência (mmHg)
    const P_avg_Pa = P_avg_mmHg * 133.322; // (Pa)
    const T_ref_K = temperature + 273.15; // Temperatura de referência (K)
    
    // MODELO DE METABOLISMO DINÂMICO (MAIS REALISTA)
    // Baseado no modelo de consumo de oxigênio de Suga, referenciado no artigo.
    // M_Heart = a * W_pv + b, onde W_pv é o trabalho cardíaco (W_Heart_actual).
    // Coeficientes 'a' e 'b' adaptados do artigo para corações caninos, usados como proxy.
    const SUGA_A = 1.45; // Adimensional
    const SUGA_B = 6.0; // [W] Metabolismo basal. Ajustado para alinhar escala com artigo de referência.
    
    // Calcular um volume sistólico de referência (saudável) para o cálculo do TRABALHO GRÁFICO
    // Isso transforma W_Heart no gráfico em um proxy para o "esforço" do coração, que sempre aumenta.
    const ref_ava_for_work = 3.5;
    const ref_base_flow_ml_s = 91.28 * Math.log(ref_ava_for_work) + 241.02;
    const ref_base_V_stroke_ml = ref_base_flow_ml_s * t_E;
    const ref_hr_adjustment_factor = 1.0 - 0.0025 * (hr - HR_ref);
    const V_stroke_ref_ml = ref_base_V_stroke_ml * ref_hr_adjustment_factor;
    const V_stroke_ref_m3 = V_stroke_ref_ml * 1e-6;

    const stepSize = (maxAVA - minAVA) / (steps > 1 ? steps - 1 : 1);

    for (let i = 0; i < steps; i++) {
        const currentAVA = minAVA + i * stepSize;
        results.AVA.push(currentAVA);

        // 1. & 2. Volume Sistólico REAL (diminui com estenose)
        const base_flow_ml_s = 91.28 * Math.log(currentAVA) + 241.02;
        const base_V_stroke_ml = base_flow_ml_s * t_E;
        const hr_adjustment_factor = 1.0 - 0.0025 * (hr - HR_ref);
        const V_stroke_ml = base_V_stroke_ml * hr_adjustment_factor;
        const V_stroke_m3 = V_stroke_ml * 1e-6; // Este é o V_stroke REAL

        // 3. Fluxo Sistólico e Débito Cardíaco
        const Q_syst_m3_s = V_stroke_m3 / t_E;
        const V_syst_ml_s = Q_syst_m3_s * 1e6;
        results.V_syst.push(V_syst_ml_s);
        
        const cardiac_output_L_min = (V_stroke_ml * hr) / 1000.0;
        results.cardiac_output.push(cardiac_output_L_min);

        // 4. Queda de Pressão Aórtica (Fórmula de Gorlin)
        const [deltaP_mmHg, deltaP_Pa] = calculate_pressure_drop_gorlin(currentAVA, Q_syst_m3_s, c_d);
        results.Delta_P_aortic_mmHg.push(deltaP_mmHg);
        
        // 5. TRABALHO CARDÍACO (Proxy de Esforço): Usa volume de REFERÊNCIA.
        // Este valor será usado tanto para o gráfico quanto para o cálculo de η₁.
        const [W_Heart_for_graph_and_eta1, ] = calculate_heart_work(V_stroke_ref_m3, hr, P_avg_Pa, deltaP_Pa);
        results.W_Heart.push(W_Heart_for_graph_and_eta1);

        // 6. TRABALHO CARDÍACO REAL (para física interna e metabolismo)
        const [W_Heart_actual_for_physics, ] = calculate_heart_work(V_stroke_m3, hr, P_avg_Pa, deltaP_Pa);

        // 7. Metabolismo e Exergia Metabólica (MODELO DINÂMICO)
        const M_Heart = SUGA_A * W_Heart_actual_for_physics + SUGA_B;
        // CORREÇÃO: A exergia de uma fonte de energia química (metabolismo) é aproximadamente igual
        // à própria taxa de energia (M_Heart). A fórmula anterior usava o fator de Carnot (1 - T₀/T),
        // que é para exergia de calor e resultava em valores de eficiência incorretamente altos (escala errada).
        const B_M = M_Heart;
        results.M_Heart.push(M_Heart);
        results.B_M.push(B_M);

        // 8. Variação da Exergia do Sangue (ΔB_blood)
        const m_dot_bl_kg_s = Q_syst_m3_s * rho_bl;
        const A_m2 = Math.max(currentAVA * 1e-4, 1e-8);
        const v_aortic = Q_syst_m3_s / A_m2;
        const B_phys = m_dot_bl_kg_s * 3500.0 * (1 - (T_ref_K / T_int)); 
        const B_kin = 0.5 * m_dot_bl_kg_s * (v_aortic**2);
        const Delta_B_blood = B_phys + B_kin;
        results.Delta_B_blood.push(Delta_B_blood);

        // 9. EXERGIA DESTRUÍDA
        const W_beat_stenosis = deltaP_Pa * V_stroke_m3;
        const W_stenosis_power = W_beat_stenosis * (hr / 60.0);
        const B_d_aortic = W_stenosis_power * (T_ref_K / T_int);
        results.B_d_aortic.push(B_d_aortic);
        
        const B_d_mitral = B_d_aortic * 0.15; 
        results.B_d_mitral.push(B_d_mitral);
        const B_d_valves = B_d_aortic + B_d_mitral;
        results.B_d_valves.push(B_d_valves);
        
        const B_d_heart = B_M - W_Heart_actual_for_physics - Delta_B_blood;
        results.B_d_heart.push(B_d_heart > 0 ? B_d_heart : 0);
        
        // 10. EFICIÊNCIAS
        const eta1 = B_M > 0 ? (W_Heart_for_graph_and_eta1 / B_M) * 100.0 : 0;
        results.eta1.push(eta1);
        
        const eta2 = B_M > 0 ? (Delta_B_blood / B_M) * 100.0 : 0;
        results.eta2.push(eta2);

        // B_QM não está claro como calcular
        results.B_QM.push(0); 
    }

    return results;
}
