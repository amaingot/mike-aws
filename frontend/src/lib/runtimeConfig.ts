// Public configuration resolved at RUNTIME rather than baked into the client
// bundle at build time.
//
// NEXT_PUBLIC_* values are normally inlined by `next build`, which forces an image
// rebuild for every deployment (different API URL, Cognito pool, etc.). Instead the
// server serves them from /__env at request time (see src/app/__env/route.ts),
// which sets window.__MIKE_ENV__ before hydration; this module reads from there,
// falling back to the build-time-inlined process.env so `next dev` and tests keep
// working unchanged. One published image can then be configured entirely via
// environment variables at container start.

export const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_AWS_REGION",
  "NEXT_PUBLIC_COGNITO_USER_POOL_ID",
  "NEXT_PUBLIC_COGNITO_CLIENT_ID",
  "NEXT_PUBLIC_COGNITO_ENDPOINT",
] as const;

export type PublicEnvKey = (typeof PUBLIC_ENV_KEYS)[number];

// Build-time fallbacks. Only *static* `process.env.NEXT_PUBLIC_*` references are
// inlined into the client bundle, so they must be spelled out literally here
// (a dynamic `process.env[key]` is not inlined on the client).
const BUILD_TIME: Record<PublicEnvKey, string | undefined> = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_ENDPOINT: process.env.NEXT_PUBLIC_COGNITO_ENDPOINT,
};

export function publicEnv(key: PublicEnvKey): string | undefined {
  // Server (including the /__env route handler): read live process.env at request
  // time — never inlined, always the container's runtime value.
  if (typeof window === "undefined") {
    const value = process.env[key];
    return value ? value : undefined;
  }
  // Browser: runtime-injected values win; fall back to the build-time bundle.
  const fromWindow = window.__MIKE_ENV__?.[key];
  if (fromWindow) return fromWindow;
  const fromBuild = BUILD_TIME[key];
  return fromBuild ? fromBuild : undefined;
}

export function apiBaseUrl(): string {
  return publicEnv("NEXT_PUBLIC_API_BASE_URL") ?? "http://localhost:3001";
}
