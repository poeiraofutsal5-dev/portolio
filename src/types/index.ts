export type ProjectCategory = 
  | 'Todos'
  | 'Identidade Visual'
  | 'Branding'
  | 'Design Editorial'
  | 'Embalagens'
  | 'Direção de Arte';

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  palette: string[];
  typography: string;
  aspectRatio: string;
  featured: boolean;
  themeColor: string;
  customImageUrl?: string;
}

export interface ServiceSpecialty {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
}
