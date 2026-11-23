export type CasePhase = {
  label: string;
  heading: string;
  description: string;
  visualLabel: string;
};
export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  theme: 'product' | 'operations' | 'experience';
  phases: [CasePhase, CasePhase, CasePhase];
};
