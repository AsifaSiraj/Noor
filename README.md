# 🕌 Noor — Islamic Web Application

<div align="center">

![Noor Logo](https://img.shields.io/badge/🌙_NOOR-Islamic_https://019c9abc-7747-78e5-8455-a0b88e9d18a4.arena.site/)

**A comprehensive full-stack Islamic web application with modern UI/UX, built to help Muslims manage their daily worship, Quran reading, prayer tracking, and spiritual growth.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Features](#-features) · [Installation](#-installation) · [Screenshots](#-screenshots) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Integrations](#-api-integrations)
- [Data Storage & Backup](#-data-storage--backup)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About

**Noor** (meaning "Light" in Arabic) is a feature-rich Islamic web application designed to help Muslims organize their daily worship, track prayers, read Quran, count Azkar, and maintain a productive Islamic lifestyle. The app features a beautiful Islamic aesthetic with dark/light mode support, mobile responsiveness, and smooth animations.

All data is stored locally in the browser with per-user isolation, meaning multiple users can use the same device with independent data. The app also includes a backup/restore feature to export and import data as JSON files.

---

## ✨ Features

### 🔐 1. User Authentication System
- Secure signup with name, email, and password
- Login with email/password validation
- Password encoding and validation
- Forgot password / reset password flow
- User profile management (edit name, email)
- Session persistence across browser sessions
- Multi-user support on same device
- Per-user data isolation

### 🧭 2. Qibla Direction Finder
- **3-layer location detection:**
  1. GPS (browser Geolocation API)
  2. IP-based fallback (ipapi.co)
  3. Manual coordinate entry
- Accurate Qibla angle calculation using Kaaba coordinates (21.4225°N, 39.8262°E)
- Animated compass with cardinal directions & degree markers
- Mobile compass with device orientation sensor
- Distance to Kaaba display (in km)
- Reverse geocoding to show city/country names
- Recalibrate & manual detect buttons

### ⏰ 3. Prayer Times & Alarms
- Auto-detects city/country from GPS or IP
- Fetches accurate prayer times from **Aladhan API**
- All 5 daily prayers: **Fajr, Dhuhr, Asr, Maghrib, Isha** (+ Sunrise)
- Manual location override (search by city/country)
- Multiple calculation methods:
  - ISNA (Islamic Society of North America)
  - MWL (Muslim World League)
  - Umm Al-Qura University, Makkah
  - Egyptian General Authority
  - And more...
- Toggle alarms per prayer with browser notifications
- Mark prayers as completed with progress tracking
- Hijri date display
- Highlights next upcoming prayer
- Weekly prayer consistency tracking

### 📿 4. Azkar & Zikr Module
- **Morning Azkar** — 8 authentic azkar with Arabic text + English translation
- **Evening Azkar** — 6 authentic azkar with Arabic text + English translation
- Tap-to-count with animated progress bars
- **Tasbeeh Counter:**
  - 6 built-in dhikr options (SubhanAllah, Alhamdulillah, Allahu Akbar, etc.)
  - Circular progress visualization
  - Target count with reset
- **Custom Zikr (My Zikr):**
  - Add your own zikr with Arabic text + translation
  - Individual counter per zikr
  - Adjustable target count (33, 100, 500, or custom)
  - Progress bar and completion celebration
  - Delete unwanted zikr
- **Islamic Calendar** — All 12 Hijri months with special highlights
- All progress saved persistently per user

### 📖 5. Tuhfat ul Akhirat (Book of the Hereafter)
A complete Islamic book integrated into the Azkar page with **10 chapters**:

| # | Arabic Title | English Topic |
|---|-------------|---------------|
| 1 | بَابُ ذِكْرِ الْمَوْتِ | Remembrance of Death |
| 2 | عَذَابِ الْقَبْرِ | Punishment & Blessings of the Grave |
| 3 | أَهْوَالِ يَوْمِ الْقِيَامَةِ | Horrors of the Day of Judgment |
| 4 | الصِّرَاطِ وَالْحِسَابِ | The Bridge & Accountability |
| 5 | صِفَةِ الْجَنَّةِ | Description of Paradise |
| 6 | صِفَةِ النَّارِ | Description of Hellfire |
| 7 | التَّوْبَةِ | Virtue of Repentance |
| 8 | فَضَائِلِ الْأَعْمَالِ | Virtues of Good Deeds |
| 9 | عَلَامَاتِ السَّاعَةِ | Signs of the Hour |
| 10 | الدُّعَاءِ لِلْآخِرَةِ | Duas for the Hereafter |

Each chapter includes Arabic titles, Hadith references, and detailed content.

### 📅 6. Smart Schedule Planner
- Create tasks with title, time, date, and category
- 5 task categories: Prayer, Islamic, Work, Personal, Other
- Mark tasks complete / delete tasks
- Filter by category
- Date picker for different days
- Daily completion progress bar
- **AI-powered tips** with 6 Islamic productivity recommendations
- **Add AI suggestion as task** — one-click to add recommended tasks
- Customize suggested tasks before adding

### 🤖 7. AI-Based Recommendation Engine
- Analyzes prayer consistency patterns
- Task completion rate analysis
- Time-based suggestions (after Fajr, before Maghrib, etc.)
- Personalized motivational messages
- Islamic routine optimization tips
- Dashboard widget with real-time stats

### 📖 8. Quran Integration
- **Full 114 Surahs** via Al-Quran Cloud API
- Browse by **Surah** or **Juz/Para** (30 Juz)
- Beautiful Arabic text display with **Amiri font**
- **3 Famous Qaris with verified audio:**

| Qari | API Edition |
|------|-------------|
| Mishary Rashid Alafasy | `ar.alafasy` |
| Abdul Rahman Al-Sudais | `ar.abdurrahmaansudais` |
| Mahmoud Khalil Al-Husary | `ar.husary` |

- Play audio per ayah (single ayah playback)
- Play entire surah (sequential ayah playback)
- Now Playing indicator with stop button
- Bookmark any ayah
- Last read position tracking
- Continue reading feature
- Surah info (verses count, revelation type)

### 🔖 9. Bookmarks & Progress Tracking
- Bookmark Quran ayahs
- Categorized bookmark view
- Stats overview cards
- Personal dashboard with engagement metrics
- Weekly prayer tracker bar chart

### 👤 10. Profile & Data Management
- Edit profile (name, email)
- Dark/light mode toggle
- Notification preferences
- **Data Info Section** — Clear explanation of when data persists vs. when it's lost
- **Backup & Restore:**
  - Download all data as `.json` file
  - Restore from backup file with validation
  - Named backup files: `noor-backup-YourName-2025-01-15.json`
- **Danger Zone** — Clear tasks & bookmarks with confirmation

### 🎨 11. UI/UX Design
- Clean Islamic aesthetic with emerald/green theme
- **Dark/Light mode** toggle (persists globally)
- Fully mobile responsive with collapsible sidebar
- Smooth animations (fade-in, slide-in, pulse-glow)
- Islamic geometric pattern backgrounds
- Arabic Amiri font for Quranic text
- Bismillah header on every page
- Islamic crescent moon branding
- Color-coded categories and statuses

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19.2 + TypeScript 5.9 |
| **Build Tool** | Vite 7.2 |
| **Styling** | Tailwind CSS 4.1 |
| **Routing** | React Router DOM 7.13 (HashRouter) |
| **Icons** | Lucide React |
| **State Management** | React Context API + useReducer |
| **Data Persistence** | localStorage (per-user isolation) |
| **Fonts** | Google Fonts (Inter + Amiri) |
| **Utilities** | clsx + tailwind-merge |

### External APIs Used

| API | Purpose | URL |
|-----|---------|-----|
| **Aladhan API** | Prayer times & Hijri dates | `api.aladhan.com` |
| **Al-Quran Cloud** | Quran text, audio & metadata | `api.alquran.cloud` |
| **ipapi.co** | IP-based geolocation fallback | `ipapi.co` |
| **Nominatim (OSM)** | Reverse geocoding | `nominatim.openstreetmap.org` |

---

## 📁 Project Structure

```
noor/
├── index.html                    # Entry HTML file
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
│
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Root component with routing
    ├── index.css                 # Global styles & animations
    │
    ├── utils/
    │   └── cn.ts                 # Tailwind class merge utility
    │
    ├── data/
    │   └── azkarData.ts          # Azkar content + Tuhfat ul Akhirat book
    │
    ├── context/
    │   └── AppContext.tsx         # Global state (auth, tasks, bookmarks, etc.)
    │
    ├── components/
    │   └── Layout.tsx            # Sidebar navigation + header layout
    │
    └── pages/
        ├── AuthPage.tsx          # Login / Signup / Forgot Password
        ├── Dashboard.tsx         # Home dashboard with stats & AI tips
        ├── QiblaPage.tsx         # Qibla compass & direction finder
        ├── PrayerTimesPage.tsx   # Prayer times with alarms
        ├── AzkarPage.tsx         # Azkar, Tasbeeh, Custom Zikr, Book
        ├── QuranPage.tsx         # Quran reader with audio
        ├── SchedulePage.tsx      # Task planner with AI suggestions
        ├── BookmarksPage.tsx     # Saved bookmarks & progress
        └── ProfilePage.tsx       # Profile, settings, backup/restore
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (v9 or higher) — comes with Node.js
- **Git** — [Download](https://git-scm.com/)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/noor-islamic-app.git
   cd noor-islamic-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📱 Usage

### Getting Started

1. **Create an account** — Open the app and sign up with your name, email, and password
2. **Allow location access** — For automatic prayer times and Qibla direction
3. **Explore the dashboard** — View your stats, prayer times, and AI recommendations
4. **Start reading Quran** — Browse by Surah or Juz, play audio, bookmark ayahs
5. **Track your prayers** — Mark prayers as completed, view weekly progress
6. **Count Azkar** — Use built-in or create custom zikr with counters
7. **Plan your day** — Add tasks, get AI-powered schedule suggestions

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit forms (login, search, add task) |
| `Escape` | Close modals and popups |

### Data Backup

1. Go to **Profile** page
2. Click **"Download Backup"** to save your data as a JSON file
3. Store the file safely (Google Drive, Email, etc.)
4. To restore: Click **"Restore from Backup"** and select your file

---

## 💾 Data Storage & Backup

### Where is data stored?

All data is stored in your browser's **localStorage** with per-user isolation.

| Scenario | Data Status |
|----------|-------------|
| ✅ Normal browser usage | **Safe** — data persists |
| ✅ Close & reopen browser | **Safe** — data persists |
| ✅ Logout & login again | **Safe** — data restored |
| ✅ Multiple users on same device | **Safe** — isolated per user |
| ❌ Clear browser cache/cookies | **Lost** — backup needed |
| ❌ Incognito/Private mode | **Lost** — not saved |
| ❌ Different browser or device | **Not available** — backup needed |

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `noor_users` | Registered user accounts |
| `noor_auth_session` | Current login session |
| `noor_app_state` | Active app state |
| `noor_user_data_{userId}` | Per-user saved data |
| `noor_dark_mode` | Global dark mode preference |

### Backup Recommendation

Download a backup **weekly** from the Profile page. If your browser data is ever cleared, you can restore everything from the backup file.

---

## 🔌 API Integrations

### 1. Aladhan API (Prayer Times)
```
GET https://api.aladhan.com/v1/timingsByCity/{date}?city={city}&country={country}&method={method}
```
- Returns prayer times for any city/country
- Supports multiple calculation methods
- Includes Hijri date conversion

### 2. Al-Quran Cloud API (Quran)
```
GET https://api.alquran.cloud/v1/surah                    # List all surahs
GET https://api.alquran.cloud/v1/surah/{number}/ar.alafasy # Surah with audio
GET https://api.alquran.cloud/v1/ayah/{number}/{edition}   # Single ayah audio
GET https://api.alquran.cloud/v1/juz/{number}/quran-uthmani # Juz text
```
- Full Quran text in Uthmani script
- Audio from 3 verified Qari editions
- Surah and Juz organization

### 3. ipapi.co (Geolocation Fallback)
```
GET https://ipapi.co/json/
```
- IP-based location detection
- Returns latitude, longitude, city, country
- Used when GPS is unavailable

### 4. Nominatim / OpenStreetMap (Reverse Geocoding)
```
GET https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json
```
- Converts GPS coordinates to city/country names
- Used for Qibla page location display

---

## 🎨 Design System

### Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Emerald 600 | Primary brand color | `#059669` |
| Emerald 700 | Hover states | `#047857` |
| Emerald 800 | Dark accents | `#065f46` |
| Amber 500 | Arabic text highlights | `#f59e0b` |
| Slate 900 | Dark mode background | `#0f172a` |
| White | Light mode background | `#ffffff` |

### Typography

| Font | Usage |
|------|-------|
| **Inter** | UI text, buttons, labels |
| **Amiri** | Arabic/Quranic text |

### Animations

| Animation | Class | Usage |
|-----------|-------|-------|
| Fade In | `animate-fade-in` | Page transitions |
| Slide In | `animate-slide-in` | Sidebar items |
| Pulse Glow | `animate-pulse-glow` | Active prayer highlight |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Contribution Ideas

- [ ] Add more Qari audio options
- [ ] Add Hadith of the Day feature
- [ ] Add Islamic Quiz module
- [ ] Add Dua collection
- [ ] Add Ramadan special features (Suhoor/Iftar times)
- [ ] Add multi-language support (Arabic, Urdu, Turkish, etc.)
- [ ] Add PWA support for offline usage
- [ ] Add push notifications for prayer times
- [ ] Backend integration with Node.js + MySQL
- [ ] Social features (share progress, community)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits & Acknowledgments

- **[Aladhan API](https://aladhan.com/prayer-times-api)** — Prayer times data
- **[Al-Quran Cloud](https://alquran.cloud/api)** — Quran text and audio
- **[Lucide Icons](https://lucide.dev/)** — Beautiful open-source icons
- **[Google Fonts](https://fonts.google.com/)** — Inter & Amiri fonts
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[React](https://react.dev/)** — UI library
- **[Vite](https://vitejs.dev/)** — Build tool

---

<div align="center">

### بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

**Built with ❤️ for the Muslim Ummah**

*May Allah accept this effort and make it beneficial for all. Ameen.*

⭐ **Star this repo if you find it useful!** ⭐

</div>
