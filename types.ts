
export interface SimulationParams {
  minAVA: number;
  maxAVA: number;
  steps: number;
  hr: number;
  temperature: number;
  c_d: number;
}

export interface SimulationResults {
  AVA: number[];
  V_syst: number[];
  cardiac_output: number[];
  Delta_P_aortic_mmHg: number[];
  W_Heart: number[];
  M_Heart: number[];
  B_M: number[];
  B_QM: number[];
  Delta_B_blood: number[];
  B_d_mitral: number[];
  B_d_aortic: number[];
  B_d_valves: number[];
  B_d_heart: number[];
  eta1: number[];
  eta2: number[];
}

export interface ChartDataPoint {
  AVA: number;
  V_syst: number;
  Delta_P_aortic_mmHg: number;
  M_Heart: number;
  W_Heart: number;
  Delta_B_blood: number;
  B_d_valves: number;
  B_d_heart: number;
  eta1: number;
  eta2: number;
}