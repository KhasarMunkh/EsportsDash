# EsportsDash

A modern esports dashboard for League of Legends built with Next.js 15, featuring real-time match tracking, tournament information, and player statistics powered by the PandaScore API.

## Check it out here:

**[View Live Site →](https://esportsdash.app)**

## Features

- **Live Matches**: Track ongoing League of Legends matches in real-time
- **Upcoming Matches**: View scheduled matches with team information and league details
- **Tournaments**: Browse current and upcoming tournaments
- **Players**: Explore professional player profiles and statistics
- **Search**: Find matches, teams, and players quickly
- **Dark Theme**: Beautiful dark mode design optimized for viewing

# To run locally:
## Prerequisites

- Node.js 18+ installed
- A PandaScore API key (get one at [pandascore.co](https://pandascore.co/))

## Getting Started

1. **Clone the repository**

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

Create a `.env` file in the root directory and add your PandaScore API key:

```bash
cp .env.example .env
```

Then edit `.env` and replace `your_pandascore_api_key_here` with your actual API key:

```
PANDA_KEY=your_actual_api_key_here
```

4. **Run the development server**:

```bash
npm run dev
```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

To create a production build locally:

```bash
npm run build
npm start
```

## Project Structure

- `/app` - Next.js app directory with pages and API routes
  - `/api` - Backend API routes that proxy to PandaScore
  - `/components` - Reusable React components
  - `/lib` - TypeScript types and utilities
  - `/matches` - Matches page
  - `/tournaments` - Tournaments page
  - `/players` - Players page
  - `/live` - Live matches page
- `/public` - Static assets

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Headless UI
- **Data Fetching**: SWR
- **API**: PandaScore REST API

## API Rate Limits

PandaScore free tier has rate limits. The app caches responses to minimize API calls:
- Matches: 5 minutes
- Tournaments: 10 minutes
- Players: 1 hour
- Live matches: No cache (real-time data)

## License

This project is open source and available under the MIT License.
