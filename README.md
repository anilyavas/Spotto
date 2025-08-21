# Spotto 🚗📍

**Spotto** is a mobile application built with **React Native** that helps users mark and remember where they parked their vehicles. With just one tap, users can save their current location and later navigate back to it. The app is designed for simplicity, reliability, and accessibility, making it easier than ever to avoid forgetting your parked spot.

## ✨ Features

- 📍 **Save Parking Location** – Quickly mark your current location on the map.  
- 🗺️ **View Saved Spot** – See your parked location visually on the map.  
- 🧭 **Navigate Back** – Get walking directions back to your vehicle.  
- 📝 **Notes Support** – Add optional notes (e.g., "Level 3, near exit A") when saving a spot.  
- 🕒 **Time Tracking** – Track when you parked, useful for timed parking zones.  
- 🌙 **Dark Mode Ready** – Fully supports system light/dark mode.  
- 🔒 **Secure & Private** – Your location data stays on your device unless you choose to sync.  

## 🛠 Tech Stack

- **React Native (Expo)** – Cross-platform mobile development  
- **TypeScript** – Type safety and cleaner code  
- **React Native Maps** – Map rendering and interaction  
- **Expo Location** – Device GPS tracking  
- **AsyncStorage** – Local persistence of parked locations  
- **Supabase** – Authentication and cloud sync  

## ⚙️ Installation

Follow these steps to set up the Spotto app locally:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/Spotto.git
   cd Spotto
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**  

   Create a `.env` file in the project root and add your Supabase configuration:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start the development server**  
   ```bash
   npx expo start
   ```

5. **Run the app on your device or emulator**  
   - Press `i` to open in iOS Simulator  
   - Press `a` to open in Android Emulator  
   - Or scan the QR code in the Expo Go app on a physical device  

6. **Optional: Run Supabase Edge Functions**  

   If you use functions like `delete-user`, serve them locally:

   ```bash
   npx supabase functions serve
   ```

## 🚀 Usage

Spotto allows users to mark and manage their parked vehicle locations with ease. Here's how to use the app:

### 1. **Authentication**
- Sign up or log in using your email.
- You can also use the app as a guest without creating an account.

### 2. **Marking Your Parked Location**
- Open the app and navigate to the map screen.
- Press the **"Park Here!"** button to save your current location.
- The marker will appear on the map showing your parked vehicle.
- If a location is already parked, the button will turn red and show **"Clear Park"**. Pressing it will remove the parked location.

### 3. **Viewing Parked Location**
- Your saved location will be displayed on the map with a marker.
- If your current GPS location overlaps with the parked location, the marker may show slightly offset to remain visible.

### 4. **Account Management**
- Navigate to the **Profile** screen.
- Change your password securely.
- Delete your account permanently using the **Delete Account** button (requires Supabase Edge Function for deletion).
- Sign out using the **Sign Out** button.

### 5. **Notes**
- The app works fully offline to display previously saved locations.
- Ensure location permissions are enabled for accurate tracking.
- All parked locations are tied to your account and stored in Supabase.

## 🏗 Architecture

Spotto is structured around a simple client-server model with mobile-first design and Supabase backend services.

```
┌───────────── Mobile App ─────────────┐
│                                      │
│ 1. Map & Location                     │
│    • Access device GPS                │
│    • Display map using react-native-maps │
│    • Show parked location markers     │
│                                      │
│ 2. Park / Clear Location              │
│    • Pressable button triggers store  │
│    • Calls Supabase to insert/delete location │
│                                      │
│ 3. Account Management                 │
│    • Change password                  │
│    • Delete account (via Edge Function) │
│                                      │
└───────────────┬──────────────────────┘
                │
                ▼
┌───────────── Supabase Backend ─────────────┐
│                                            │
│ • PostgreSQL database                       │
│   - Table: parked_locations                 │
│   - Columns: id, user_id, latitude, longitude, created_at │
│                                            │
│ • Authentication (email/password)          │
│                                            │
│ • Edge Function                             │
│   - delete-user: securely deletes account  │
│                                            │
│ • API Client: Supabase JS/TS SDK           │
└────────────────────────────────────────────┘
```

### Key Components
- **Mobile App:** Built with React Native and TypeScript.
- **State Management:** Uses Zustand to manage parked location state.
- **Database:** Supabase PostgreSQL stores all parked locations.
- **Authentication:** Supabase Auth handles user sessions.
- **Edge Functions:** Serverless functions for sensitive operations like account deletion.
- **Maps:** `react-native-maps` displays current location and parked spots.

## 🧪 Testing

- Use Expo Go to test on a physical device.
- Run the simulator for Android/iOS.
- Test edge cases like overlapping GPS coordinates, no location permission, and offline mode.

## 📦 Deployment

- The app is ready to build with Expo EAS for both Android and iOS.
- Supabase backend is live for authentication and storing parked locations.
- Edge functions like `delete-user` should be deployed to Supabase Functions.

## 📖 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add some feature'`)
5. Push (`git push origin feature/your-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React Native and Expo team
- Supabase for backend services
- React Native Maps and Expo Location for geolocation features
- Inspired by real-world need to never forget parked locations
