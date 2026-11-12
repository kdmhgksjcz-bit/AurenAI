# AUREN AI

AUREN is a mobile-first private beauty studio for practical, evidence-aware hair and skincare guidance.

## Product principles

- English is the initial app language.
- Guided photo scans are optional and user-initiated.
- Hair and skin guidance is cosmetic and educational, not a medical diagnosis.
- Recommendations should explain their rationale, evidence quality, and uncertainty.
- Avoid appearance pressure, exaggerated claims, and unnecessary product steps.
- Do not infer identity, age, ethnicity, attractiveness, or medical conditions from photos.
- Do not store scan images in a user profile or photo library. Images are transmitted to the configured AI service for analysis and are subject to that provider's privacy terms.

## Current prototype

- Editorial private-studio home screen.
- Interactive hair profile questionnaire.
- Interactive skin profile questionnaire.
- Product catalogue experience (prototype content).
- Guided camera capture for a hair or skin image.
- Server-side visual analysis through Vercel AI Gateway.
- No account system or persistent user profile storage is connected yet.

The scan only describes visible details in the submitted photo. It cannot establish scalp health, hair porosity, strand diameter, skin disease, hormones, or medical causes.

## Stack

- Expo SDK 54
- React Native
- Expo Router
- TypeScript
- Vercel Functions and AI Gateway

## Environment

The scan uses the deployed AUREN API by default. To point a local or alternate build at another deployment, set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-deployment.example
```

Configure AI Gateway authentication in the Vercel project environment. Never put API credentials in client-side Expo variables.

## Development

```bash
npm install
npx expo start
npm run typecheck
npm run build:web
```

Before release, align dependency patch versions with Expo's installer, run Expo Doctor, and test the camera and AI request on a physical device.
