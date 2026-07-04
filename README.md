# AMS Prayer Times

A React-based web application that generates dynamic Hijri prayer time calendars for the American Moslem Society (AMS). Optimized for printing onto Legal-size (8.5" x 14") paper.

## Features

- **API-Driven:** Fetches accurate, annual prayer times via the [Aladhan API](https://aladhan.com/prayer-times-api) with client-side caching.
- **Print-Ready:** CSS optimized for Legal-size paper output with a clean, professional layout.
- **Automatic DST Detection:** Detects Daylight Saving Time transitions by monitoring Dhuhr time shifts and inserts a visual split in the table.
- **Smart Formatting:**
  - Dynamic column striping for readability.
  - Ramadan Mode: Highlights the Fajr and Maghrib columns.
  - Friday highlighting for the entire row.
- **Ads Page:** A second print page with a grid of community ads/sponsors.
- **User-Friendly Controls:** Select Hijri year and month, with the current Hijri date set as the default.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Format Code

```bash
npm run format
```

## Usage

1. Open the app in a browser.
2. Select the desired Hijri year and month using the controls at the top.
3. The prayer timetable loads automatically.
4. Click **Print to PDF**. In the print dialog, ensure:
   - **Paper Size** is set to **Legal (8.5" x 14")**.
   - **Background Graphics** is **enabled**.

## Tech Stack

- **React 18** — UI components and state management
- **Vite** — Build tooling and dev server
- **CSS Modules** — Scoped, component-level styling
- **Prettier** — Code formatting with import sorting and CSS ordering

## Project Structure

```
src/
├── App.jsx                  # Root component with data fetching logic
├── main.jsx                 # Entry point
├── constants.js             # Hijri/Gregorian month names, day abbreviations
├── index.css                # Global styles and font declarations
└── components/
    ├── Header.jsx           # Page header with mosque branding
    ├── PrayerTable.jsx      # Monthly prayer timetable
    ├── AdsTable.jsx         # Sponsor/ad grid for the second print page
    └── *.module.css          # Component-scoped styles
```
