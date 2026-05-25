# Redaksi: Journalist Simulator

A narrative-driven investigative journalism simulator powered by AI. Uncover scandals, gather evidence, write compelling articles, and navigate the complex world of truth, public perception, and institutional pressure.

## About the Game

In Redaksi, you take on the role of an investigative journalist tasked with uncovering major scandals. Manage multiple information sources, piece together evidence, write articles that influence public opinion, and face real consequences as your reporting affects the political landscape.

### Core Gameplay Features

- **Evidence Investigation**: Review classified documents, police reports, financial records, and witness testimonies
- **Article Writing**: Compose investigative pieces using a dedicated editor with AI-powered assistance
- **Social Impact Tracking**: Monitor how your reporting affects public sentiment, media trust, and institutional credibility through the Live Pulse dashboard
- **Dynamic World State**: Your article choices trigger real chain reactions—politicians respond, public opinion shifts, and new evidence emerges
- **Multi-Window Interface**: Manage 6 different applications simultaneously (Evidence Viewer, Article Editor, Social Feed, Stats Dashboard, Terminal, Messenger)
- **AI-Powered Narratives**: Google Gemini generates contextual responses and story progression based on your investigative choices

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + Motion (animations)
- **Backend**: Express.js + Node.js
- **AI/ML**: Google Generative AI (Gemini API)
- **Build**: Vite + esbuild
- **Utilities**: React Markdown, XLSX (data parsing), Lucide icons

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Gemini API key (get one [here](https://ai.google.dev/))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd redaksi-journalist-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Vite + Express) |
| `npm run build` | Build for production (Vite + esbuild) |
| `npm start` | Run production build |
| `npm run clean` | Remove build artifacts |
| `npm run lint` | Run TypeScript type checking |

## Project Structure

```
src/
├── components/          # React UI components
│   ├── ArticleEditor    # Article writing interface
│   ├── EvidenceViewer   # Document/evidence browser
│   ├── SocialFeed       # Public reaction dashboard
│   ├── StatsViewer      # World state metrics
│   ├── Terminal         # System terminal interface
│   ├── Window           # Window management system
│   └── BackgroundMusic  # Audio player
├── data/
│   └── cases.ts         # Game scenarios and cases
├── hooks/
│   └── useGame.ts       # Game state management
├── lib/
│   └── utils.ts         # Utility functions
├── services/
│   ├── geminiService.ts # AI integration
│   └── mockData.ts      # Fallback data
└── types.ts             # TypeScript type definitions
```

## How to Play

1. **Start Investigation**: Begin with a briefing on the scandal
2. **Gather Evidence**: Review all available documents in the Evidence Viewer
3. **Write Article**: Use the Article Editor to compose your investigative piece
4. **Monitor Impact**: Check the Live Pulse dashboard to see how public reacts
5. **Adapt Strategy**: Respond to new developments and chain reactions
6. **Reach Ending**: Guide the investigation to one of multiple possible conclusions

## Game Mechanics

The game tracks several world state variables that change based on your reporting:
- **Public Tension** - How stressed the general population is
- **Media Trust** - Confidence in journalism
- **Political Pressure** - Institutional resistance to your investigation
- **Misinformation Spread** - False narratives circulating
- **Economic Anxiety** - Market and financial impact
- **Institutional Trust** - Public faith in government/institutions
- **Public Sentiment** - Opinion toward the scandal's key actors

## Deployment

This app is also available on AI Studio: [https://ai.studio/apps/b1101154-5a50-4d00-8a82-62df6ae96536](https://ai.studio/apps/b1101154-5a50-4d00-8a82-62df6ae96536)

### Deploy to Production

```bash
npm run build
npm start
```

The production build compiles the React app with Vite and bundles the Express server with esbuild for deployment.

## Environment Variables

- `GEMINI_API_KEY` - Your Google Generative AI API key (required)

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]
