# Real Estate CRM

## Overview
A React-based Customer Relationship Management (CRM) application for real estate professionals. Built with React 19, TypeScript, Material-UI 7, and Vite.

## Project Architecture
- **Frontend**: React + TypeScript + Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit

## Structure
```
src/
├── components/    # Reusable UI components
│   ├── assistant/
│   ├── calendar/
│   ├── contacts/
│   ├── deals/
│   ├── goals/
│   ├── layout/
│   ├── mandat/
│   ├── prospection/
│   ├── scoring/
│   └── vendeur/
├── context/       # React Context providers
├── constants/     # App constants
├── pages/         # Page components
├── services/      # Business logic services
├── theme/         # MUI theme configuration
└── types/         # TypeScript type definitions
```

## Development
- Dev server: `npm run dev` (runs on port 5000)
- Build: `npm run build`
- Lint: `npm run lint`

## Deployment
Static deployment with Vite build output in `dist/` directory.
