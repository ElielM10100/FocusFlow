# 🧘 FocusFlow - App de Produtividade

Um aplicativo moderno de produtividade que combina técnicas Pomodoro, meditação e análise de dados pessoais para maximizar seu foco e bem-estar.

![FocusFlow](https://img.shields.io/badge/FocusFlow-Produtividade-blue) ![React](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Características Principais

### 🎯 Timer Pomodoro Inteligente
- **Timer customizável** com diferentes modos (Foco, Pausa Curta, Pausa Longa)
- **Animações fluidas** com Framer Motion
- **Notificações inteligentes** com mensagens motivacionais
- **Progresso visual** com círculos animados e barras de progresso
- **Controle por teclado** e interface intuitiva

### 🧘 Sessões de Meditação
- **Múltiplos tipos**: Respiração guiada, Mindfulness, Body Scan
- **Durações flexíveis**: 5, 10, 15, 20 ou 30 minutos
- **Respiração guiada visual** com círculo animado
- **Timer dedicado** com interface zen

### 📊 Analytics e Insights
- **Gráficos interativos** com Recharts
- **Estatísticas detalhadas**: sessões, tempo de foco, sequências
- **Insights personalizados** com IA
- **Metas semanais** e acompanhamento de progresso
- **Dados históricos** com visualizações mensais e semanais

### 🎵 Sons Ambiente
- **8 categorias de sons**: Natureza, Chuva, Ambiente, Instrumental
- **Player integrado** com controle de volume
- **Loop contínuo** durante sessões
- **Interface visual** com animações de áudio

### 🎨 Design Moderno
- **Dark/Light mode** automático
- **Responsive design** mobile-first
- **Animações suaves** em todas as interações
- **Gradientes elegantes** e paleta de cores harmoniosa
- **Acessibilidade** completa

## 🚀 Tecnologias Utilizadas

### Core
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápida

### Estilização
- **Tailwind CSS 4** - Framework CSS utility-first
- **CSS Custom Properties** - Variáveis CSS personalizadas
- **Framer Motion** - Animações fluidas

### Dados e Estado
- **Context API** - Gerenciamento de estado global
- **LocalStorage** - Persistência de dados
- **Custom Hooks** - Lógica reutilizável

### Gráficos e Visualização
- **Recharts** - Gráficos interativos
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd focusflow
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview da build
npm run lint     # Verificar código
```

## 🎵 Configuração de Sons

Para uma experiência completa, adicione arquivos de áudio na pasta `public/sounds/`:

### Sons Necessários:
- `rain.mp3` - Som de chuva
- `forest.mp3` - Sons da floresta  
- `ocean.mp3` - Som do oceano
- `fire.mp3` - Som de lareira
- `coffee-shop.mp3` - Som de cafeteria
- `birds.mp3` - Sons de pássaros
- `wind.mp3` - Som do vento
- `piano.mp3` - Música de piano
- `notification.mp3` - Som de notificação

### Fontes Recomendadas:
- [Freesound.org](https://freesound.org) (Creative Commons)
- [Pixabay](https://pixabay.com/music/) (Sons gratuitos)
- YouTube Audio Library

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Layout/         # Header, Navigation
│   ├── Timer/          # Timer Pomodoro
│   ├── Meditation/     # Timer de Meditação
│   ├── Stats/          # Dashboard de Estatísticas
│   └── Sounds/         # Player de Sons
├── context/            # Context API
├── hooks/              # Custom Hooks
├── types/              # Definições TypeScript
├── utils/              # Utilitários e helpers
└── styles/             # Estilos globais
```

## ⚙️ Funcionalidades Detalhadas

### Timer Pomodoro
- **Configurações customizáveis**: duração de foco, pausas curtas e longas
- **Ciclos automáticos**: alternância entre foco e pausas
- **Notificações**: alertas visuais e sonoros
- **Persistência**: estado salvo no localStorage

### Sistema de Estatísticas
- **Tracking automático**: todas as sessões são registradas
- **Métricas importantes**: 
  - Total de sessões completas
  - Tempo total de foco e meditação
  - Sequência atual e recorde
  - Progresso da meta semanal
  - Sessões do dia
  - Tempo médio por sessão

### Insights com IA
- **Análise de padrões**: comportamento de uso
- **Sugestões personalizadas**: melhorias na rotina
- **Conquistas**: marcos importantes
- **Motivação**: mensagens baseadas no progresso

### Meditação Guiada
- **Respiração 4-4-4-4**: ciclo de respiração equilibrado
- **Instrução visual**: círculo que expande e contrai
- **Tipos variados**: diferentes técnicas de meditação
- **Tracking**: sessões de meditação são contabilizadas

## 🎨 Personalização

### Temas
O app suporta modo claro, escuro e automático (seguindo preferência do sistema).

### Configurações
- Duração das sessões Pomodoro
- Notificações ativadas/desativadas
- Sons ambiente
- Meta semanal de sessões

## 🔄 Roadmap Futuro

- [ ] **Sincronização na nuvem** - Backup automático
- [ ] **Integração com calendário** - Google Calendar, Outlook
- [ ] **Relatórios avançados** - Exportação PDF
- [ ] **Gamificação** - Sistema de pontos e badges
- [ ] **Sessões em grupo** - Pomodoro colaborativo
- [ ] **API pública** - Integração com outras ferramentas
- [ ] **App mobile** - React Native
- [ ] **Modo offline** - Service Workers

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Seu Nome]

---

**FocusFlow** - Transforme sua produtividade com foco e bem-estar! 🚀