export type ServiceMode = 'whole' | 'part';
export type ServiceId = 'website' | 'web-app' | 'mobile' | 'ai' | 'redesign';

export interface ServiceCopy {
  meta: string;
  title: string;
  description: string;
  examples: string;
}

export interface Service {
  id: ServiceId;
  whole: ServiceCopy | null;
  part: ServiceCopy | null;
}
