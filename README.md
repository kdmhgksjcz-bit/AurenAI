# AUREN AI

AUREN is a mobile-first private beauty studio for practical, evidence-aware hair and skincare guidance.

## Product principles

- English is the initial app language.
- No face scan or photo upload in the current product direction.
- Hair and skin guidance is cosmetic and educational, not medical diagnosis.
- Recommendations should explain their rationale, evidence quality, and uncertainty.
- Avoid appearance pressure, exaggerated claims, and unnecessary product steps.
- Keep personal profile information private and request only what is useful.

## Current prototype

- Editorial studio home screen.
- Interactive hair profile questionnaire.
- Interactive skin profile questionnaire.
- Local in-screen selection state only; no account, cloud profile storage, AI inference, or product catalogue is connected yet.

## Stack

- Expo SDK 54
- React Native
- Expo Router
- TypeScript

SDK 54 is selected so the project can be tested with the Expo Go version currently available through the iOS App Store. Newer SDKs require a different iOS testing setup according to Expo's current compatibility guidance.

## Development

```bash
npm install
npx expo start
npm run typecheck
```

Before release, align dependency patch versions with Expo's installer and run Expo Doctor.
