# Firebase Setup Guide for NeuroCards

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "neurocards-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Enable Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 4. Get Your Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Update firebase-config.js

Replace the placeholder configuration in `firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "your-actual-app-id"
};
```

## 6. Set Up Firestore Security Rules (Optional)

For production, update your Firestore rules to secure user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's cards subcollection
      match /cards/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 7. Test Your Setup

1. Open your app in a web browser
2. Try signing up with a new account
3. Create some flashcards
4. Sign out and sign back in
5. Verify your cards are still there (synced from cloud)

## Features Enabled

✅ **User Authentication**: Sign up, sign in, sign out
✅ **Cloud Storage**: Cards sync across devices
✅ **Offline Support**: Works offline, syncs when reconnected
✅ **Real-time Sync**: Changes sync automatically when online
✅ **Data Security**: Each user can only access their own cards

## Troubleshooting

- **Import errors**: Make sure you're serving the files from a web server (not file://)
- **CORS errors**: Use a local development server like `python -m http.server` or `npx serve`
- **Auth not working**: Check your Firebase configuration and ensure Authentication is enabled
- **Data not syncing**: Check browser console for errors and verify Firestore is set up correctly