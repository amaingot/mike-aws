declare module "*.css";

// Public runtime configuration injected by /__env (see src/lib/runtimeConfig.ts).
interface MikePublicEnv {
  NEXT_PUBLIC_API_BASE_URL?: string;
  NEXT_PUBLIC_AWS_REGION?: string;
  NEXT_PUBLIC_COGNITO_USER_POOL_ID?: string;
  NEXT_PUBLIC_COGNITO_CLIENT_ID?: string;
  NEXT_PUBLIC_COGNITO_ENDPOINT?: string;
}

interface Window {
  __MIKE_ENV__?: MikePublicEnv;
}
