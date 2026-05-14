# BracketDay

Universal tournament bracket manager for any sport or competition.

## Features

- **Any Sport**: Basketball to Chess, you name it.
- **Real-Time Updates**: Scores update live for all viewers via Firestore.
- **Instant Sharing**: One link, works on any device.
- **Admin Dashboard**: Manage multiple tournaments with ease.
- **Interactive Demo**: Try before you sign up.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Firebase Auth (Admin), Cloud Firestore (Real-time DB)
- **Framework**: Vite
- **Styling**: Premium "Midnight & Electric Violet" esports aesthetic

## Setup

### 1. Firebase Configuration

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Create a **Firestore Database**.
4. Register a Web App and copy the config.

### 2. Environment Variables

Create a `.env` file in the root directory and add your Firebase keys (refer to `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Installation

```bash
npm install
npm run dev
```

## Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com/).
3. Add your environment variables in the Vercel dashboard.
4. Deploy!

## License

MIT © 2025 BracketDay
