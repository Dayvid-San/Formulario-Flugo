import { z } from "zod";


export const collaboratorSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  ativo: z.boolean(), // Remova o .default() ou .optional() daqui se estiver dando erro
  dataAdmissao: z.string().min(1, "Data obrigatória"),
  departamento: z.string().min(1, "Selecione um departamento"),
  nivel: z.enum(["Júnior", "Pleno", "Sênior", "Gestor"]),
  salario: z.number().min(0),
  gestor: z.string().optional(),
});

export type CollaboratorFormData = z.infer<typeof collaboratorSchema>;