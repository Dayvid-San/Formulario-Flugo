export interface Collaborator {
    id: string;
    titulo: string;     
    email: string;   
    cargo: string;    
    nivel: string;   
    salario: number;  
    status: 'Ativo' | 'Inativo';
    avatarUrl?: string; 
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type SortKey = 'titulo' | 'email' | 'cargo' | 'nivel' | 'salario';
  
  export interface SelectOption {
    value: string;
    label: string;
  }
  
  export const LEVEL_OPTIONS: SelectOption[] = [
    { value: 'Estagiário', label: 'Estagiário' },
    { value: 'Júnior', label: 'Júnior' },
    { value: 'Pleno', label: 'Pleno' },
    { value: 'Sênior', label: 'Sênior' },
    { value: 'Gestor', label: 'Gestor' },
  ];