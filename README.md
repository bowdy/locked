# Locked In 🔒

A daily habit-tracking app for the "Locked In" checklist — Morning, Focused work, Health, Mindset, Evening, and a Daily score out of 7. Built with [Expo](https://expo.dev) (React Native), one codebase for iOS and Android.

## Features

- **Today** — tick off the full checklist, grouped by section, with per-section progress bars.
- **Daily score** — the 7 scoring items from the checklist, shown as `X / 7`. Hit 7/7 and you're **LOCKED IN**.
- **History & streaks** — every tracked day with its score; a day counts as "locked in" at 6/7 or better, and consecutive locked-in days build your 🔥 streak.
- **Automatic daily reset** — the checklist rolls over at midnight (local time); past days are kept in history.
- All data is stored on-device (AsyncStorage). No account, no server.

## Run it locally

```bash
npm install
npx expo start
```

Scan the QR code with the [Expo Go](https://expo.dev/go) app on your phone — this is the fastest way to try the app before any store deployment.

## Deploying

Both stores are handled by [EAS Build](https://docs.expo.dev/build/introduction/) + [EAS Submit](https://docs.expo.dev/submit/introduction/). Builds run on Expo's cloud servers, so you don't need a Mac or Android Studio.

### One-time setup

1. **Expo account** — sign up free at [expo.dev](https://expo.dev), then:
   ```bash
   npm install -g eas-cli
   eas login
   eas init   # links this repo to an EAS project (writes extra.eas.projectId into app.json — commit that change)
   ```
2. **Apple** — you need a paid [Apple Developer Program](https://developer.apple.com/programs/) membership ($99/yr). EAS can create the app record, certificates and provisioning profiles for you interactively during the first build/submit — just have your Apple ID ready.
3. **Google** — you need a [Google Play Console](https://play.google.com/console) account ($25 one-off). Create the app in the console (package name `com.bowdy.lockedin`), then create a [service-account key](https://docs.expo.dev/submit/android/) so EAS can upload builds. Note: Google requires the **first** AAB to be uploaded manually through the Play Console UI; every build after that can go through `eas submit`.

### Ship to TestFlight (iOS)

```bash
eas build --platform ios --profile production --auto-submit
```

EAS builds the app, signs it, and pushes it to App Store Connect. It appears in TestFlight after Apple's automated processing (usually 5–30 minutes). Add yourself as an internal tester in App Store Connect → TestFlight and install via the TestFlight app.

### Ship to Android

```bash
# Fastest: an installable APK you can put on any device (no Play Console needed)
eas build --platform android --profile preview

# Play Store internal-testing track
eas build --platform android --profile production --auto-submit
```

The `preview` profile produces an APK with a QR-code install link — good for immediate testing. The `production` profile produces an AAB and submits it to the Play internal-testing track.

### CI builds from GitHub

The workflow in `.github/workflows/eas-build.yml` runs the same build/submit from GitHub Actions. Set one repository secret:

- `EXPO_TOKEN` — create at [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)

Then trigger **EAS Build & Submit** from the Actions tab, choosing platform and whether to auto-submit. (Store credentials live in your EAS account, not in GitHub.)

## Project structure

```
App.tsx                     Tab shell (Today / History) + streak logic
src/data/checklist.ts       All checklist sections, items, and scoring rules
src/lib/storage.ts          AsyncStorage persistence, per-day records
src/lib/dates.ts            Local-date helpers
src/screens/TodayScreen.tsx Daily checklist + score
src/screens/HistoryScreen.tsx  Past days, streak, locked-in stats
src/components/             CheckRow, SectionCard, ScoreCard
```

Checklist wording lives in `src/data/checklist.ts` — edit it there to tweak habits. Item ids are the storage keys, so keep ids stable if you rename labels (changing an id orphans its past ticks).
