# Vices

A widget-first, poster-style mobile coach app that helps users complete 30-, 66- and 99-day "quit streaks" for smoking, drinking and pornography.

Built with **Expo**, **React Native**, **TypeScript**, and **Supabase**.

## Features

- **Poster-Style Design**: Every surface screams clarity with huge numerals, one accent color (#ff6a00), and zero fluff
- **Three Quit Types**: Track progress for smoking, drinking, and pornography
- **Multiple Goals**: Support for 30, 66, and 99-day streaks
- **Visual Progress**: Beautiful background images with overlay text showing current progress
- **Motivational Quotes**: Horizontal scrolling inspirational quotes with images
- **Detailed Analytics**: Individual streak pages with progress bars and attempt history
- **Clean Navigation**: Simple stack navigation between home and detail views
- **Real-time Data**: Supabase backend with real-time updates
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context with useReducer for predictable state updates

## Design Philosophy

- **Widget-First**: Designed to be glanceable and informative at a distance
- **Huge Numerals**: Large, bold numbers that are easy to read quickly
- **Single Accent Color**: Orange (#ff6a00) used sparingly for maximum impact
- **Zero Fluff**: No unnecessary elements, every pixel serves a purpose
- **Dark Theme**: Deep backgrounds (#181410, #141414) for reduced eye strain

## Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Navigation**: React Navigation v6
- **State Management**: React Context + useReducer
- **Styling**: React Native StyleSheet
- **Database**: PostgreSQL with Row Level Security

## Screens

### Home Screen
- Overview of all three quit streaks
- Large poster-style cards with background images
- Current progress displayed as "X/Y" format
- Motivational quotes carousel
- Floating action button for adding new streaks

### Streak Detail Screen
- Hero section with large day counter
- Progress bar showing completion percentage
- Attempt history with bar chart visualization
- Reset functionality with confirmation
- Back navigation

## Database Schema

The app uses Supabase with the following tables:

- **users**: User profiles and authentication
- **streaks**: Active streak tracking data
- **streak_attempts**: Historical attempt data
- **motivational_quotes**: Inspirational content

All tables include Row Level Security (RLS) for data protection.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd QuitStreakCoach
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Copy your project URL and anon key

4. Configure environment variables:
   Create a `.env` file in the root directory:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm start
```

6. Run on your preferred platform:
```bash
# iOS (requires macOS)
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   └── GapView.tsx
├── config/              # Configuration files
│   └── env.ts
├── context/             # React Context providers
│   └── AppContext.tsx
├── screens/             # Screen components
│   ├── HomeScreen.tsx
│   └── StreakDetailScreen.tsx
├── services/            # API and external services
│   └── supabase.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Utility functions
    └── streakData.ts

supabase-schema.sql      # Database schema
```

## TypeScript Features

- **Strict Type Checking**: Full type safety across the application
- **Interface Definitions**: Comprehensive type definitions for all data structures
- **Navigation Types**: Type-safe navigation with React Navigation
- **API Types**: Fully typed Supabase client and responses
- **Context Types**: Type-safe React Context implementation

## Supabase Integration

### Authentication
- User registration and login
- Session management
- Row Level Security (RLS) policies

### Database Operations
- CRUD operations for streaks and attempts
- Real-time subscriptions
- Optimistic updates
- Error handling

### Security
- Row Level Security policies
- User-specific data access
- Input validation
- SQL injection prevention

## State Management

The app uses React Context with useReducer for predictable state management:

- **Global State**: User data, streaks, quotes, loading states
- **Actions**: Login, logout, create streak, update progress, reset
- **Side Effects**: API calls, data persistence, real-time updates

## Customization

### Adding New Streak Types

1. Update the `StreakType` union type in `src/types/index.ts`
2. Add corresponding data handling in services
3. Update UI components to handle the new type

### Changing Goals

Modify the goal validation in the database schema and update the UI accordingly.

### Styling

The app uses a centralized design system in `src/config/env.ts`:
- Color palette
- Typography scale
- Spacing system
- Component variants

## Development

### Code Quality

- TypeScript strict mode enabled
- ESLint configuration
- Prettier formatting
- Consistent naming conventions

### Testing

```bash
# Run TypeScript compiler check
npx tsc --noEmit

# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

### Building

```bash
# Build for production
expo build:android
expo build:ios

# Build for web
expo build:web
```

## Deployment

### Supabase

1. Deploy your Supabase project
2. Run the schema migration
3. Configure environment variables

### Mobile Apps

1. Configure app.json for your app
2. Build with EAS Build or Expo Build
3. Submit to app stores

## Future Enhancements

- [ ] Push notifications for daily check-ins
- [ ] Achievement badges for milestones
- [ ] Social sharing of progress
- [ ] Export functionality for progress reports
- [ ] Custom streak types and goals
- [ ] Dark/light theme toggle
- [ ] Accessibility improvements
- [ ] Offline mode with sync
- [ ] Analytics and insights
- [ ] Community features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure TypeScript compilation passes
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 
