export type ProjectCategory = 
  | 'Todos'
  | 'Matchday'
  | 'Artes 1920x1080'
  | 'Site'
  | 'Identidade Visual'
  | 'Branding'
  | 'Design Editorial'
  | 'Embalagens'
  | 'Direção de Arte'
  | string;

export type ProjectFormat = '1350x1080' | '1920x1080' | '1080x1080' | '4:3' | string;

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
  aspectRatio: ProjectFormat;
  featured: boolean;
  themeColor: string;
  customImageUrl?: string;
  fitMode?: 'contain' | 'cover';
}

export interface ServiceSpecialty {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
}
