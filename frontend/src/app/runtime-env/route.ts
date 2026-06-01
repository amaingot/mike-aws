import { PUBLIC_ENV_KEYS } from "@/lib/runtimeConfig";

// Serves the public configuration to the browser at runtime as
// `window.__MIKE_ENV__ = { ... }`. Marked dynamic so process.env is read on every
// request inside the running container and never inlined at build time — this is
// what lets one published image be configured purely via environment variables.
// Loaded by a beforeInteractive <Script> in the root layout so the values are set
// before any client code runs. (Not named with a leading underscore — Next treats
// `_`-prefixed folders as private and excludes them from routing.)
export const dynamic = "force-dynamic";

export function GET(): Response {
  const env: Record<string, string> = {};
  for (const key of PUBLIC_ENV_KEYS) {
    const value = process.env[key];
    if (value) env[key] = value;
  }

  // Served as an external script (not inline HTML), so there is no HTML-context
  // injection surface; JSON.stringify safely encodes the (server-controlled) values.
  const body = `window.__MIKE_ENV__ = ${JSON.stringify(env)};`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
