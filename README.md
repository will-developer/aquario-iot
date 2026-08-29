## 📌 Contexto

Este documento detalha o plano de ação para refatorar o monitor de nível do Projeto Integrador (UNIVESP) construído em HTML/JS puro para uma arquitetura moderna utilizando **React, TypeScript e Vite**.

**Objetivos:**

1. Manter 100% da funcionalidade de comunicação em tempo real (MQTT).
2. Isolar lógicas de negócio e conexão da camada de visualização.
3. Melhorar a UI/UX (Layout), tornando-a mais responsiva e componentizada.
4. Tipar rigidamente as estruturas de dados vindas do ESP32 usando TypeScript.

---

## 🛠️ Fase 1: Configuração do Ambiente e Dependências

Como o projeto foi recém-criado com Vite e está "puro", precisamos instalar as bibliotecas base para comunicação e design.

- [ ] **Tarefa 1.1:** Instalar o cliente MQTT e suas tipagens.
  - `npm install mqtt`
  - `npm install -D @types/mqtt`
- [ ] **Tarefa 1.2:** Configurar um motor de estilização moderno. Recomendação: **Tailwind CSS** (ótimo para refazer o layout escuro com gradientes de forma rápida).
  - _Siga a documentação oficial do Tailwind para Vite + React._
- [ ] **Tarefa 1.3:** Instalar biblioteca de ícones (opcional, mas recomendado para substituir emojis padrão por algo mais profissional).
  - `npm install lucide-react`

---

## 📁 Fase 2: Estruturação do Projeto e Tipagens (TypeScript)

Organizar a estrutura de pastas do React para separar responsabilidades.

- [ ] **Tarefa 2.1:** Criar estrutura de pastas em `src/`:
  - `/components` (Componentes visuais)
  - `/hooks` (Lógicas do React, ex: `useMqtt`)
  - `/types` (Interfaces do TypeScript)
  - `/utils` (Constantes, formatações de data)
- [ ] **Tarefa 2.2:** Criar o arquivo `src/types/index.ts` com as interfaces:

  ```typescript
  export interface MqttPayload {
    nivel: 'NORMAL' | 'BAIXO';
    bomba: 'ON' | 'OFF';
    tempo_bomba: number;
    seguranca: 'NORMAL' | 'ATIVA';
    timestamp: string;
  }

  export interface HistoricoEvento extends MqttPayload {}
  ```

---

## 🔌 Fase 3: Camada de Comunicação (Custom Hook MQTT)

No React (especialmente no modo Estrito), conexões de WebSockets/MQTT precisam ser cuidadosamente gerenciadas em `useEffect` para evitar conexões duplicadas.

- [ ] **Tarefa 3.1:** Criar um custom hook `src/hooks/useMqtt.ts`.
- Deve iniciar o `mqtt.connect()` apenas uma vez.
- Deve lidar com os eventos `connect`, `reconnect`, `error`, `close` e `message`.
- Deve atualizar estados (States) para gerenciar: Status da Conexão, Última Mensagem Recebida, Tempo do Último Update.
- **Crítico:** Retornar uma função de _cleanup_ no `useEffect` usando `client.end()` ao desmontar o componente.

- [ ] **Tarefa 3.2:** Implementar a lógica de detecção de ESP32 Offline (comparando o Date.now() com o timestamp da última mensagem).

---

## 🧩 Fase 4: Componentização da Interface

Desmembrar o arquivo `index.html` monolítico em componentes menores e reutilizáveis.

- [ ] **Tarefa 4.1:** Criar `<Header />`
- Títulos e descrições do projeto.

- [ ] **Tarefa 4.2:** Criar `<StatusDashboard />` (O Card principal)
- Subcomponente: `<WaterLevelIndicator nivel={status.nivel} />`
- Subcomponente: `<PumpStatus bomba={status.bomba} tempo={status.tempo_bomba} />`
- Subcomponente: `<SecurityAlert seguranca={status.seguranca} />` (Renderização condicional se a trava estiver ativa)

- [ ] **Tarefa 4.3:** Criar `<ConnectionPills />`
- Indicadores visuais para MQTT (Conectado/Desconectado) e ESP32 (Online/Offline).

- [ ] **Tarefa 4.4:** Criar `<HistoryCard eventos={historico} />`
- Deve mapear (`.map()`) a array de histórico e renderizar uma lista.
- Criar limite lógico para manter apenas os 10 últimos eventos no state principal.

---

## 🎨 Fase 5: Refatoração de UI/UX (Layout)

Substituir o CSS inline e as classes antigas por um layout moderno.

- [ ] **Tarefa 5.1:** Melhorar a paleta de cores.
- O gradiente de fundo (`#0f2027`, `#203a43`, `#2c5364`) é excelente. Levar isso para o container principal.
- Utilizar "Glassmorphism" (efeito de vidro) nos cards usando `backdrop-blur` e cores com opacidade, melhorando o aspecto do `rgba(255,255,255,0.08)`.

- [ ] **Tarefa 5.2:** Layout Responsivo.
- Usar CSS Grid ou Flexbox para que, em telas grandes (Desktop), o Dashboard (Nível/Bomba) fique lado a lado com o Histórico. No celular (Mobile), empilhar um embaixo do outro.

- [ ] **Tarefa 5.3:** Transições suaves.
- Adicionar transições (ex: `transition-all duration-300`) nos alertas e cards, para que a mudança de Nível Normal para Baixo não seja "seca".

---

## 🧪 Fase 6: Integração e Validação Final

- [ ] **Tarefa 6.1:** Juntar todos os componentes no `App.tsx`.
- [ ] **Tarefa 6.2:** Testar conexão WSS real com o EMQX (`wss://pf113210.ala.eu-central-1.emqxsl.com:8084/mqtt`).
- [ ] **Tarefa 6.3:** Simular cenários de falha:
- Desconectar a internet (Ver se o status do MQTT muda).
- Parar de enviar mensagens (Ver se a flag de 90s do ESP32 entra como Offline).
  """
  with open('plano_migracao_iot_react.md', 'w', encoding='utf-8') as f:
  f.write(content)

### Alguns pontos de atenção importantes que adicionei na análise para sua refatoração:

1. **O Hook do MQTT (`useMqtt`)**: No seu arquivo HTML, a conexão ficava solta no `<script>`. No React (principalmente durante o desenvolvimento com o _StrictMode_ ativado), o componente monta duas vezes. Se você não isolar o `mqtt.connect` num Hook com uma função de limpeza (_cleanup_ do `useEffect` com `client.end()`), você corre o risco de abrir várias conexões WSS simultâneas e travar o broker.
2. **Design Pattern (Tipagem)**: Criar uma interface Typescript com o modelo exato do JSON (`nivel`, `bomba`, `tempo_bomba`, `seguranca`) vai te ajudar demais. O VSCode já vai autocompletar tudo para você no momento que estiver criando os componentes visuais.
3. **Glassmorphism**: O CSS original que você enviou tentava fazer um "efeito de vidro" (`backdrop-filter: blur`, `rgba` transparente). Sugeri instalar o **Tailwind CSS**, pois você faz esse efeito em 5 minutos escrevendo coisas como `bg-white/10 backdrop-blur-md rounded-2xl` e ele já gerencia o responsivo sozinho.
