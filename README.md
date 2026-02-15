# 🎯 Habit Tracker - Atomic Habits Made Simple

A beautiful, gamified habit tracking app built with React Native and Expo, following the Atomic Habits methodology.

![App Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB.svg?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg?style=flat&logo=typescript)

## ✨ Features

### 🎮 Gamification System
- **XP & Leveling**: Earn 50 XP per completed habit
- **Streaks**: Track current and best streaks
- **Levels**: Progress through levels as you build habits
- **Achievements**: Unlock badges and rewards

### 📅 Habit Management
- **Atomic Habits Framework**: "After I [trigger], I will [action]" structure
- **Flexible Scheduling**: Set habits for specific days of the week
- **Color Coding**: 8 beautiful color themes for visual organization
- **Star Favorites**: Pin important habits to the top
- **Notes**: Add personal motivation and context

### 📊 Analytics & Insights
- **Weekly Charts**: Visual bar charts showing completion trends
- **Streak Visualization**: Progress bars and comparisons
- **30-Day Calendar**: Heatmap view of habit completions
- **Statistics**: Completion rates, total completions, and more
- **Real-time Updates**: All stats update instantly

### 🔔 Smart Reminders
- **Daily Notifications**: Customizable reminder times
- **Habit-Specific Alerts**: Get reminded about specific habits
- **Smart Scheduling**: Notifications only on active days

### ☁️ Cloud Backup
- **Google Drive Integration**: Secure cloud backups
- **Multiple Backups**: Keep different versions
- **Easy Restore**: One-tap restoration
- **Auto-Sync**: Optional automatic backups

### 🎨 Beautiful UI/UX
- **Dark Theme**: Easy on the eyes, battery-efficient
- **Smooth Animations**: Reanimated 2 for 60fps animations
- **Haptic Feedback**: Tactile responses on iOS
- **Gradient Effects**: Beautiful LinearGradient accents
- **Responsive Design**: Works on all screen sizes

## 📱 Screenshots

<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 26 27" src="https://github.com/user-attachments/assets/e096e1ee-b707-474c-a896-ac41c7c4b385" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 25 22" src="https://github.com/user-attachments/assets/95ef6a00-f928-41bd-a05d-691b0d9ef30e" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 28 09" src="https://github.com/user-attachments/assets/93ca3875-9c43-45eb-8f1c-eaebbff5e383" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 26 48" src="https://github.com/user-attachments/assets/2c4d36d3-1513-44ba-a91c-715a25d3cab7" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 26 45" src="https://github.com/user-attachments/assets/bfe116b7-4be5-4612-aea9-53097bbb2761" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 33 08" src="https://github.com/user-attachments/assets/db6abeff-9a14-43b4-b46f-3db294509d73" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 28 09" src="https://github.com/user-attachments/assets/92cc8e3d-9a77-4236-a19f-3bf9550b8621" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 32 45" src="https://github.com/user-attachments/assets/6e5a793f-b284-467a-b8a4-098bf95e523b" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 32 36" src="https://github.com/user-attachments/assets/cc74a6ed-12b4-483e-9731-22852779a799" />
<img width="360" height="800" alt="Screen Shot 2026-02-14 at 08 33 52" src="https://github.com/user-attachments/assets/88fe88e5-2dfd-49a3-9021-9170a7f01629" />



## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your phone (for testing)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/Task-Crush.git
   cd habit-tracker
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start the development server**
```bash
   npx expo start
```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android)
   - Scan with Camera app (iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web

## 🏗️ Project Structure
```
habit-tracker/
├── app/                          # 🧭 Screens & Navigation (Expo Router)
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx          # Tab navigator
│   │   ├── index.tsx            # Today screen
│   │   ├── habits.tsx           # All habits screen
│   │   └── profile.tsx          # Profile & settings
│   ├── modals/                  # Modal screens
│   │   ├── create-habit.tsx    # Create/edit habit
│   │   ├── habit-detail.tsx    # Habit details & stats
│   │   ├── edit-profile.tsx    # Edit user profile
│   │   └── backup-manager.tsx  # Google Drive backup
│   └── _layout.tsx              # Root layout
│
├── components/                   # 🧩 Reusable Components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── TextInput.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── DaySelector.tsx
│   │   ├── StatBox.tsx
│   │   ├── QuoteCard.tsx
│   │   ├── FloatingActionButton.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── SettingItem.tsx
│   │   ├── AvatarPicker.tsx
│   │   └── EmptyState.tsx
│   ├── habits/                  # Habit-specific components
│   │   ├── HabitCard.tsx
│   │   └── CompletionCalendar.tsx
│   ├── gamification/            # Game elements
│   │   ├── XPBar.tsx
│   │   └── StreakCounter.tsx
│   └── charts/                  # Data visualization
│       ├── WeeklyChart.tsx
│       └── StreakChart.tsx
│
├── features/                     # 🎯 Feature Modules
│   ├── habits/
│   │   ├── types.ts             # Habit interfaces
│   │   ├── utils.ts             # Habit logic
│   │   └── constants.ts
│   └── gamification/
│       ├── types.ts
│       ├── xp-system.ts
│       └── level-system.ts
│
├── store/                        # 💾 State Management (Zustand)
│   ├── habitStore.ts            # Habits state & actions
│   ├── userStore.ts             # User profile & XP
│   └── index.ts
│
├── services/                     # 🔌 External Services
│   ├── storage.ts               # AsyncStorage wrapper
│   ├── notifications.ts         # Push notifications
│   ├── quotes-api.ts            # Motivational quotes
│   └── google-drive.ts          # Cloud backup
│
├── hooks/                        # 🪝 Custom Hooks
│   └── useTheme.ts
│
├── constants/                    # 📋 App Constants
│   ├── Colors.ts                # Theme colors
│   ├── Typography.ts            # Font styles
│   ├── Spacing.ts               # Layout spacing
│   └── Shadows.ts               # Shadow styles
│
├── theme/                        # 🎨 Theme System
│   ├── dark-theme.ts
│   └── index.ts
│
├── utils/                        # 🛠️ Utility Functions
│   └── date.ts
│
└── assets/                       # 🖼️ Static Assets
    ├── fonts/
    └── images/
```

## 🔧 Configuration

### Google Drive Backup Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Drive API

2. **Configure OAuth**
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI:
```
     https://auth.expo.io/@YOUR_EXPO_USERNAME/habit-tracker
```

3. **Update Configuration**
   - Copy your Client ID
   - Update `services/google-drive.ts`:
```typescript
     const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
```

### Notifications Setup

Notifications work automatically on physical devices. For iOS, ensure you have:
```json
"ios": {
  "infoPlist": {
    "NSUserNotificationsUsageDescription": "This app uses notifications to remind you about your daily habits."
  }
}
```

## 📦 Tech Stack

### Core
- **[React Native](https://reactnative.dev/)** - Mobile framework
- **[Expo](https://expo.dev/)** (SDK 52) - Development platform
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Navigation
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based routing

### State Management
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)** - Persistent storage

### UI & Animations
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - 60fps animations
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** - Gradient effects
- **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** - Haptic feedback
- **[React Native SVG](https://github.com/software-mansion/react-native-svg)** - SVG support

### Features
- **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** - Push notifications
- **[Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)** - OAuth authentication
- **[Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)** - In-app browser

### Utilities
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[@expo/vector-icons](https://docs.expo.dev/guides/icons/)** - Icon library

## 🎨 Color Palette
```typescript
Background:
- Primary: #0B0B0E (Near black)
- Secondary: #111114
- Tertiary: #1A1A1F (Cards)
- Elevated: #222227

Text:
- Primary: #FFFFFF
- Secondary: #A0A0A8
- Tertiary: #6B6B73

Accents:
- Purple: #8B7EF5
- Blue: #5B8DEF
- Green: #5FD4A0
- Orange: #F5A962
- Pink: #F572A0
- Cyan: #5FD4D4
- Yellow: #F5D962
- Red: #F57272
```

## 📖 Usage Guide

### Creating a Habit

1. Tap the **+ button** on the Habits screen
2. Enter your habit name (e.g., "Morning Meditation")
3. Define the **trigger**: "After I wake up"
4. Define the **action**: "I will meditate for 5 minutes"
5. Choose a color
6. Select active days
7. Add optional notes
8. Tap **Create Habit**

### Completing Habits

1. Go to **Today** or **Habits** screen
2. Tap the **checkbox** next to a habit
3. Earn 50 XP instantly!
4. Build your streak 🔥

### Viewing Statistics

1. Tap any habit to see details
2. View:
   - Current & best streaks
   - Total completions
   - 30-day completion rate
   - Calendar heatmap

### Backing Up Data

1. Go to **Profile** → **Google Drive Backup**
2. Sign in with Google
3. Tap **Create New Backup**
4. Your data is safely stored in Google Drive!

### Developer Mode

1. Go to **Profile**
2. Tap **Version** 7 times
3. Access developer tools:
   - Clear all habits
   - Reset profile
   - View storage keys
   - Test notifications

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📱 Building for Production

### Create Development Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for Android
eas build --platform android --profile development

# Build for iOS
eas build --platform ios --profile development
```

### Create Production Build
```bash
# Android APK
eas build --platform android --profile production

# iOS IPA
eas build --platform ios --profile production
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Atomic Habits](https://jamesclear.com/atomic-habits)** by James Clear - Methodology inspiration
- **[Expo Team](https://expo.dev/)** - Amazing development platform
- **[Quotable API](https://github.com/lukePeavey/quotable)** - Free motivational quotes

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/habit-tracker/issues)
- **Email**: support@habittracker.com
- **Discord**: [Join our community](#)

## 🗺️ Roadmap

- [ ] Widget support (iOS & Android)
- [ ] Apple Health / Google Fit integration
- [ ] Social features (share progress)
- [ ] Custom themes
- [ ] Habit templates
- [ ] Export data (CSV, JSON)
- [ ] Multi-language support
- [ ] Web app version
- [ ] Apple Watch companion app

## 📊 App Statistics

- **Lines of Code**: ~5,000+
- **Components**: 30+
- **Screens**: 7
- **Features**: 25+
- **Bundle Size**: ~15 MB

## 💡 Tips & Tricks

### Maximize Your Streaks
- Complete habits at the same time each day
- Use notifications as reminders
- Start with small, achievable habits
- Track your progress weekly

### Optimize Performance
- Disable animations in Accessibility settings if needed
- Clear old backups regularly
- Use developer mode to reset data if app feels slow

### Backup Best Practices
- Create weekly backups
- Keep at least 3 backup versions
- Test restore on a secondary device

---

**Made with ❤️ using React Native & Expo**

⭐ Star this repo if you found it helpful!

🐛 Found a bug? [Report it](https://github.com/yourusername/habit-tracker/issues)

🚀 Want a feature? [Request it](https://github.com/yourusername/habit-tracker/issues)
```

---

## **Additional Files to Create**

### **1. LICENSE** (MIT License)

Create `LICENSE`:
```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
