# Flugo - Gestão de Colaboradores

Está responsivo, fluído, mas ainda com pequenos ruidos.

## Funcionalidades Principais

### 1. Dashboard

* **Edição In-place**: Não há necessidade de abrir modais para edições simples. Basta clicar no Nome, Email ou Departamento diretamente na tabela para editar os dados.
* **Avatar Editável**: O usuário pode clicar no Avatar de um colaborador para carregar uma nova foto do computador. A imagem é convertida para Base64 e salva instantaneamente.
* **Atualização em Tempo Real**: Graças ao `onSnapshot` do Firebase, qualquer alteração feita por um usuário é refletida para todos os outros sem precisar atualizar a página.
* **Exclusão**: Botão de ação rápida para remover registros com confirmação de segurança.

### 2. Cadastro em Múltiplas Etapas (Multi-step Form)

O processo de cadastro foi desenhado para ser intuitivo, evitando a sobrecarga de informações em uma única tela:

* **Passo 1: Informações Básicas**: Título, E-mail e status de ativação.
* **Passo 2: Informações Profissionais**: Seleção de cargo/departamento via dropdown para manter a integridade dos dados.
* **Consistência Visual**: Os formulários foram ajustados para manter o alinhamento de botões e campos, garantindo que o layout não "pule" durante a navegação entre etapas.

### 3. Design Responsivo

* **Mobile-First**: Em dispositivos móveis, a barra lateral (Sidebar) é ocultada automaticamente para priorizar o conteúdo da tabela.
* **Scroll de Segurança**: A tabela de colaboradores possui rolagem horizontal em telas pequenas, impedindo que os dados fiquem esmagados ou ilegíveis.


## Como Executar o Projeto

### Pré-requisitos

* Node.js instalado.
* Uma conta no Firebase com um projeto Firestore ativo.

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/flugo-management.git

```


2. **Instale as dependências:**
```bash
npm install
# Certifique-se de ter os ícones do MUI
npm install @mui/icons-material

```


3. **Configuração do Firebase:**
Crie um arquivo em `src/services/firebase.ts` com suas credenciais:
```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  // ... restantes
};

```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev

```




## Notas de Desenvolvimento

Este projeto utiliza o novo **Grid v2** do Material UI. Ao dar manutenção no código, utilize a propriedade `size` em vez de `item` e `xs`, evitando erros de *overload* no TypeScript e garantindo o alinhamento perfeito dos elementos.

