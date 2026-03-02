import { z } from "zod";

export const colaboradorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  ativo: z.boolean().default(true),
  // Campos da Fase 2
  dataAdmissao: z.string().min(1, "Data de admissão é obrigatória"),
  departamento: z.string().min(1, "Selecione um departamento"),
  nivel: z.enum(["Júnior", "Pleno", "Sênior", "Gestor"]),
  salario: z.number().min(0, "Salário deve ser maior que 0"),
  gestor: z.string().optional(),
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;