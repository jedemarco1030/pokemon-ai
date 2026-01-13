# Pokémon AI

The ultimate AI-powered companion for your Pokémon journey. From strategic battle analysis to semantic news tracking, Pokémon AI provides everything a trainer needs to excel.

## 🚀 Features

- **AI Battle Simulator**: Test your skills against iconic Gym Leaders like Brock and Misty in an AI-powered battle arena.
- **Poké-News & Meta-Analysis**: Stay ahead of the game with real-time semantic news and competitive meta-analysis.
- **Pro Team Builder**: Construct the perfect team and use the **Move Optimizer** to maximize your competitive edge.
- **Trainer's Journal**: Document your journey and let AI summarize your milestones and provide growth suggestions.
- **Catch Predictor**: Calculate your chances of success before throwing that Master Ball with our AI predictor.
- **AI Search**: Experience semantic search to find Pokémon and information more intuitively.
- **Minigames**: Put your knowledge to the test with "Who's That Pokémon?" and other interactive challenges.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **Database**: [Prisma](https://www.prisma.io) with [PostgreSQL](https://www.postgresql.org)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) & [Radix UI](https://www.radix-ui.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Testing**: [Jest](https://jestjs.io) & [Playwright](https://playwright.dev)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 🏁 Getting Started

### Prerequisites

- Node.js installed
- A PostgreSQL database (e.g., Supabase)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jedemarco1030/pokemon-ai.git
   cd pokemon-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root and add your database and Supabase credentials.

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run test`: Runs unit and integration tests using Jest.
- `npm run test:e2e`: Runs end-to-end tests using Playwright.

## 📂 Project Structure

- `app/`: Next.js App Router routes and Server Actions.
- `components/`: Reusable UI components (Shadcn UI).
- `hooks/`: Custom React hooks.
- `lib/`: Utility functions and shared logic.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.
- `types/`: TypeScript type definitions.
- `__tests__/`: Unit and integration tests.
- `e2e/`: End-to-end tests.

## 📄 License

This project is private and for educational purposes.
