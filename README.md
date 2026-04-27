# Impostor Party Game

Impostor Party Game is an offline pass-the-phone party game built with Expo and React Native.

The project currently includes three playable modes:

- Impostor Mode: civilians know the word, the impostor only sees the category and optional clue.
- Civilian Mode: uses the same word bank as Impostor Mode, but the group is trying to find the civilian.
- Quiz Survival: players answer category questions, lose lives on wrong answers, and the last player standing wins.

## Features

- Offline local play on one phone.
- Multiple word categories with support for custom category additions.
- Random category selection and mixed category pools.
- Configurable player count and role count in classic mode.
- Quiz Survival with multi-category setup, random pools, and opt-in Geek questions.
- Saved settings and custom category data with AsyncStorage.
- Android release build support through Expo prebuild and Gradle.

## Tech Stack

- Expo SDK 54
- React 19
- React Native 0.81
- React Navigation Native Stack
- Zustand
- AsyncStorage

## Project Structure

- `App.js`: app entry point
- `src/navigation`: app navigation
- `src/screens`: game screens and setup flows
- `src/store`: Zustand state stores
- `src/engine`: core game and quiz logic
- `src/data`: default word categories and quiz question banks
- `src/components`: reusable UI building blocks

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Expo CLI via `npx expo`
- Android Studio / Android SDK if you want to run or build Android locally

### Install

```bash
npm install
```

### Start the Expo App

```bash
npx expo start
```

### Run on Android

```bash
npm run android
```

## Building an Android APK

This repository is kept source-only. Generated native folders and build outputs are ignored by Git.

To build Android locally:

```bash
npx expo prebuild --platform android
cd android
gradlew assembleRelease
```

The release APK is usually written to:

```text
android/app/build/outputs/apk/release/app-release.apk
```

## Game Modes

### Impostor Mode

- Civilians see the exact secret word.
- Impostors do not see the word.
- The goal is to identify the impostor during discussion and voting.

### Civilian Mode

- Uses the same word categories as Impostor Mode.
- Impostors still only see the category and optional clue.
- Civilians still see the exact word.
- The voting goal is inverted: players try to catch the civilian.

### Quiz Survival

- Players answer multiple-choice questions in turn.
- Wrong answers reduce lives.
- Eliminated players are skipped.
- The last active player wins.

## Notes

- Local build artifacts such as APKs are intentionally excluded from version control.
- The Android native folder is generated as needed from Expo prebuild.

## License

This project currently has no license file.