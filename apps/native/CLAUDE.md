# `apps/native` — Expo SDK + Expo Router

Reach for the `expo` user-global agent at `~/.claude/agents/expo.md` for idiomatic patterns. Highlights:

- Expo Router file-based routing in `app/`. `_layout.tsx` for shared chrome.
- Universal-first: write components that render on iOS, Android, *and* web (`react-native-web`). Use `Platform.OS` or `.ios.tsx` / `.android.tsx` only when divergence is large.
- `FlatList` / `FlashList` for lists with stable keys; never `<ScrollView>` + `.map` for >50 items.
- Use `expo-secure-store` for tokens; `AsyncStorage` for non-secret state.
- NativeWind v4 for styles — same Tailwind classes as the web app.
- Tests: Vitest + `@testing-library/react-native`. Don't try to E2E from Vitest — defer to Maestro for the few critical flows once the app is real.

Run:
- `pnpm dev` — Expo dev server.
- `pnpm typecheck`.
- EAS for builds: `eas build --platform ios --profile production` (after `eas login`).
